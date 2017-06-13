var Sequelize = require('sequelize');
var connection = new Sequelize('numagic', 'root', 'admin', { dialect: 'sqlite', storage: './database.sqlite' });

var Product = connection.define('product', {
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    stock: Sequelize.INTEGER,
    weight: Sequelize.FLOAT,
    width: Sequelize.FLOAT,
    height: Sequelize.FLOAT,
    featured: { type: Sequelize.BOOLEAN, defaultValue: false },
    thumbnail: Sequelize.STRING
});

var Category = connection.define('category', {
    name: { type: Sequelize.STRING, unique: true }
});

var ProductCategory = connection.define('product_category', {});

ProductCategory.belongsTo(Product);
ProductCategory.belongsTo(Category);
Product.hasMany(ProductCategory);
Category.hasMany(ProductCategory);


connection.sync().catch(function(err) {
    throw err;
});

exports.Product = Product;
exports.Category = Category;
exports.ProductCategory = ProductCategory;
