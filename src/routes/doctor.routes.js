import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctor.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management endpoints
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Server error
 */
router.get("/", getAllDoctors);

/**
 * @swagger
 * /api/doctors/{doctorId}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor found
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getDoctorById);

// Protected routes (Admin only)
router.use(authenticate);

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post("/", createDoctor);

/**
 * @swagger
 * /api/doctors/{doctorId}:
 *   put:
 *     summary: Update doctor information
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               specialization: Cardiology
 *               experience: 10
 *     responses:
 *       200:
 *         description: Doctor updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Doctor not found
 */
router.put("/:doctorId", updateDoctor);

/**
 * @swagger
 * /api/doctors/{doctorId}:
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Doctor not found
 */
router.delete("/:doctorId", deleteDoctor);

export default router;
