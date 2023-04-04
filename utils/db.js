const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

module.exports = mongoose;
