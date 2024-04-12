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


module.exports = router