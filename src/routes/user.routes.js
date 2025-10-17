// routes/userRoutes.js
import express from 'express'
import {
  updateUserMedicalInfo,
  updateUserBasicInfo,
  updateUserContactInfo,
  updateUserProfile,
  getUserProfile
} from '../controllers/user.controllers.js'
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router()

router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "User not found"
 * 
 *     BasicInfo:
 *       type: object
 *       required:
 *         - name
 *         - biologicalSex
 *         - birthday
 *       properties:
 *         name:
 *           type: string
 *           example: "Tristan Peter"
 *         biologicalSex:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         preferredPronouns:
 *           type: string
 *           example: "Helvim"
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         height:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 180
 *             unit:
 *               type: string
 *               enum: [cm, ft_in]
 *               example: "cm"
 *         weight:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 59
 *             unit:
 *               type: string
 *               enum: [kg, lbs]
 *               example: "kg"
 *         bloodType:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           example: "A+"
 * 
 *     ContactInfo:
 *       type: object
 *       required:
 *         - mobileNumber1
 *         - addressLine1
 *         - country
 *       properties:
 *         mobileNumber1:
 *           type: string
 *           example: "+63 9175045005"
 *         mobileNumber2:
 *           type: string
 *           example: "(Area Code) 000-0000-000"
 *         addressLine1:
 *           type: string
 *           example: "123 Main Street"
 *         addressLine2:
 *           type: string
 *           example: "Apt 4B"
 *         country:
 *           type: string
 *           example: "United States of America"
 *         state:
 *           type: string
 *           example: "California"
 * 
 *     MedicalCondition:
 *       type: object
 *       properties:
 *         condition:
 *           type: string
 *           example: "Hypertension"
 *         diagnosisDate:
 *           type: string
 *           format: date
 *           example: "2020-03-15"
 *         severity:
 *           type: string
 *           enum: [mild, moderate, severe]
 *           example: "moderate"
 *         isActive:
 *           type: boolean
 *           example: true
 *         notes:
 *           type: string
 *           example: "Controlled with medication"
 * 
 *     Allergy:
 *       type: object
 *       properties:
 *         allergen:
 *           type: string
 *           example: "Penicillin"
 *         reaction:
 *           type: string
 *           example: "Rash and swelling"
 *         severity:
 *           type: string
 *           enum: [mild, moderate, severe, life_threatening]
 *           example: "severe"
 *         notes:
 *           type: string
 *           example: "Avoid all penicillin-based antibiotics"
 * 
 *     Medication:
 *       type: object
 *       properties:
 *         medication:
 *           type: string
 *           example: "Lisinopril"
 *         dosage:
 *           type: string
 *           example: "10mg"
 *         frequency:
 *           type: string
 *           example: "Once daily"
 *         purpose:
 *           type: string
 *           example: "Blood pressure control"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2020-03-20"
 *         prescribingDoctor:
 *           type: string
 *           example: "Dr. Smith"
 * 
 *     MedicalOperation:
 *       type: object
 *       properties:
 *         operation:
 *           type: string
 *           example: "Appendectomy"
 *         date:
 *           type: string
 *           format: date
 *           example: "2015-07-10"
 *         surgeon:
 *           type: string
 *           example: "General Hospital"
 *         reason:
 *           type: string
 *           example: "Acute appendicitis"
 * 
 *     PatientNote:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           enum: [genetic, certification, dnr, advance_directive, other]
 *           example: "dnr"
 *         title:
 *           type: string
 *           example: "Do Not Resuscitate Order"
 *         description:
 *           type: string
 *           example: "Patient has signed DNR order"
 * 
 *     MedicalInfo:
 *       type: object
 *       properties:
 *         medicalConditions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicalCondition'
 *         allergies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Allergy'
 *         currentMedications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Medication'
 *         medicalOperations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicalOperation'
 *         patientNotes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PatientNote'
 * 
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "user-123"
 *         userId:
 *           type: string
 *           example: "auth0|123456789"
 *         firstName:
 *           type: string
 *           example: "Tristan Peter"
 *         lastName:
 *           type: string
 *           example: "Marcelino"
 *         biologicalSex:
 *           type: string
 *           example: "male"
 *         preferredPronouns:
 *           type: string
 *           example: "Helvim"
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         height:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 180
 *             unit:
 *               type: string
 *               example: "cm"
 *         weight:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 59
 *             unit:
 *               type: string
 *               example: "kg"
 *         bloodType:
 *           type: string
 *           example: "A+"
 *         contactInfo:
 *           $ref: '#/components/schemas/ContactInfo'
 *         medicalConditions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicalCondition'
 *         allergies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Allergy'
 *         currentMedications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Medication'
 *         medicalOperations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicalOperation'
 *         patientNotes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PatientNote'
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get user profile by user ID
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me',authenticate, getUserProfile)

