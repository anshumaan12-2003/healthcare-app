// src/routes/vitals.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

const VITAL_UNITS = {
  BLOOD_PRESSURE: 'mmHg',
  HEART_RATE: 'bpm',
  WEIGHT: 'kg',
  BLOOD_SUGAR: 'mg/dL',
  TEMPERATURE: '°C',
  SPO2: '%',
};

// POST /api/vitals — log a vital
router.post('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { type, value, notes } = req.body;
  if (!type || !value) return res.status(400).json({ error: 'type and value required' });
  if (!VITAL_UNITS[type]) return res.status(400).json({ error: 'Invalid vital type' });

  try {
    const vital = await prisma.vital.create({
      data: {
        patientId: req.user.id,
        type,
        value: String(value),
        unit: VITAL_UNITS[type],
        notes: notes || null,
      },
    });
    res.status(201).json(vital);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log vital' });
  }
});

// GET /api/vitals — get all vitals for logged-in patient
router.get('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { type, limit = 30 } = req.query;
  try {
    const vitals = await prisma.vital.findMany({
      where: {
        patientId: req.user.id,
        ...(type && { type }),
      },
      orderBy: { recordedAt: 'desc' },
      take: parseInt(limit),
    });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

// DELETE /api/vitals/:id
router.delete('/:id', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const vital = await prisma.vital.findUnique({ where: { id: req.params.id } });
    if (!vital || vital.patientId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    await prisma.vital.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
