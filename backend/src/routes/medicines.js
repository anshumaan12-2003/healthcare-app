// src/routes/medicines.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/medicines
router.get('/', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      where: { patientId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// POST /api/medicines
router.post('/', authenticate, authorize('PATIENT'), async (req, res) => {
  const { name, dosage, frequency, startDate, endDate, reminderTimes } = req.body;
  if (!name || !dosage || !frequency || !startDate) {
    return res.status(400).json({ error: 'name, dosage, frequency and startDate are required' });
  }
  try {
    const medicine = await prisma.medicine.create({
      data: {
        patientId: req.user.id,
        name,
        dosage,
        frequency,
        startDate,
        endDate: endDate || null,
        reminderTimes: reminderTimes || [],
      },
    });
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add medicine' });
  }
});

// PATCH /api/medicines/:id/toggle — toggle active
router.patch('/:id/toggle', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const med = await prisma.medicine.findUnique({ where: { id: req.params.id } });
    if (!med || med.patientId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.medicine.update({
      where: { id: req.params.id },
      data: { active: !med.active },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// DELETE /api/medicines/:id
router.delete('/:id', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const med = await prisma.medicine.findUnique({ where: { id: req.params.id } });
    if (!med || med.patientId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    await prisma.medicine.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
