import { client } from "../client.js";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

async function uploadImageFromUrl(imageUrl) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Upload to Sanity
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop()
    });

    return asset;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}
/**
 * @desc Create a new doctor
 * @route POST /api/doctors
 * @access Admin
 */
export const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    let processedData = { ...doctorData };

    // Handle image data
    if (doctorData.image) {
      if (typeof doctorData.image === 'string') {
        // If it's a URL, upload it to Sanity first
        try {
          const asset = await uploadImageFromUrl(doctorData.image);
          processedData.image = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            },
            hotspot: {
              x: 0.5,
              y: 0.5,
              height: 1,
              width: 1
            },
            crop: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          };
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
          delete processedData.image;
        }
      } else if (doctorData.image.asset && doctorData.image.asset._ref) {
        // If it's already a Sanity image reference, use it as is
        processedData.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: doctorData.image.asset._ref
          },
          hotspot: doctorData.image.hotspot || {
            x: 0.5,
            y: 0.5,
            height: 1,
            width: 1
          },
          crop: doctorData.image.crop || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        };
      }
    }

    const newDoctor = await client.create({
      _type: "doctor",
      ...processedData,
      createdAt: new Date().toISOString(),
    });

    // Format response with URL for frontend
    const responseDoctor = {
      ...newDoctor,
      imageUrl: newDoctor.image ? urlFor(newDoctor.image).url() : null
    };

    res.status(201).json(responseDoctor);
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
};
/**
 * @desc Update a doctor
 * @route PUT /api/doctors/:id
 * @access Admin
 */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if doctor exists
    const existingDoctor = await client.getDocument(id);
    if (!existingDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const updatedDoctor = await client
      .patch(id)
      .set(req.body)
      .commit();

    // Format the response with image URL
    updatedDoctor.image = updatedDoctor.image ? urlFor(updatedDoctor.image).url() : null;

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

/**
 * @desc Delete a doctor
 * @route DELETE /api/doctors/:id
 * @access Admin
 */
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if doctor exists
    const existingDoctor = await client.getDocument(id);
    if (!existingDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await client.delete(id);

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};

/**
 * @desc Get all doctors
 * @route GET /api/doctors
 * @access Public
 */
export const getAllDoctors = async (req, res) => {
  try {
    const query = `*[_type == "doctor"] | order(_createdAt desc){
      _id,
      name,
      image,
      hospital,
      specialization,
      yearsOfExperience,
      expertise,
      contact,
      isActive,
      slug
    }`;

    const doctors = await client.fetch(query);

    const formattedDoctors = doctors.map((doctor) => ({
      ...doctor,
      image: doctor.image ? urlFor(doctor.image).url() : null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/**
 * @desc Get single doctor by ID
 * @route GET /api/doctors/:id
 * @access Public
 */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const query = `*[_type == "doctor" && _id == $id][0]{
      _id,
      name,
      image,
      specialization,
      hospital,
      yearsOfExperience,
      qualifications,
      expertise,
      contact,
      availability,
      languages,
      consultationFee,
      rating,
      about,
      education,
      awards,
      isActive,
      slug,
      _createdAt,
      _updatedAt
    }`;

    const doctor = await client.fetch(query, { id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Format the response with image URL
    doctor.image = doctor.image ? urlFor(doctor.image).url() : null;

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

/**
 * @desc Get doctors by specialization
 * @route GET /api/doctors/specialization/:specialization
 * @access Public
 */
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    const query = `*[_type == "doctor" && specialization == $specialization && isActive == true] | order(name asc){
      _id,
      name,
      image,
      specialization,
      hospital,
      yearsOfExperience,
      qualifications,
      expertise,
      contact,
      availability,
      languages,
      consultationFee,
      rating,
      about,
      isActive,
      slug
    }`;

    const doctors = await client.fetch(query, { specialization });

    const formattedDoctors = doctors.map((doctor) => ({
      ...doctor,
      image: doctor.image ? urlFor(doctor.image).url() : null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Get doctors by specialization error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/**
 * @desc Get doctors by hospital
 * @route GET /api/doctors/hospital/:hospital
 * @access Public
 */
export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospital } = req.params;

    const query = `*[_type == "doctor" && hospital == $hospital && isActive == true] | order(name asc){
      _id,
      name,
      image,
      specialization,
      hospital,
      yearsOfExperience,
      qualifications,
      expertise,
      contact,
      availability,
      languages,
      consultationFee,
      rating,
      about,
      isActive,
      slug
    }`;

    const doctors = await client.fetch(query, { hospital });

    const formattedDoctors = doctors.map((doctor) => ({
      ...doctor,
      image: doctor.image ? urlFor(doctor.image).url() : null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Get doctors by hospital error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/**
 * @desc Search doctors by name or specialization
 * @route GET /api/doctors/search/:query
 * @access Public
 */
export const searchDoctors = async (req, res) => {
  try {
    const { query } = req.params;

    const searchQuery = `*[_type == "doctor" && (name match $query || specialization match $query) && isActive == true] | order(name asc){
      _id,
      name,
      image,
      specialization,
      hospital,
      yearsOfExperience,
      qualifications,
      expertise,
      contact,
      availability,
      languages,
      consultationFee,
      rating,
      about,
      isActive,
      slug
    }`;

    const doctors = await client.fetch(searchQuery, { query: `*${query}*` });

    const formattedDoctors = doctors.map((doctor) => ({
      ...doctor,
      image: doctor.image ? urlFor(doctor.image).url() : null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};