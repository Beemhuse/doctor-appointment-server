// controllers/userController.js
import { client } from "../client.js"

// Get user by authenticated token
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user  // Extracted from the token (middleware)
    console.log(id)

    const query = `*[_type == "user" && _id == $id][0]{
      _id,
      name,
      email,
      biologicalSex,
      preferredPronouns,
      birthday, 
      height,
      weight,
      bloodType,
      contactInfo,
      medicalConditions,
      allergies,
      currentMedications,
      medicalOperations,
      patientNotes,
    }`

    const user = await client.fetch(query, { id })
    console.log(user)
    if (!user) return res.status(404).json({ error: "User not found" })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" })
  }
}

// Update user medical information
export const updateUserMedicalInfo = async (req, res) => {
  try {
    const { id } = req.user
    const medicalData = req.body

    const query = `*[_type == "user" && _id == $id][0]{ _id }`
    const user = await client.fetch(query, { id })

    if (!user) return res.status(404).json({ error: "User not found" })

    const updatedUser = await client
      .patch(user._id)
      .set({
        medicalConditions: medicalData.medicalConditions || [],
        allergies: medicalData.allergies || [],
        currentMedications: medicalData.currentMedications || [],
        medicalOperations: medicalData.medicalOperations || [],
        patientNotes: medicalData.patientNotes || []
      })
      .commit()

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: "Failed to update medical information" })
  }
}

// Update user basic information
export const updateUserBasicInfo = async (req, res) => {
  try {
    const { id } = req.user
    const basicData = req.body

    const query = `*[_type == "user" && _id == $id][0]{ _id }`
    const user = await client.fetch(query, { id })

    if (!user) return res.status(404).json({ error: "User not found" })

    const updatedUser = await client
      .patch(user._id)
      .set({
        firstName: basicData.firstName,
        lastName: basicData.lastName,
        biologicalSex: basicData.biologicalSex,
        preferredPronouns: basicData.preferredPronouns,
        birthday: basicData.birthday,
        height: basicData.height,
        weight: basicData.weight,
        bloodType: basicData.bloodType
      })
      .commit()

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: "Failed to update basic information" })
  }
}

// Update user contact information
export const updateUserContactInfo = async (req, res) => {
  try {
    const { id } = req.user
    const contactData = req.body

    const query = `*[_type == "user" && _id == $id][0]{ _id }`
    const user = await client.fetch(query, { id })

    if (!user) return res.status(404).json({ error: "User not found" })

    const updatedUser = await client
      .patch(user._id)
      .set({
        contactInfo: {
          mobileNumber1: contactData.mobileNumber1,
          mobileNumber2: contactData.mobileNumber2,
          addressLine1: contactData.addressLine1,
          addressLine2: contactData.addressLine2,
          country: contactData.country,
          state: contactData.state
        }
      })
      .commit()

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact information" })
  }
}

// Complete user profile update (all sections)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const profileData = req.body;

    // Fetch the user by ID
    const query = `*[_type == "user" && _id == $id][0]{ _id, is_profile_complete }`;
    const user = await client.fetch(query, { id });

    if (!user) return res.status(404).json({ error: "User not found" });

    // If profile is already complete, prevent further updates
    if (user.is_profile_complete) {
      return res.status(400).json({
        message: "Profile is already complete. No further updates allowed.",
      });
    }

    // Proceed with update and mark as complete
    const updatedUser = await client
      .patch(user._id)
      .set({
        ...profileData,
        is_profile_complete: true,
      })
      .commit();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update user profile" });
  }
};
