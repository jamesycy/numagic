var Product = require('../models').Product;
var Category = require('../models').Category;
var ProductCategory = require('../models').ProductCategory;

module.exports = function(app) {
   
    app.get('/dashboard', function(req, res) {
        Product.findAll().then(function(products) {
            Category.findAll().then(function(categories) {
                res.render('dashboard/index', { productLength: products.length, categoriesModal: categories, page: 'dashboard' });
            });
        });
    });

    app.get('/dashboard/products', function(req, res) {
        Category.findAll().then(function(categories) {
            Product.findAll()
            .then(function(products) {
                if (req.query.id) {
                    Product.findById(req.query.id).then(function(product) {
                        res.render('dashboard/product', { products: products, product: product, page: "products", categoriesModal: categories })
                    });
                } else {
                    res.render('dashboard/product', { products: products, page: 'products', categoriesModal: categories });
                }
            });
        });
    });

    app.get('/dashboard/category', function(req, res) {
        Category.findAll()
        .then(function(categories) {
            res.render('dashboard/product', { categories: categories, page: 'category', categoriesModal: categories });
        });
    });

}
