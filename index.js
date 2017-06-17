const fs = require('fs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(session({ secret: 'asdwqehweqoe2e20-3819urhjfnbsd' }));

// IMAGE UPLOAD

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'temp/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.jpg');
    }
})
const upload = multer({ storage: storage });

cloudinary.config({
    cloud_name: "hwqphox9l",
    api_key: '968254186665626',
    api_secret: 'VMGn9E9HYPLlaqVZf5HcicbKfjg'
});

// MODELS

var Product = require('./models').Product;
var Category = require('./models').Category;
var ProductCategory = require('./models').ProductCategory;

// LAYOUT

app.get('/', function(req ,res) {
    Category.findAll({ where: { featured: true } }).then(function(categories) {
        res.render('homepage/index', { categories: categories });
    });
});

app.get('/products', function(req, res) {
    Product.findAll().then(function(products) {
        res.render('layout/index', { page: 'products', title: 'our collection', products: products });
    });
});

app.get('/products/:id', function(req, res) {
    Product.findById(req.params.id).then(function(product) {
        res.render('layout/single', { page: 'products', title: product.dataValues.name, product: product });
    });
});

app.get('/faq', function(req, res) {
    res.render('layout/faq', { page: 'faq', title: 'support cetner' })
});

app.get('/about', function(req, res) {
    res.render('layout/about', { page: 'about', title: 'about nu magic' });
});

require('./routes/dashboard')(app);
require('./routes/api')(app, upload, cloudinary);

app.listen(process.env.PORT || 4000);
