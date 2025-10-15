import { client } from "../client.js";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);
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

    const newDoctor = await client.create({
      _type: "doctor",
      ...doctorData,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
};

/**
 * @desc Update a doctor
 * @route PUT /api/doctors/:doctorId
 * @access Admin
 */
// ✅ Update Doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDoctor = await client
      .patch(id)
      .set(req.body)
      .commit();

    updatedDoctor.photo = updatedDoctor.photo
      ? urlFor(updatedDoctor.photo).url()
      : null;

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Delete a doctor
 * @route DELETE /api/doctors/:doctorId
 * @access Admin
 */
export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const query = `*[_type == "doctor" && doctorId == $doctorId][0]{ _id }`;
    const doctor = await client.fetch(query, { doctorId });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await client.delete(doctor._id);

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
// ✅ Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const query = `*[_type == "doctor"] | order(_createdAt desc)`;
    const doctors = await client.fetch(query);

    const formattedDoctors = doctors.map((doc) => ({
      ...doc,
      photo: doc.photo ? urlFor(doc.photo).url() : null,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * @desc Get single doctor by ID
 * @route GET /api/doctors/:doctorId
 * @access Public
 */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const query = `*[_type == "doctor" && _id == $id][0]`;
    const doctor = await client.fetch(query, { id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    doctor.photo = doctor.photo ? urlFor(doctor.photo).url() : null;

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error.message);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

