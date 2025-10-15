// controllers/userController.js
import client from '../lib/sanityClient.js'

// Get user by userId (auth ID)
export const getUserByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const query = `*[_type == "user" && userId == $userId][0]{
      _id,
      firstName,
      lastName,
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
      userId
    }`
    
    const user = await client.fetch(query, { userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}

// Update user medical information
export const updateUserMedicalInfo = async (req, res) => {
  try {
    const { userId } = req.params
    const medicalData = req.body
    
    // Find user by userId first
    const query = `*[_type == "user" && userId == $userId][0]{ _id }`
    const user = await client.fetch(query, { userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
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
    res.status(500).json({ error: 'Failed to update medical information' })
  }
}

// Update user basic information
export const updateUserBasicInfo = async (req, res) => {
  try {
    const { userId } = req.params
    const basicData = req.body
    
    // Find user by userId first
    const query = `*[_type == "user" && userId == $userId][0]{ _id }`
    const user = await client.fetch(query, { userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
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
    res.status(500).json({ error: 'Failed to update basic information' })
  }
}

// Update user contact information
export const updateUserContactInfo = async (req, res) => {
  try {
    const { userId } = req.params
    const contactData = req.body
    
    // Find user by userId first
    const query = `*[_type == "user" && userId == $userId][0]{ _id }`
    const user = await client.fetch(query, { userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
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
    res.status(500).json({ error: 'Failed to update contact information' })
  }
}

// Complete user profile update (all sections)
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const profileData = req.body
    
    // Find user by userId first
    const query = `*[_type == "user" && userId == $userId][0]{ _id }`
    const user = await client.fetch(query, { userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const updatedUser = await client
      .patch(user._id)
      .set(profileData)
      .commit()
    
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' })
  }
}