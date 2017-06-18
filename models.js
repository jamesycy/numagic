var Sequelize = require('sequelize');
var connection = new Sequelize('numagic', 'root', 'admin', { dialect: 'sqlite', storage: './database.sqlite' });

var Product = connection.define('product', {
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    stock: Sequelize.INTEGER,
    featured: { type: Sequelize.BOOLEAN, defaultValue: false },
    thumbnail: Sequelize.STRING,
    description: Sequelize.STRING,
    public_id: Sequelize.STRING
});

var Category = connection.define('category', {
    name: { type: Sequelize.STRING, unique: true },
    featured: { type: Sequelize.BOOLEAN, defaultValue: false}
});

var ProductCategory = connection.define('product_category', {});

ProductCategory.belongsTo(Product);
ProductCategory.belongsTo(Category);
Product.hasMany(ProductCategory);
Category.hasMany(ProductCategory);

if (process.env.TABLE) {
    Category.create({
        name: 'close up',
        featured: true
    });
    Category.create({
        name: 'playing cards',
        featured: true
    });
    Category.create({
        name: 'kids magic',
        featured: true
    });
    Category.create({
        name: 'stage magic',
        featured: true
    });
}


connection.sync().catch(function(err) {
    throw err;
});

exports.Product = Product;
exports.Category = Category;
exports.ProductCategory = ProductCategory;
