const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/ProductsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  console.log('connected')
});

require('./product.model');