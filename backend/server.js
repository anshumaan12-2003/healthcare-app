// server.js
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🏥 Healthcare API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
