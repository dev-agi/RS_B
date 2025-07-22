const axios = require('axios');

module.exports = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is nil' });
  }

  const url = `https://accountinformation.roblox.com/v1/users/${userId}/roblox-badges`;

  try {
    const response = await axios.get(url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get api: ' + error.message });
  }
};
