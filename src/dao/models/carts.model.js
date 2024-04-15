const { mongoose } = require("mongoose");

const childSchema = mongoose.Schema({
    productId: { type: String, require: true },
    quantity: { type: Number, require: true }
});

const ProductsOnCart = mongoose.model('ProductsOnCart', childSchema, 'productsOnCart');

const cartsSchema = mongoose.Schema({
    products: [childSchema]
});
const Carts = mongoose.model('Carts', cartsSchema, 'carts');
module.exports = {
    ProductsOnCart,
    Carts
}
