// src/routes/waitlist.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/waitlist — patient joins a waitlist
router.post('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { doctorId, date, timeSlot } = req.body;
  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'doctorId, date and timeSlot are required' });
  }

  try {
    const entry = await prisma.waitlist.create({
      data: { patientId: req.user.id, doctorId, date, timeSlot },
    });
    res.status(201).json(entry);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Already on the waitlist for this slot' });
    }
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
});

// GET /api/waitlist/my — patient views their waitlist
router.get('/my', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const entries = await prisma.waitlist.findMany({
      where: { patientId: req.user.id },
      include: { doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
});

// DELETE /api/waitlist/:id — remove from waitlist
router.delete('/:id', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const entry = await prisma.waitlist.findUnique({ where: { id: req.params.id } });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    if (entry.patientId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await prisma.waitlist.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed from waitlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from waitlist' });
  }
});

module.exports = router;
