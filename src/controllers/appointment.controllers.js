import { client } from "../client.js";

/**
 * @desc Create a new appointment
 * @route POST /appointments
 * @access Protected
 */
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      notes,
      appointmentType,
      service,
      state,
      city,
      hospital,
      appointmentTime,
      recommendedDateTime,
      paymentMethod,
      paymentStatus,
      transactionId,
      amountPaid
    } = req.body;

    if (!doctorId || !date)
      return res.status(400).json({ message: "doctorId and date are required" });

    const doc = {
      _type: "appointment",
      patient: { _type: "reference", _ref: req.user.id },
      doctor: { _type: "reference", _ref: doctorId },
      date,
      appointmentType: appointmentType || "",
      service: service || "",
      state: state || "",
      city: city || "",
      hospital: hospital || "",
      appointmentTime: appointmentTime || "",
      recommendedDateTime: recommendedDateTime || "",
      status: "pending",
      notes: notes || "",
      payment: {
        method: paymentMethod || "card",
        status: paymentStatus || "unpaid",
        transactionId: transactionId || "",
        amount: amountPaid || 0
      }
    };

    const created = await client.create(doc);
    res.status(201).json({ appointment: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all appointments for a user
 * @route GET /appointments
 * @access Protected
 */
export const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    let q;
    if (req.user.role === "doctor") {
      q = `*[_type == "appointment" && doctor._ref == $userId]{
        ...,
        patient->{name,email},
        doctor->{name,email}
      }`;
    } else {
      q = `*[_type == "appointment" && patient._ref == $userId]{
        ...,
        patient->{name,email},
        doctor->{name,email}
      }`;
    }

    const appointments = await client.fetch(q, { userId });
    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update appointment status
 * @route PATCH /appointments/:id/status
 * @access Protected (Doctor only)
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const appt = await client.fetch(
      '*[_type == "appointment" && _id == $id][0]',
      { id }
    );
    if (!appt) return res.status(404).json({ message: "Not found" });
    if (appt.doctor._ref !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const patched = await client.patch(id).set({ status }).commit();
    res.json({ appointment: patched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
