import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property listing management
 */

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property listing
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - location
 *               - features
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Luxury Villa in Banana Island
 *               price:
 *                 type: number
 *                 example: 250000000
 *               location:
 *                 type: string
 *                 example: Ikoyi, Lagos, Nigeria
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Swimming Pool", "24/7 Security", "Gym"]
 *               carsGarage:
 *                 type: number
 *                 example: 3
 *               description:
 *                 type: string
 *                 example: A beautiful modern villa with ocean views.
 *     responses:
 *       201:
 *         description: Property successfully created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", createProperty);

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Retrieve all property listings
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: Successfully fetched property list
 *       500:
 *         description: Server error
 */
router.get("/", getAllProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get property details by ID
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sanity document ID of the property
 *     responses:
 *       200:
 *         description: Successfully fetched property details
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPropertyById);

export default router;
