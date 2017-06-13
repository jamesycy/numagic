const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser());

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

var Product = require('./models').Product;
var Category = require('./models').Category;
var ProductCategory = require('./models').ProductCategory;

// LAYOUT

app.get('/', function(req ,res) {
    res.render('homepage/index');
});

app.get('/products', function(req, res) {
    Product.findAll().then(function(products) {
        res.render('layout/index', { page: 'products', title: 'our collection', products: products });
    });
});

app.get('/faq', function(req, res) {
    res.render('layout/faq', { page: 'faq', title: 'support cetner' })
});

app.get('/about', function(req, res) {
    res.render('layout/about', { page: 'about', title: 'about nu magic' });
});

// Dashboard

app.get('/uploader', function(req, res) {
    res.render('test/index.jade');
});

app.get('/dashboard', function(req, res) {
    Product.findAll({
        include: {
            model: ProductCategory,
            include: Category
        }
    }).then(function(products) {
        Category.findAll().then(function(categories) {
            res.render('dashboard/index', {products: products, categories: categories});
        });
    });
});

// API Routes

app.post('/api/uploader', upload.single('thumbnail'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        fs.unlinkSync(req.file.path);
    });
    res.redirect('/uploader');
});

app.get('/api/featured', function(req, res) {
    Category.find({
        where: { name: req.query.category },
        include: {
            model: ProductCategory,
            include: {
                model: Product,
                where: { featured: true }
            }
        }
    }).then(function(category) {
        res.json(category);
    });
});

app.post('/api/products', upload.single('thumbnail'), function(req, res) {
    Product.create({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        weight: req.body.weight,
        width: req.body.width,
        height: req.body.height,
        featured: req.body.featured,
    }).then(function(product) {
        cloudinary.uploader.upload(req.file.path, function(result) {
            fs.unlinkSync(req.file.path);
            var image = cloudinary.url(result.public_id + result.format, { width: 180, height: 180, crop: 'fill' });
            console.log(image.slice(0, image.length - 3));
            product.updateAttributes({ thumbnail: image.slice(0, image.length - 3) });
        });
        if(req.body.category) {
            ProductCategory.create({ productId: product.id, categoryId: req.body.category });
        }
    });
    res.redirect('/dashboard');
});

app.post('/api/categories', function(req, res) {
    Category.create({
        name: req.body.name
    });
    res.redirect('/dashboard');
});


app.listen(process.env.PORT || 4000);
