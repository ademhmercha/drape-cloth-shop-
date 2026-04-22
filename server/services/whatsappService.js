const axios = require('axios');

/**
 * Sends a WhatsApp message via Whapi.Cloud.
 * The admin links their WhatsApp Business number once via QR code in the dashboard.
 * After that, messages flow FROM that number TO any client phone — zero setup for clients.
 *
 * Phone must be in full international format without '+': e.g. 21650123456
 */
const sendWhatsAppMessage = async (phone, message) => {
  if (!phone || !process.env.WHAPI_TOKEN) return;

  try {
    const chatId = `${phone}@s.whatsapp.net`; // Whapi.Cloud chat ID format

    await axios.post(
      'https://gate.whapi.cloud/messages/text',
      { to: chatId, body: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ WhatsApp sent to ${phone}`);
  } catch (error) {
    // Never block main flow — WhatsApp is non-critical
    console.error(`❌ WhatsApp failed for ${phone}:`, error?.response?.data || error.message);
  }
};

module.exports = { sendWhatsAppMessage };
