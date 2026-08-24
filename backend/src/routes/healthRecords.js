// src/routes/healthRecords.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

// POST /api/health-records
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });
  
  const patientId = req.user.role === 'PATIENT' ? req.user.id : req.body.patientId;
  if (!patientId) return res.status(400).json({ error: 'patientId is required' });

  try {
    let doctorId = null;
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
      if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });
      doctorId = doctor.id;
    }

    const record = await prisma.healthRecord.create({
      data: {
        patientId,
        doctorId, // null if uploaded by patient
        appointmentId: req.body.appointmentId || null,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
      },
    });

    if (req.user.role === 'DOCTOR') {
      await prisma.notification.create({
        data: {
          userId: patientId,
          type: 'HEALTH_RECORD_UPLOADED',
          message: `A new health record "${req.file.originalname}" has been uploaded by your doctor.`,
        },
      });
    }

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload health record' });
  }
});

// GET /api/health-records/my — patient views their records
router.get('/my', authenticate, authorize('PATIENT'), async (req, res) => {
  try {
    const records = await prisma.healthRecord.findMany({
      where: { patientId: req.user.id },
      include: { doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

// GET /api/health-records/patient/:patientId — doctor views a patient's records
router.get('/patient/:patientId', authenticate, authorize('DOCTOR'), async (req, res) => {
  try {
    const records = await prisma.healthRecord.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

module.exports = router;
