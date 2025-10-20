// controllers/propertyController.js
import { client } from "../client.js";

// 📍 Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const query = `*[_type == "property"] | order(createdAt desc) {
      _id,
      title,
      description,
      price,
      location,
      features,
      bedrooms,
      bathrooms,
      garage,
      propertyType,
      images
    }`;

    const properties = await client.fetch(query);
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// 🏠 Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `*[_type == "property" && _id == $id][0]`;
    const property = await client.fetch(query, { id });

    if (!property)
      return res.status(404).json({ error: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

// ➕ Create a new property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      features,
      bedrooms,
      bathrooms,
      garage,
      propertyType,
      images,
    } = req.body;

    const doc = {
      _type: "property",
      title,
      description,
      price,
      location,
      features,
      bedrooms,
      bathrooms,
      garage,
      propertyType,
      images,
      createdAt: new Date().toISOString(),
    };

    const newProperty = await client.create(doc);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// 🗑️ Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await client.delete(id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
};
