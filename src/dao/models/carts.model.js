const { mongoose } = require("mongoose");



const cartsSchema = mongoose.Schema({
    products: [{
        quantity:{type:Number,require:true}
    }],
});

module.exports= mongoose.model('carts', cartsSchema);
