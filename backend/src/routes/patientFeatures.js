// src/routes/patientFeatures.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate, authorize('PATIENT'));

// DNA Profile
router.get('/dna', async (req, res) => {
  try {
    let dna = await prisma.dNAProfile.findUnique({ where: { patientId: req.user.id } });
    if (!dna) {
      dna = await prisma.dNAProfile.create({
        data: {
          patientId: req.user.id,
          rawDataUrl: 'https://storage.aws.com/dna-mock',
          riskMarkers: { BRCA1: 'Normal', APOE: 'Elevated Risk' }
        }
      });
    }
    res.json(dna);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch DNA profile' });
  }
});

// Sleep Logs
router.get('/sleep', async (req, res) => {
  try {
    const logs = await prisma.sleepLog.findMany({
      where: { patientId: req.user.id },
      orderBy: { date: 'desc' },
      take: 7
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sleep logs' });
  }
});

router.post('/sleep', async (req, res) => {
  try {
    const { date, durationHrs, quality } = req.body;
    const log = await prisma.sleepLog.create({
      data: { patientId: req.user.id, date, durationHrs: parseFloat(durationHrs), quality: parseInt(quality) }
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sleep log' });
  }
});

// Journal
router.get('/journal', async (req, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { patientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

router.post('/journal', async (req, res) => {
  try {
    const { content } = req.body;
    // Mock NLP sentiment analysis
    const sentiment = content.toLowerCase().includes('sad') ? 'NEGATIVE' : 
                      content.toLowerCase().includes('happy') ? 'POSITIVE' : 'NEUTRAL';
                      
    const entry = await prisma.journalEntry.create({
      data: { patientId: req.user.id, content, sentiment }
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Vaccinations
router.get('/vaccinations', async (req, res) => {
  try {
    const records = await prisma.vaccination.findMany({
      where: { patientId: req.user.id },
      orderBy: { dateAdministered: 'desc' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vaccinations' });
  }
});

// Pharmacy Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { patientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = await prisma.order.create({
      data: { patientId: req.user.id, items, totalAmount: parseFloat(totalAmount) }
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
