
const { CartsModel } = require('../models');

const { Carts, ProductsOnCart } = CartsModel

class CartManager {

  constructor() {
  }

  async addCart() {
    const newCart = {
      products: []
    }
    const Cart = await Carts.create(newCart)

    return Cart
  }

  async getCartById(id) {
    try {
      const foundcart = await Carts.findById(id);

      if (foundcart) {

        return (foundcart)
      }
      console.log("Not Found")
    }
    catch (err) {
      console.error("Error al procesar solicitud")
      throw (err)
    }
  }
  async updateCart(cid, pid, quantity) {
    try {
      const cart = await Carts.findById(cid);
      if (cart) {
        const foundProduct = await cart.products.find(product => product.productId === pid)
        console.log(foundProduct)
        if (foundProduct) {
          if (quantity === undefined) {
            const updatedCart = await Carts.findOneAndUpdate(
              { _id: cid, "products.productId": pid },
              { $inc: { "products.$.quantity": 1 } },
              { new: true }
            )
            return { status: "Success!", message: "El carrito ha sido actualizado correctamente", updatedCart };

          }
          const updatedCart = await Carts.findOneAndUpdate(
            { _id: cid, "products.productId": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
          )
          return { status: "Success!", message: "El carrito ha sido actualizado correctamente", updatedCart };
        }

        const newProduct = new ProductsOnCart({
          productId: pid, quantity: 1
        })
        cart.products.push(newProduct)
        cart.save()

        console.log({ status: "Success!", message: "El carrito ha sido actualizado correctamente" });
        return cart;

      }



    } catch (err) {
      console.error("Error updating cart:", err);
      throw err; // Propagar el error para que sea manejado por el código que llama a esta función
    }
  }

  async cartCleaner(cid, pid) {
    try {
      const cart = await Carts.findById(cid);
      if (cart) {

        if (!pid === undefined) {
          const foundProduct = await cart.products.find(product => product.productId === pid)
          if (foundProduct) {
            await Carts.findByIdAndUpdate(cid, { $pull: { products: { productId: pid } } })
            return `Producto ID ${pid} eliminado del carrito ${cid}`

          } else {
            return `el producto ${pid} no existe en el carrito ${cid}`
          }

        }
        await Carts.findByIdAndUpdate(cid, { $set: { products: [] } })
        return `Carrito ID ${cid} vaciado`

      }
      return `el carrito ${cid} no existe`
    }



    catch (err) {
      console.log('error al eliminar el carto. error :' + err)
    }


  }

};


module.exports = CartManager
