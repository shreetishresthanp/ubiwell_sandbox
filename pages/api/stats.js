// // pages/api/stats.js
// import clientPromise from '@/lib/mongodb';

// export default async function handler(req, res) {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ error: 'Missing date parameter' });

//   const client = await clientPromise;
//   const db = client.db("Anomaly_Detection"); // or db('your-db-name') if not in URI

//   const start = new Date(date);
//   const end = new Date(new Date(start).setDate(start.getDate() + 1));

//   console.log(start);
//   try {
//     const data = await db.collection('aggregation')
//       .find({ date: { $gte: start, $lt: end } })
//       .toArray();

//     res.status(200).json(data);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// }

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Missing date parameter' });

  console.log(date)

  try {
    const client = await clientPromise;
    const db = client.db("Anomaly_Detection");

    const results = await db
      .collection('aggregation')
      .find({ date: date }) // Match string directly
      .toArray();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
