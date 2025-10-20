import express from "express";
import { createContact, getAllContacts } from "../controllers/contact.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form submissions
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a new contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - message
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               subject:
 *                 type: string
 *                 example: Inquiry about property listing
 *               message:
 *                 type: string
 *                 example: Hello, I’m interested in one of your listings. Can we schedule a viewing?
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", createContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Retrieve all contact submissions
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Successfully fetched contact submissions
 *       500:
 *         description: Server error
 */
router.get("/", getAllContacts);

export default router;
