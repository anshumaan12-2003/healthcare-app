// src/routes/doctorFeatures.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate, authorize('DOCTOR'));

// CME Credits
router.get('/cme', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const credits = await prisma.cMECredit.findMany({
      where: { doctorId: doctor.id },
      orderBy: { dateEarned: 'desc' }
    });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch CME credits' });
  }
});

// MDT Chat (Messages)
router.get('/chat', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { channel: 'MDT_GENERAL' },
      include: { sender: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'asc' },
      take: 50
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { content } = req.body;
    const msg = await prisma.message.create({
      data: { senderId: req.user.id, content, channel: 'MDT_GENERAL' },
      include: { sender: { select: { name: true, role: true } } }
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
