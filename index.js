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
    Category.findAll().then(function(categories) {
        if (req.query.search) {
            Product.findAll({ where: { name: { $like: '%' + req.query.search + '%' } } }).then(function(products) {
                res.render('layout/index', { page: 'products', title: 'our collection', products: products, categories: categories });
            });
        } else  {
            Product.findAll().then(function(products) {
                res.render('layout/index', { page: 'products', title: 'our collection', products: products, categories: categories });
            });
        }
    });
});

app.get('/categories', function(req, res) {
    Category.find({
        where: { name: 'close up' },
        include: {
            model: ProductCategory,
            include: Product
        }
    }).then(function(category) {
        res.render('layout/categories', { page: 'products', title: 'our collections', products: category, categories: category });
    });
});

app.get('/products/:id', function(req, res) {
    Category.findAll().then(function(categories) {
        Product.findById(req.params.id).then(function(product) {
            res.render('layout/single', { page: 'products', title: 'our collection', product: product, categories: categories });
        });
    });
});

app.get('/faq', function(req, res) {
    Category.findAll().then(function(categories) {
        res.render('layout/faq', { page: 'faq', title: 'support cetner', categories: categories })
    });
});

app.get('/about', function(req, res) {
    Category.findAll().then(function(categories) {
        res.render('layout/about', { page: 'about', title: 'about nu magic', categories: categories });
    });
});

require('./routes/dashboard')(app);
require('./routes/api')(app, upload, cloudinary);

app.listen(process.env.PORT || 4000);
