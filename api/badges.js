const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// CORS ayarları
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Mevcut sistem: accountinformation API’si
router.get('/api', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId gerekli' });
  }

  const url = `https://accountinformation.roblox.com/v1/users/${userId}/roblox-badges`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API isteği başarısız: ' + error.message });
  }
});

// Yeni endpoint: Profil sayfasından badge’leri tarama
router.get('/profile', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId gerekli' });
  }

  const url = `https://www.roblox.com/users/${userId}/profile`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const badges = [];

    // Profil sayfasında badge’lerin bulunduğu HTML elementini hedefle
    // Not: HTML yapısı değişebilir, Roblox’un güncel profil sayfasını kontrol edin
    $('.profile-badges .badge-item').each((i, element) => {
      const badgeName = $(element).find('.badge-name').text().trim();
      if (badgeName) {
        badges.push({ name: badgeName });
      }
    });

    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Profil tarama başarısız: ' + error.message });
  }
});

module.exports = router;
