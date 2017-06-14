var Product = require('../models').Product;
var Category = require('../models').Category;
var ProductCategory = require('../models').ProductCategory;

module.exports = function(app, upload, cloudinary) {
    app.get('/api/featured', function(req, res) {
        Product.findAll({
            where: { featured: true },
            limit: 12,
            include: {
                model: ProductCategory,
                include: {
                    model: Category,
                    where: { name: req.query.category }
                }
            }
        }).then(function(products) {
            console.log(products)
            res.json(products);
        })
    });

    app.post('/api/products', upload.single('thumbnail'), function(req, res) {
        Product.create({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            weight: req.body.weight,
            featured: req.body.featured,
        }).then(function(product) {
            if(req.file) {
                cloudinary.uploader.upload(req.file.path, function(result) {
                    fs.unlinkSync(req.file.path);
                    var image = cloudinary.url(result.public_id + result.format, { width: 180, height: 180, crop: 'fill' });
                    product.updateAttributes({ thumbnail: image.slice(0, image.length - 3) });
                });
            }
            if(req.body.category) {
                for(var i = 0; i < req.body.category.length; i++) {
                    ProductCategory.create({ productId: product.id, categoryId: req.body.category[i] });
                }
            }
        });
        res.redirect('/dashboard');
    });

    app.put('/api/products/:id', function(req, res) {
        Product.findById(req.params.id).then(function(product) {
            product.updateAttributes({
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                weight: req.body.weight,
                width: req.body.width,
                height: req.body.height,
                featured: req.body.featured,
            });
        });
    });

    app.post('/api/products/delete/', function(req, res) {
        Product.destroy({ where: { id: req.body.id } }).then(res.redirect('/dashboard'));
        res.redirect('/dashboard')
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
