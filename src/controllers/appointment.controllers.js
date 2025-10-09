import { client } from "../client.js";



// Create appointment
export const createAppointment = async (req, res) => {
try {
const { doctorId, date, notes } = req.body;
if (!doctorId || !date) return res.status(400).json({ message: 'doctorId and date are required' });


// Example structure: store refs to user docs
const doc = {
_type: 'appointment',
patient: { _type: 'reference', _ref: req.user.id },
doctor: { _type: 'reference', _ref: doctorId },
date: date,
status: 'pending',
notes: notes || ''
};


const created = await client.create(doc);
res.status(201).json({ appointment: created });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};


export const getAppointments = async (req, res) => {
try {
const userId = req.user.id;
// If doctor, return appointments where doctor == user
if (req.user.role === 'doctor') {
const q = `*[_type == "appointment" && doctor._ref == $userId] { ..., patient->{name,email}, doctor->{name,email} }`;
const appts = await client.fetch(q, { userId });
return res.json({ appointments: appts });
}


// patient
const q = `*[_type == "appointment" && patient._ref == $userId] { ..., patient->{name,email}, doctor->{name,email} }`;
const appts = await client.fetch(q, { userId });
res.json({ appointments: appts });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};


export const updateAppointmentStatus = async (req, res) => {
try {
const { id } = req.params;
const { status } = req.body;
if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });


// Ensure the doctor owns the appointment
const appt = await client.fetch('*[_type == "appointment" && _id == $id][0]', { id });
if (!appt) return res.status(404).json({ message: 'Not found' });
if (appt.doctor._ref !== req.user.id) return res.status(403).json({ message: 'Not allowed' });


const patched = await client.patch(id).set({ status }).commit();
res.json({ appointment: patched });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
};