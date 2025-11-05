import { client } from "../client.js";

// Generate URL-friendly slug
const generateSlug = async (name) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove special characters
    .trim()
    .replace(/\s+/g, "-"); // spaces → "-"

  // Check if slug exists already
  const query = `*[_type == "doctor" && slug.current match $slugPattern]{slug}`;
  const result = await client.fetch(query, { slugPattern: `${baseSlug}*` });

  if (!result.length) return baseSlug;

  // If exists, append number
  return `${baseSlug}-${result.length + 1}`;
};

/**
 * @desc Create a new doctor
 * @route POST /api/doctors
 * @access Admin
 */
export const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;

    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Combine first + last name
    const fullName = `${doctorData.firstName || ""} ${
      doctorData.lastName || ""
    }`.trim();

    const slug = await generateSlug(fullName);

    const newDoctor = await client.create({
      _type: "doctor",
      slug: { _type: "slug", current: slug },

      name: fullName,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      bio: doctorData.bio,
      imageUrl: doctorData.image, // ✅ we only save normal URL
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
};

/**
 * @desc Update doctor
 * @route PUT /api/doctors/:id
 * @access Admin
 */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // If updating name fields
    if (req.body.firstName || req.body.lastName) {
      const fullName = `${req.body.firstName || ""} ${
        req.body.lastName || ""
      }`.trim();
      req.body.name = fullName;
      delete req.body.firstName;
      delete req.body.lastName;
    }

    // If updating image
    if (req.body.image) {
      req.body.imageUrl = req.body.image;
      delete req.body.image;
    }

    const updatedDoctor = await client.patch(id).set(req.body).commit();

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

/**
 * @desc Delete doctor
 * @route DELETE /api/doctors/:id
 * @access Admin
 */
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
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
    const query = `*[_type == "doctor"] | order(_createdAt desc)`;

    const doctors = await client.fetch(query);

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/**
 * @desc Get doctor by ID
 * @route GET /api/doctors/:id
 * @access Public
 */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await client.getDocument(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

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

    const query = `*[_type == "doctor" && specialization == $specialization] | order(name asc)`;
    const doctors = await client.fetch(query, { specialization });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Get doctors by specialization error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/**
 * @desc Search doctors by name or specialization
 * @route GET /api/doctors/search/:q
 * @access Public
 */
export const searchDoctors = async (req, res) => {
  try {
    const { q } = req.params;

    const query = `*[_type == "doctor" && (name match $q || specialization match $q)] | order(name asc)`;
    const doctors = await client.fetch(query, { q: `*${q}*` });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};
