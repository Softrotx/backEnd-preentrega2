
const { Carts } = require('../models');

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
  async updateCart(cid, pid) {
    try {
        const cart = await Carts.findById(cid);

        const productOnCartIndex = cart.products.findIndex(product => product.id === pid);
        console.log(`productOnCart ${productOnCartIndex}`);

        if (productOnCartIndex >= 0) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            const updatedCart = await Carts.findOneAndUpdate(
                { _id: cid, "products._id": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );
            console.log({ status: "Success!", message: "El carrito ha sido actualizado correctamente" });
            return updatedCart;
        } else {
            // Si el producto no está en el carrito, agrégalo
            cart.products.push({ _id: pid, quantity: 1 });
            const updatedCart = await Carts.findByIdAndUpdate(cid, cart);
            console.log({ status: "Success!", message: "El carrito ha sido actualizado correctamente" });
            return updatedCart;
        }
    } catch (err) {
        console.error("Error updating cart:", err);
        throw err; // Propagar el error para que sea manejado por el código que llama a esta función
    }
}
  // async deletecart(id) {
  //   try {
  //     const foundcartIdx = this.#carts.findIndex(cart => cart.id === id)
  //     if (!foundcartIdx < 0) {
  //       this.#carts.splice(foundcartIdx, 1)
  //       return
  //     }
  //     console.log({ error: "carto no encontrado" })
  //     return


  //   }


  //   catch {
  //     console.log('error al eliminar el carto')
  //   }


  // }

};


module.exports = CartManager
