const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Admin Phase 1 Data...');

  // Beds
  await prisma.bed.deleteMany();
  await prisma.bed.createMany({
    data: [
      { ward: 'ICU', roomNumber: '101A', status: 'OCCUPIED' },
      { ward: 'ICU', roomNumber: '101B', status: 'OCCUPIED' },
      { ward: 'ICU', roomNumber: '102A', status: 'AVAILABLE' },
      { ward: 'GENERAL', roomNumber: '201A', status: 'OCCUPIED' },
      { ward: 'GENERAL', roomNumber: '201B', status: 'AVAILABLE' },
      { ward: 'MATERNITY', roomNumber: '301A', status: 'AVAILABLE' },
    ]
  });
  console.log('✅ Beds seeded');

  // Inventory
  await prisma.inventory.deleteMany();
  await prisma.inventory.createMany({
    data: [
      { itemName: 'Surgical Masks (N95)', category: 'PPE', quantity: 1500, reorderLevel: 2000, lastRestocked: new Date() },
      { itemName: 'Oxygen Canisters', category: 'EQUIPMENT', quantity: 120, reorderLevel: 50, lastRestocked: new Date() },
      { itemName: 'Latex Gloves (Box)', category: 'PPE', quantity: 450, reorderLevel: 500, lastRestocked: new Date() },
      { itemName: 'Amoxicillin 500mg', category: 'MEDICINE', quantity: 8000, reorderLevel: 2000, lastRestocked: new Date() },
    ]
  });
  console.log('✅ Inventory seeded');

  // Ambulances
  await prisma.ambulance.deleteMany();
  await prisma.ambulance.createMany({
    data: [
      { vehicleId: 'AMB-01', status: 'DISPATCHED', latitude: 34.0522, longitude: -118.2437, lastPing: new Date() },
      { vehicleId: 'AMB-02', status: 'IDLE', latitude: 34.0522, longitude: -118.2437, lastPing: new Date() },
      { vehicleId: 'AMB-03', status: 'MAINTENANCE', latitude: null, longitude: null, lastPing: new Date() },
    ]
  });
  console.log('✅ Ambulances seeded');

  // Vendor Contracts
  await prisma.vendorContract.deleteMany();
  await prisma.vendorContract.createMany({
    data: [
      { vendorName: 'MedEquip Global', serviceType: 'Hardware', status: 'ACTIVE', expiryDate: new Date(Date.now() + 86400000 * 365) },
      { vendorName: 'PharmaCorp Inc', serviceType: 'Medicine', status: 'EXPIRING', expiryDate: new Date(Date.now() + 86400000 * 15) },
      { vendorName: 'BioTech Labs', serviceType: 'Diagnostics', status: 'ACTIVE', expiryDate: new Date(Date.now() + 86400000 * 180) },
    ]
  });
  console.log('✅ Vendor Contracts seeded');

  // Audit Logs
  await prisma.auditLog.deleteMany();
  await prisma.auditLog.createMany({
    data: [
      { action: 'SYSTEM_STARTUP', details: 'Core microservices initialized', level: 'INFO' },
      { action: 'API_RATE_LIMIT', details: 'Rate limit exceeded on /api/auth', level: 'WARN' },
      { action: 'DB_BACKUP', details: 'Automated snapshot created successfully', level: 'INFO' },
      { action: 'INVENTORY_ALERT', details: 'Surgical masks below reorder threshold', level: 'WARN' },
    ]
  });
  console.log('✅ Audit Logs seeded');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
