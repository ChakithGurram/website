const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (req, res) => {
  // Enable CORS for all origins during development (not recommended for production)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Allow the POST method
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Allow the necessary headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { slack_handle, membership } = req.body; // Updated to match form field names
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const database = client.db('FtfTestDB');
    const collection = database.collection('FtfTestCollection');
    const result = await collection.insertOne({ slackId: slack_handle, membershipType: membership }); // Updated field names
    await client.close();

    res.status(200).json({ message: 'Membership data saved successfully!' });
  } catch (err) {
    console.error('Error saving membership data:', err);
    res.status(500).json({ message: 'Error saving membership data.' });
  }
};