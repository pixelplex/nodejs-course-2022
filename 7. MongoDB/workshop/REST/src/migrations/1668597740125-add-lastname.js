const mongoose = require('mongoose');

async function up () {
  const connection = await mongoose.connect('mongodb://localhost:27017/mydb');
  const db = connection.connections[0].db;
  const users = await db.collection('users').find().toArray();
  await Promise.all(users.map(user => {
    const lastname = user.name.split(' ')[1];
    return db.collection('users').updateOne({ _id: user._id }, {  $set: { lastname: lastname || '' } });
  }));
  // for (const user of users) {
  //   const lastname = user.name.split(' ')[1];
  //   await db.collection('users').updateOne({ _id: user._id }, {  $set: { lastname: lastname || '' } });
  // }
}

async function down () {
  const connection = await mongoose.connect('mongodb://localhost:27017/mydb');
  const db = connection.connections[0].db;
  await db.collection('users').updateMany({ }, {  $unset: { lastname: "" } });
}

module.exports = { up, down };
