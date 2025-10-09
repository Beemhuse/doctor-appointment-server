import express from 'express';
const router = express.Router();
// import { authenticate, authorizeRole } from '../middleware/auth.js';
import { createAppointment, getAppointments, updateAppointmentStatus } from '../controllers/appointment.controllers.js';
import { authenticate, authorizeRole } from '../middleware/auth.middleware.js';


// Create appointment (patient)
router.post('/', authenticate, createAppointment);


// Get appointments for user (patient or doctor)
router.get('/', authenticate, getAppointments);


// Only doctor can update status
router.patch('/:id/status', authenticate, authorizeRole('doctor'), updateAppointmentStatus);


export default router;