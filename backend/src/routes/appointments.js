// src/routes/appointments.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/appointments — patient books an appointment
router.post('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { doctorId, date, timeSlot, symptoms } = req.body;

  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'doctorId, date and timeSlot are required' });
  }

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    // Check if slot is already taken
    const existing = await prisma.appointment.findFirst({
      where: { doctorId, date, timeSlot, status: { notIn: ['CANCELLED'] } },
    });
    if (existing) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user.id,
        doctorId,
        date,
        timeSlot,
        symptoms: symptoms || '',
        status: 'PENDING',
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { select: { name: true, email: true } },
      },
    });

    // Notify patient
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'APPOINTMENT_BOOKED',
        message: `Your appointment with ${appointment.doctor.user.name} on ${date} at ${timeSlot} is pending confirmation.`,
      },
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// GET /api/appointments/my — patient gets their appointments
router.get('/my', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user.id },
      include: {
        doctor: {
          include: { user: { select: { name: true, avatar: true } } },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/doctor — doctor gets their appointments
router.get('/doctor', authenticate, authorize('DOCTOR'), async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: { select: { name: true, email: true, phone: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// PATCH /api/appointments/:id/status — doctor changes status
router.patch('/:id/status', authenticate, authorize('DOCTOR'), async (req, res) => {
  const { status, notes, prescription } = req.body;
  const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.doctorId !== doctor.id) return res.status(403).json({ error: 'Unauthorized' });

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
        ...(prescription !== undefined && { prescription }),
      },
      include: { patient: { select: { name: true } } },
    });

    // Notify patient
    const messages = {
      CONFIRMED: `Your appointment on ${appointment.date} at ${appointment.timeSlot} has been confirmed.`,
      COMPLETED: `Your appointment has been completed. Check your health records for any uploaded documents.`,
      CANCELLED: `Your appointment on ${appointment.date} at ${appointment.timeSlot} has been cancelled by the doctor.`,
    };

    await prisma.notification.create({
      data: {
        userId: appointment.patientId,
        type: `APPOINTMENT_${status}`,
        message: messages[status],
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE /api/appointments/:id — patient cancels appointment
router.delete('/:id', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.patientId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
      return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled appointment' });
    }

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// GET /api/appointments/admin/all — admin sees all
router.get('/admin/all', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { name: true, email: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

module.exports = router;
