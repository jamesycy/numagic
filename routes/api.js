var Product = require('../models').Product;
var Category = require('../models').Category;
var ProductCategory = require('../models').ProductCategory;
var fs = require('fs');

module.exports = function(app, upload, cloudinary) {
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

    app.post('/api/products/delete/', function(req, res) {
        Product.findById(req.body.id).then(function(product) {
            cloudinary.uploader.destroy(product.public_id);
            product.destroy();
        });
        res.redirect('/dashboard')
    });

    app.post('/api/products', upload.single('thumbnail'), function(req, res) {
        Product.create({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            featured: req.body.featured,
            weight: req.body.weight
        }).then(function(product) {
            if (req.body.category) {
                for (var i = 0; i < req.body.category.length; i++) {
                    ProductCategory.create({ productId: product.id, categoryId: req.body.category[i] });
                }
            }
            if (req.file) {
                cloudinary.uploader.upload(req.file.path, function(result) {
                    fs.unlink(req.file.path);
                    product.updateAttributes({ thumbnail: cloudinary.url(result.public_id + '.' + result.format, { width: 188, height: 188, crop: 'fill' }), public_id: result.public_id
                    });
                });
            }
        });
        res.redirect('/dashboard');
    });



    app.post('/api/category', function(req, res) {
        Category.create({
            name: req.body.name
        });
        res.redirect('/dashboard');
    });

    app.post('/api/category/delete', function(req, res) {
        Category.destroy({ where: { id: req.body.id } }).then(res.redirect('/dashboard'));
    });
}
