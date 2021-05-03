require('./models/db');

const express = require('express');
const bodyparser = require('body-parser');

const productController = require('./controllers/productcontroller');

var app = express();

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/product', productController);
