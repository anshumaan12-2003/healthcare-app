// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedAdminPass = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      email: 'admin@healthcare.com',
      password: hashedAdminPass,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  const specialties = [
    { name: 'Dr. Ananya Sharma',   specialty: 'Cardiology',     fee: 800, exp: 12 },
    { name: 'Dr. Rohit Mehta',     specialty: 'Neurology',      fee: 900, exp: 15 },
    { name: 'Dr. Priya Nair',      specialty: 'Dermatology',    fee: 600, exp: 8  },
    { name: 'Dr. Vikram Singh',    specialty: 'Orthopedics',    fee: 750, exp: 10 },
    { name: 'Dr. Sunita Verma',    specialty: 'Pediatrics',     fee: 550, exp: 6  },
    { name: 'Dr. Arjun Patel',     specialty: 'General Medicine', fee: 400, exp: 5 },
  ];

  const slots = {
    Monday:    ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    Tuesday:   ['09:00', '10:00', '11:00', '14:00', '15:00'],
    Wednesday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    Thursday:  ['09:00', '10:00', '11:00', '14:00'],
    Friday:    ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  };

  for (const doc of specialties) {
    const hashedPass = await bcrypt.hash('Doctor@1234', 10);
    const email = doc.name.toLowerCase().replace('dr. ', '').replace(' ', '.') + '@healthcare.com';

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPass,
        name: doc.name,
        role: 'DOCTOR',
      },
    });

    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialty: doc.specialty,
        bio: `Experienced ${doc.specialty} specialist with ${doc.exp} years of practice.`,
        consultationFee: doc.fee,
        experience: doc.exp,
        availableSlots: slots,
      },
    });
    console.log(`✅ Doctor created: ${doc.name} (${doc.specialty})`);
  }

  // Create a Patient
  const hashedPatientPass = await bcrypt.hash('Patient@1234', 10);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@healthcare.com' },
    update: {},
    create: {
      email: 'patient@healthcare.com',
      password: hashedPatientPass,
      name: 'Jane Doe',
      role: 'PATIENT',
    },
  });
  console.log('✅ Patient created:', patient.email);

  // Fetch all doctors to create appointments
  const allDoctors = await prisma.doctor.findMany();
  
  // Create Appointments
  if (allDoctors.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    await prisma.appointment.createMany({
      data: [
        { patientId: patient.id, doctorId: allDoctors[0].id, date: today, timeSlot: '10:00', status: 'CONFIRMED', symptoms: 'Chest pain' },
        { patientId: patient.id, doctorId: allDoctors[1].id, date: today, timeSlot: '14:00', status: 'PENDING', symptoms: 'Headache' },
        { patientId: patient.id, doctorId: allDoctors[2].id, date: yesterday, timeSlot: '11:00', status: 'COMPLETED', symptoms: 'Skin rash', notes: 'Apply ointment twice daily' },
      ],
      skipDuplicates: true,
    });
    console.log('✅ Appointments seeded');
  }

  // Create Vitals
  await prisma.vital.createMany({
    data: [
      { patientId: patient.id, type: 'HEART_RATE', value: '72', unit: 'bpm' },
      { patientId: patient.id, type: 'HEART_RATE', value: '75', unit: 'bpm' },
      { patientId: patient.id, type: 'BLOOD_PRESSURE', value: '120/80', unit: 'mmHg' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Vitals seeded');

  // Create Medicines
  await prisma.medicine.createMany({
    data: [
      { patientId: patient.id, name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day', startDate: new Date().toISOString().split('T')[0] },
      { patientId: patient.id, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: new Date().toISOString().split('T')[0] },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Medicines seeded');

  console.log('🎉 Seeding complete! Login credentials:');
  console.log('Admin: admin@healthcare.com / Admin@1234');
  console.log('Patient: patient@healthcare.com / Patient@1234');
  console.log('Doctor: ananya.sharma@healthcare.com / Doctor@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
