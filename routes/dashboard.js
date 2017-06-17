var Product = require('../models').Product;
var Category = require('../models').Category;
var ProductCategory = require('../models').ProductCategory;

module.exports = function(app) {
    app.get('/dashboard', function(req, res) {
        Product.findAll({
            include: {
                model: ProductCategory,
                include: Category
            }
        }).then(function(products) {
            Category.findAll().then(function(categories) {
                res.render('dashboard/products/index', {page: 'dashboard', products: products, categories: categories});
            });
        });
    });

    app.get('/dashboard/products', function(req, res) {
        Product.findAll({
            include: {
                model: ProductCategory,
                include: Category
            }
        }).then(function(products) {
            res.render('dashboard/products/products', {page: 'products', products: products});
        });
    });

    app.get('/dashboard/products/add', function(req, res) {
        Category.findAll().then(function(categories) {
            res.render('dashboard/products/add', {page: 'products', title: 'add product', categories: categories});
        })
    });

    app.get('/dashboard/product/:id', function(req, res) {
        Product.findById(req.params.id, { include: { model: ProductCategory, include: Category } }).then(function(product) {
            res.render('dashboard/products/productSingle', {page: 'products', product: product});
        });
    });



    app.get('/dashboard/category', function(req, res) {
        Category.findAll().then(function(categories) {
            res.render('dashboard/category/index', {page: 'category', categories: categories});
        });
    });

    app.get('/dashboard/category/add', function(req, res) {
        res.render('dashboard/category/add', {page: 'category'});
    });
}
