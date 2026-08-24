// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');
const healthRecordRoutes = require('./routes/healthRecords');
const notificationRoutes = require('./routes/notifications');
const waitlistRoutes = require('./routes/waitlist');
const adminRoutes = require('./routes/admin');
const vitalsRoutes = require('./routes/vitals');
const medicinesRoutes = require('./routes/medicines');
const aiRoutes = require('./routes/ai');
const patientFeaturesRoutes = require('./routes/patientFeatures');
const doctorFeaturesRoutes = require('./routes/doctorFeatures');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again in 15 minutes' },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
});

app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'healthcare-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/patient', patientFeaturesRoutes);
app.use('/api/doctor-features', doctorFeaturesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
