// src/routes/reviews.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/reviews/doctor/:doctorId — public
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { doctorId: req.params.doctorId },
      include: { patient: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — patient submits a review
router.post('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  if (!appointmentId || !rating) {
    return res.status(400).json({ error: 'appointmentId and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.patientId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed appointments' });
    }

    const review = await prisma.review.create({
      data: {
        appointmentId,
        patientId: req.user.id,
        doctorId: appointment.doctorId,
        rating: parseInt(rating),
        comment: comment || '',
      },
    });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'You have already reviewed this appointment' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
