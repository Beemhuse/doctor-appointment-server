import { client } from "../client.js";

/** Generate unique, URL-friendly slug */
const generateSlug = async (name) => {
  try {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const query = `*[_type == "doctor" && slug.current match $slugPattern]{slug}`;
    const result = await client.fetch(query, { slugPattern: `${baseSlug}*` });

    if (!result.length) return baseSlug;
    return `${baseSlug}-${result.length + 1}`;
  } catch (err) {
    console.error("Slug generation error:", err);
    throw new Error("Failed to generate slug");
  }
};

/** ----------------------------------------------
 * @desc Create a new doctor
 * @route POST /api/doctors
 * @access Admin
 * ----------------------------------------------*/
export const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;

    if (!req.user || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!doctorData.firstName || !doctorData.lastName) {
      return res
        .status(400)
        .json({ error: "First name and last name are required" });
    }

    const fullName = `${doctorData.firstName} ${doctorData.lastName}`.trim();
    const slug = await generateSlug(fullName);

    const newDoctor = await client.create({
      _type: "doctor",
      slug: { _type: "slug", current: slug },
      name: fullName,
      specialization: doctorData.specialization || "General",
      experience: doctorData.experience || 0,
      bio: doctorData.bio || "",
      imageUrl: doctorData.image || null,
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
};

/** ----------------------------------------------
 * @desc Update a doctor
 * @route PUT /api/doctors/:id
 * @access Admin
 * ----------------------------------------------*/
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    if (!req.user || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if doctor exists before updating
    const existingDoctor = await client.getDocument(id);
    if (!existingDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Merge full name if first or last name updated
    if (req.body.firstName || req.body.lastName) {
      const fullName = `${req.body.firstName || existingDoctor.firstName || ""} ${
        req.body.lastName || existingDoctor.lastName || ""
      }`.trim();
      req.body.name = fullName;
      delete req.body.firstName;
      delete req.body.lastName;
    }

    // Map image if present
    if (req.body.image) {
      req.body.imageUrl = req.body.image;
      delete req.body.image;
    }

    const updatedDoctor = await client
      .patch(id)
      .set(req.body)
      .commit()
      .catch((err) => {
        console.error("Sanity patch error:", err);
        throw new Error("Failed to update doctor");
      });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ error: error.message || "Failed to update doctor" });
  }
};

/** ----------------------------------------------
 * @desc Delete a doctor
 * @route DELETE /api/doctors/:id
 * @access Admin
 * ----------------------------------------------*/
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    if (!req.user || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const existingDoctor = await client.getDocument(id);
    if (!existingDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await client.delete(id).catch((err) => {
      console.error("Sanity delete error:", err);
      throw new Error("Failed to delete doctor");
    });

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ error: error.message || "Failed to delete doctor" });
  }
};

/** ----------------------------------------------
 * @desc Get all doctors
 * @route GET /api/doctors
 * @access Public
 * ----------------------------------------------*/
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

/** ----------------------------------------------
 * @desc Get doctor by ID
 * @route GET /api/doctors/:id
 * @access Public
 * ----------------------------------------------*/
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const doctor = await client.getDocument(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

/** ----------------------------------------------
 * @desc Get doctors by specialization
 * @route GET /api/doctors/specialization/:specialization
 * @access Public
 * ----------------------------------------------*/
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    if (!specialization) {
      return res.status(400).json({ error: "Specialization is required" });
    }

    const query = `*[_type == "doctor" && specialization == $specialization] | order(name asc)`;
    const doctors = await client.fetch(query, { specialization });

    if (!doctors.length) {
      return res.status(404).json({ error: "No doctors found for this specialization" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Get doctors by specialization error:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

/** ----------------------------------------------
 * @desc Search doctors by name or specialization
 * @route GET /api/doctors/search/:q
 * @access Public
 * ----------------------------------------------*/
export const searchDoctors = async (req, res) => {
  try {
    const { q } = req.params;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Please provide a valid search term" });
    }

    const query = `*[_type == "doctor" && (name match $q || specialization match $q)] | order(name asc)`;
    const doctors = await client.fetch(query, { q: `*${q}*` });

    if (!doctors.length) {
      return res.status(404).json({ error: "No matching doctors found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({ error: "Failed to search doctors" });
  }
};
