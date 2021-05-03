const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Products = mongoose.model('Products');
var multer = require('multer');
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + '/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },

})

router.get('/list', (req, res) => {
    Products.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            res.send({
                data: items
            });
        }
    });
});


router.post('/save', upload.single('image'), (req, res, next) => {
    console.log('re:', req.body, '\n', req.file)
    let filePath = req.file ? req.file.path : req.path;
    req.formData = {
        "files": fs.createReadStream(filePath)
    }
    var obj = {
        item_name: req.body.item_name,
        price: req.body.price,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            base64: Buffer.from(fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))).toString('base64'),           
            contentType: 'image/png'
        }
    }
    Products.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.save();
            res.status(200).redirect('/list');
        }
    });
});

router.post('/update/:id', upload.single('image'), (req, res, next) => {

    const product = new Products({
        _id: req.params.id,
        item_name: req.body.item_name,
        price: req.body.price,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            base64: Buffer.from(fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))).toString('base64'),           
            contentType: 'image/png'
        }
    });

    req.body._id = req.params.id

    Products.findOneAndUpdate({
        _id: req.body._id
    }, product, {
        new: true
    }, (err, doc) => {
        if (!err) {
            console.log('update dpcs:');
            res.status(200).redirect('/list');;

        } else {
            res.status(500).send(err)

            console.log('Error during record update : ' + err);
        }
    });
});

router.get('/:id', (req, res) => {
    Products.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log('got id route', doc)
            res.send({
                data: doc
            })
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Products.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            Products.find((err, docs) => {
                if (!err) {
                    res.send({
                        data: docs
                    });
                    console.log('response:', docs)
                } else {
                    res.status(500).send(err)

                    console.log('Error in retrieving product list :' + err);
                }
            });
            console.log('product deleted');
        } else {
            res.status(500).send(err)

            console.log('Error in product delete :' + err);
        }
    });
});


module.exports = router;