import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointment.controllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management APIs
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "doctor_123"
 *               date:
 *                 type: string
 *                 example: "2025-10-20T14:00:00Z"
 *               appointmentType:
 *                 type: string
 *                 example: "Consultation"
 *               service:
 *                 type: string
 *                 example: "Cardiology"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               city:
 *                 type: string
 *                 example: "Ikeja"
 *               hospital:
 *                 type: string
 *                 example: "St. Mary Hospital"
 *               appointmentTime:
 *                 type: string
 *                 example: "2:00 PM"
 *               recommendedDateTime:
 *                 type: string
 *                 example: "2025-10-22T10:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "Prefer morning session"
 *               paymentMethod:
 *                 type: string
 *                 example: "card"
 *               paymentStatus:
 *                 type: string
 *                 example: "paid"
 *               transactionId:
 *                 type: string
 *                 example: "txn_874923"
 *               amountPaid:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments for the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, getAppointments);

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (doctor only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Appointment ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Appointment status updated
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/status", authenticate, updateAppointmentStatus);

export default router;
