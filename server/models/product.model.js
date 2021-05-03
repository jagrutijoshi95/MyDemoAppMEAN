const mongoose = require('mongoose');

var productsSchema = new mongoose.Schema({
    item_name: String,
    price:Number,
    
    img:
    {
        data: Buffer,
        base64: String,
        contentType: String
    }
});

mongoose.model('Products', productsSchema);