/**
 * @swagger
 * /user/medical:
 *   put:
 *     summary: Update medical information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalInfo'
 *           example:
 *             medicalConditions:
 *               - condition: "Hypertension"
 *                 diagnosisDate: "2020-03-15"
 *                 severity: "moderate"
 *                 isActive: true
 *                 notes: "Controlled with medication"
 *             allergies:
 *               - allergen: "Penicillin"
 *                 reaction: "Rash and swelling"
 *                 severity: "severe"
 *                 notes: "Avoid all penicillin-based antibiotics"
 *             currentMedications:
 *               - medication: "Lisinopril"
 *                 dosage: "10mg"
 *                 frequency: "Once daily"
 *                 purpose: "Blood pressure control"
 *                 startDate: "2020-03-20"
 *                 prescribingDoctor: "Dr. Smith"
 *     responses:
 *       200:
 *         description: Medical information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/medical', updateUserMedicalInfo)

/**
 * @swagger
 * /user/basic:
 *   put:
 *     summary: Update basic information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BasicInfo'
 *           example:
 *             firstName: "Tristan Peter"
 *             lastName: "Marcelino"
 *             biologicalSex: "male"
 *             preferredPronouns: "Helvim"
 *             birthday: "1990-01-01"
 *             height:
 *               value: 180
 *               unit: "cm"
 *             weight:
 *               value: 59
 *               unit: "kg"
 *             bloodType: "A+"
 *     responses:
 *       200:
 *         description: Basic information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/basic', updateUserBasicInfo)

/**
 * @swagger
 * /user/contact:
 *   put:
 *     summary: Update contact information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "auth0|123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfo'
 *           example:
 *             mobileNumber1: "+63 9175045005"
 *             mobileNumber2: "(Area Code) 000-0000-000"
 *             addressLine1: "123 Main Street"
 *             addressLine2: "Apt 4B"
 *             country: "United States of America"
 *             state: "California"
 *     responses:
 *       200:
 *         description: Contact information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/contact', updateUserContactInfo)

/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Update entire user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "auth0|123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *           example:
 *             name: "Tristan Peter"
 *             biologicalSex: "male"
 *             preferredPronouns: "Helvim"
 *             birthday: "1990-01-01"
 *             height:
 *               value: 180
 *               unit: "cm"
 *             weight:
 *               value: 59
 *               unit: "kg"
 *             bloodType: "A+"
 *             contactInfo:
 *               mobileNumber1: "+63 9175045005"
 *               mobileNumber2: "(Area Code) 000-0000-000"
 *               addressLine1: "123 Main Street"
 *               addressLine2: "Apt 4B"
 *               country: "United States of America"
 *               state: "California"
 *             medicalConditions:
 *               - condition: "Hypertension"
 *                 diagnosisDate: "2020-03-15"
 *                 severity: "moderate"
 *                 isActive: true
 *             allergies:
 *               - allergen: "Penicillin"
 *                 reaction: "Rash and swelling"
 *                 severity: "severe"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/', updateUserProfile)

export default router