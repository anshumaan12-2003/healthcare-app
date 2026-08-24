// src/routes/doctors.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/doctors — list all doctors (public)
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const result = doctors.map((d) => {
      const avgRating =
        d.reviews.length > 0
          ? d.reviews.reduce((sum, r) => sum + r.rating, 0) / d.reviews.length
          : 0;
      return {
        id: d.id,
        name: d.user.name,
        email: d.user.email,
        avatar: d.user.avatar,
        specialty: d.specialty,
        bio: d.bio,
        consultationFee: d.consultationFee,
        experience: d.experience,
        availableSlots: d.availableSlots,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: d.reviews.length,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/:id — single doctor detail
router.get('/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        reviews: {
          include: { patient: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const avgRating =
      doctor.reviews.length > 0
        ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length
        : 0;

    res.json({ ...doctor, avgRating: Math.round(avgRating * 10) / 10 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

// GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
router.get('/:id/available-slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date is required' });

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const allSlots = (doctor.availableSlots)[dayName] || [];

    // Remove already booked slots
    const booked = await prisma.appointment.findMany({
      where: {
        doctorId: req.params.id,
        date,
        status: { notIn: ['CANCELLED'] },
      },
      select: { timeSlot: true },
    });
    const bookedSlots = booked.map((a) => a.timeSlot);
    const available = allSlots.filter((s) => !bookedSlots.includes(s));

    res.json({ date, dayName, available, booked: bookedSlots });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// PUT /api/doctors/profile — doctor updates own profile
router.put('/profile', authenticate, authorize('DOCTOR'), async (req, res) => {
  const { bio, consultationFee, availableSlots, experience } = req.body;
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    const updated = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(consultationFee !== undefined && { consultationFee: parseFloat(consultationFee) }),
        ...(availableSlots !== undefined && { availableSlots }),
        ...(experience !== undefined && { experience: parseInt(experience) }),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
