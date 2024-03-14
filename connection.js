const mongoose = require('mongoose');

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB CONNECTED SUCESSFULLY'))
    .catch((error) => {
      console.log('DB connection failed');
      console.error(error);
      process.exit(1);
    });
};
