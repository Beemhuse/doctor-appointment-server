// controllers/contactController.js
import { client } from "../client.js"

// Create a new contact form submission
export const createContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const contactDoc = {
      _type: "contact",
      fullName,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    }

    const newContact = await client.create(contactDoc)
    res.status(201).json({
      message: "Contact form submitted successfully",
      data: newContact,
    })
  } catch (error) {
    console.error("Error creating contact:", error)
    res.status(500).json({ error: "Failed to submit contact form" })
  }
}

// Get all contact submissions (for admin)
export const getAllContacts = async (req, res) => {
  try {
    const query = `*[_type == "contact"] | order(submittedAt desc)`
    const contacts = await client.fetch(query)

    res.status(200).json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ error: "Failed to fetch contact submissions" })
  }
}

// Get a single contact message by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params

    const query = `*[_type == "contact" && _id == $id][0]`
    const contact = await client.fetch(query, { id })

    if (!contact) {
      return res.status(404).json({ error: "Contact message not found" })
    }

    res.status(200).json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    res.status(500).json({ error: "Failed to fetch contact message" })
  }
}
