const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Phase 2 Data (Patients & Doctors)...');

  // Find a patient and doctor to attach data to
  const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });
  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' }, include: { doctor: true } });

  if (!patient || !doctor) {
    console.error('❌ Could not find a PATIENT and DOCTOR in the database.');
    return;
  }

  console.log(`Attaching data to Patient: ${patient.email} and Doctor: ${doctor.email}`);

  // DNA Profile
  await prisma.dNAProfile.deleteMany();
  await prisma.dNAProfile.create({
    data: {
      patientId: patient.id,
      rawDataUrl: 'https://healthcare-genomics.s3.amazonaws.com/seq-827394.vcf',
      riskMarkers: { "BRCA1": "Normal", "APOE": "Elevated Risk", "LCT": "Lactose Intolerant" }
    }
  });

  // Vaccinations
  await prisma.vaccination.deleteMany();
  await prisma.vaccination.createMany({
    data: [
      { patientId: patient.id, disease: 'COVID-19', vaccineName: 'Pfizer-BioNTech (Booster)', dateAdministered: new Date('2024-01-15') },
      { patientId: patient.id, disease: 'Influenza', vaccineName: 'Fluarix Quadrivalent', dateAdministered: new Date('2023-10-05') }
    ]
  });

  // Journal Entries
  await prisma.journalEntry.deleteMany();
  await prisma.journalEntry.createMany({
    data: [
      { patientId: patient.id, content: 'Feeling a bit fatigued today, but no fever.', sentiment: 'NEUTRAL' },
      { patientId: patient.id, content: 'Slept really well, feeling super energetic and happy!', sentiment: 'POSITIVE' },
      { patientId: patient.id, content: 'The knee pain is back. It hurts when I walk up stairs.', sentiment: 'NEGATIVE' }
    ]
  });

  // Sleep Logs
  await prisma.sleepLog.deleteMany();
  await prisma.sleepLog.createMany({
    data: [
      { patientId: patient.id, date: '2026-08-20', durationHrs: 7.5, quality: 4 },
      { patientId: patient.id, date: '2026-08-21', durationHrs: 6.0, quality: 2 },
      { patientId: patient.id, date: '2026-08-22', durationHrs: 8.2, quality: 5 }
    ]
  });

  // Orders (Digital Pharmacy)
  await prisma.order.deleteMany();
  await prisma.order.createMany({
    data: [
      { patientId: patient.id, items: [{ name: 'Amoxicillin 500mg', qty: 1 }], totalAmount: 12.99, status: 'DELIVERED' },
      { patientId: patient.id, items: [{ name: 'Vitamin D3 1000 IU', qty: 2 }], totalAmount: 24.50, status: 'SHIPPED' }
    ]
  });

  // MDT Chat Messages
  await prisma.message.deleteMany();
  await prisma.message.createMany({
    data: [
      { senderId: doctor.id, content: 'Has anyone seen the latest labs for patient #892? The ferritin levels are unusually high.', channel: 'MDT_GENERAL' },
      { senderId: doctor.id, content: 'I suggest we order an MRI of the liver just to rule out hemochromatosis.', channel: 'MDT_GENERAL' }
    ]
  });

  // CME Credits
  if (doctor.doctor) {
    await prisma.cMECredit.deleteMany();
    await prisma.cMECredit.createMany({
      data: [
        { doctorId: doctor.doctor.id, courseName: 'Advanced Cardiac Life Support (ACLS)', credits: 12.5, dateEarned: new Date('2025-11-20') },
        { doctorId: doctor.doctor.id, courseName: 'Ethics in AI Diagnostics', credits: 4.0, dateEarned: new Date('2026-03-10') }
      ]
    });
  }

  console.log('✅ Phase 2 Seeding Complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
