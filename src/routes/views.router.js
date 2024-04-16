const { Router } = require('express')
const router = Router();


router.get('/', async (req, res) => {

    const ProductManager = req.app.get("ProductManager")
    const products = await ProductManager.getProducts(req.query)
    
    res.render('index', {
        title: 'Products',
        useWS: true,
        useSweetAlert: true,
        scripts: [
            'index.js'
        ],
        products,
        styles: [
            'index.css'
        ]
    })
})

router.get('/products', async (req, res) => {

    const ProductManager = req.app.get("ProductManager")
    const products = await ProductManager.getProducts(req.query)
    console.log(products)
    
    res.render('products', {
        title: 'Todos los Productos',
        useWS: false,
        useSweetAlert: true,
        scripts: [
            
            'products.js'

        ],
        products,
        styles: [
            'index.css'
        ]
    })
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        if (cartId.length !== 24) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        const CartManager = req.app.get('CartManager')
        const productToCart = await CartManager.getCartById(cartId)

        const products = productToCart.products.map(d => d.toObject({ virtuals: true }))
        console.log(productToCart)

        res.render('carts', {
            title: 'Carrito',
            useWS: false,
            useSweetAlert: true,
            scripts: [
            ],
            products,
            styles: [
                'index.css'
            ]
        })
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        throw (err)

    }

})

module.exports = router