const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser());

var Product = require('./models').Product;
var Category = require('./models').Category;
var ProductCategory = require('./models').ProductCategory;

// LAYOUT

app.get('/', function(req ,res) {
    res.render('homepage/index');
});

app.get('/products', function(req, res) {
    Product.findAll().then(function(products) {
        res.render('layout/index', { products: products });
    });
});

app.get('/faq', function(req, res) {
    res.send('FAQ')
});

app.get('/about', function(req, res) {
    res.send('about');
});

// Dashboard

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

app.get('/api/featured', function(req, res) {
    Category.find({
        where: { name: req.query.category},
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

app.post('/api/products', function(req, res) {
    console.log(req.body.featured);
    Product.create({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        weight: req.body.weight,
        width: req.body.width,
        height: req.body.height,
        featured: req.body.featured
    }).then(function(product) {
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
