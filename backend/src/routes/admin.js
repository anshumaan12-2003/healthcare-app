// src/routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// All routes require ADMIN
router.use(authenticate, authorize('ADMIN'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, completedAppointments, pendingAppointments] =
      await Promise.all([
        prisma.user.count({ where: { role: 'PATIENT' } }),
        prisma.user.count({ where: { role: 'DOCTOR' } }),
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: 'COMPLETED' } }),
        prisma.appointment.count({ where: { status: 'PENDING' } }),
      ]);

    // Revenue (sum of consultation fees for completed)
    const completed = await prisma.appointment.findMany({
      where: { status: 'COMPLETED' },
      include: { doctor: { select: { consultationFee: true } } },
    });
    const totalRevenue = completed.reduce((sum, a) => sum + (a.doctor?.consultationFee || 0), 0);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// POST /api/admin/doctors — admin creates a doctor account
router.post('/doctors', async (req, res) => {
  const { name, email, password, specialty, bio, consultationFee, experience } = req.body;
  if (!name || !email || !password || !specialty) {
    return res.status(400).json({ error: 'name, email, password and specialty are required' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'DOCTOR' },
    });

    const slots = {
      Monday:    ['09:00', '10:00', '11:00', '14:00', '15:00'],
      Tuesday:   ['09:00', '10:00', '11:00', '14:00', '15:00'],
      Wednesday: ['10:00', '11:00', '14:00', '15:00'],
      Thursday:  ['09:00', '10:00', '11:00'],
      Friday:    ['09:00', '10:00', '11:00', '14:00', '15:00'],
    };

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty,
        bio: bio || '',
        consultationFee: parseFloat(consultationFee) || 500,
        experience: parseInt(experience) || 0,
        availableSlots: slots,
      },
    });

    res.status(201).json({ user, doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
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

// GET /api/admin/stats/monthly — chart data for last 6 months
router.get('/stats/monthly', async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const [total, completed, patients] = await Promise.all([
        prisma.appointment.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.appointment.count({ where: { status: 'COMPLETED', createdAt: { gte: start, lt: end } } }),
        prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: start, lt: end } } }),
      ]);

      // Revenue from completed appointments
      const completedAppts = await prisma.appointment.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: start, lt: end } },
        include: { doctor: { select: { consultationFee: true } } },
      });
      const revenue = completedAppts.reduce((sum, a) => sum + (a.doctor?.consultationFee || 0), 0);

      months.push({ label, total, completed, patients, revenue });
    }
    res.json(months);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
});

// GET /api/admin/stats/doctors — doctor performance leaderboard
router.get('/stats/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { name: true } },
        appointments: true,
        reviews: { select: { rating: true } },
      },
    });

    const leaderboard = doctors.map(d => {
      const completed = d.appointments.filter(a => a.status === 'COMPLETED').length;
      const revenue = completed * d.consultationFee;
      const avgRating = d.reviews.length > 0
        ? d.reviews.reduce((s, r) => s + r.rating, 0) / d.reviews.length
        : 0;
      return {
        name: d.user.name,
        specialty: d.specialty,
        total: d.appointments.length,
        completed,
        revenue,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    }).sort((a, b) => b.completed - a.completed);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctor stats' });
  }
});

// ==========================================
// NEW: ADMIN PHASE 1 ENDPOINTS
// ==========================================

// GET /api/admin/beds
router.get('/beds', async (req, res) => {
  try {
    const beds = await prisma.bed.findMany({ orderBy: { roomNumber: 'asc' } });
    res.json(beds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
});

// GET /api/admin/inventory
router.get('/inventory', async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({ orderBy: { itemName: 'asc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST /api/admin/inventory/order
router.post('/inventory/order', async (req, res) => {
  try {
    const { itemId, amount } = req.body;
    const item = await prisma.inventory.update({
      where: { id: itemId },
      data: { quantity: { increment: amount }, lastRestocked: new Date() },
    });
    
    // Log it
    await prisma.auditLog.create({
      data: { userId: req.user.id, action: 'INVENTORY_RESTOCK', details: `Restocked ${amount} units of ${item.itemName}`, level: 'INFO' }
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to order inventory' });
  }
});

// GET /api/admin/ambulances
router.get('/ambulances', async (req, res) => {
  try {
    const fleets = await prisma.ambulance.findMany();
    res.json(fleets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});

// GET /api/admin/contracts
router.get('/contracts', async (req, res) => {
  try {
    const contracts = await prisma.vendorContract.findMany();
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// GET /api/admin/audits
router.get('/audits', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
