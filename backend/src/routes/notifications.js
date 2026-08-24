// src/routes/notifications.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/notifications — get all for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification) return res.status(404).json({ error: 'Not found' });
    if (notification.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications' });
  }
});

module.exports = router;
