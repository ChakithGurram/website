const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method!== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { slackId, membershipType } = req.body;
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const database = client.db('FtfTestDB');
    const collection = database.collection('FtfTestCollection');
    const result = await collection.insertOne({ slackId, membershipType });
    await client.close();

    res.status(200).json({ message: 'Membership data saved successfully!' });
  } catch (err) {
    console.error('Error saving membership data:', err);
    res.status(500).json({ message: 'Error saving membership data.' });
  }
};