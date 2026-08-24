const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Simulated AI Triage Endpoint
router.post('/triage', authenticate, async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Simulate network delay for AI processing (1.5 - 2.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const lowerMsg = message.toLowerCase();
  let aiResponse = "";
  let suggestedSpecialty = null;

  // Rule-based simulation for the demo
  if (lowerMsg.includes('headache') || lowerMsg.includes('migraine')) {
    aiResponse = "I understand you're experiencing head pain. Given the symptoms, I recommend consulting a Neurologist. Would you like me to show you available Neurologists in your area?";
    suggestedSpecialty = 'Neurology';
  } else if (lowerMsg.includes('heart') || lowerMsg.includes('chest') || lowerMsg.includes('palpitations')) {
    aiResponse = "Chest pain or heart palpitations should be taken seriously. Based on your symptoms, a Cardiologist would be the most appropriate specialist to see. Please seek immediate emergency care if the pain is severe.";
    suggestedSpecialty = 'Cardiology';
  } else if (lowerMsg.includes('skin') || lowerMsg.includes('rash') || lowerMsg.includes('itch')) {
    aiResponse = "Skin conditions like rashes can have many causes. A Dermatologist is best equipped to diagnose this. I can help you book an appointment with one.";
    suggestedSpecialty = 'Dermatology';
  } else if (lowerMsg.includes('stomach') || lowerMsg.includes('nausea') || lowerMsg.includes('pain')) {
    aiResponse = "Stomach pain and nausea can be quite uncomfortable. I suggest speaking with a General Medicine practitioner to get an initial diagnosis.";
    suggestedSpecialty = 'General Medicine';
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    aiResponse = "Hello! I am your AI Medical Assistant. Please describe your symptoms or what you're feeling today, and I'll help guide you to the right care.";
  } else {
    aiResponse = "Thank you for sharing. Based on those symptoms, a General Medicine consultation would be a great starting point to get a professional opinion.";
    suggestedSpecialty = 'General Medicine';
  }

  res.json({
    reply: aiResponse,
    suggestedSpecialty,
    timestamp: new Date()
  });
});

module.exports = router;
