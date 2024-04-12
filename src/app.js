
const ProductManager = require('./dao/DBModules/productManager')
const CartManager = require('./dao/DBModules/cartManager')
const productsRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatRouter = require('./routes/chat.router')
const cartsRouter = require('./routes/carts.router')
const express = require('express');
const { mongoose } = require('mongoose');
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const { Chat } = require('./dao/models');

const app = express();
// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use(express.static(`${__dirname}/../public`))
app.use('/', viewsRouter)
app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter )
app.use('/api/chat', chatRouter )


const main = async () => {

    await mongoose.connect(
        'mongodb+srv://ccfuentes91:E410bd48b9*1234qwer@backendtesting.kmllbfb.mongodb.net/?retryWrites=true&w=majority&appName=backEndTesting',
        { dbName: 'backEndTesting' }
    )
    

    const productos = new ProductManager(`${__dirname}/assets/Productos.json`)
    const carrito = new CartManager(`${__dirname}/assets/Carts.json`)
    // await productos.iniciar()
    // await carrito.iniciar()
    app.set('ProductManager', productos)
    app.set('CartManager', carrito)
    const httpServer = app.listen(8080, () => {
        console.log('servidor listo')
    })
    // crear un servidor para WS
    const io = new Server(httpServer)
    const menssageLogs = []

    io.on('connection', clientSocket => {
        const user = clientSocket.id.replace(/[A-Z, 0-9,-,_]/g, '')
        console.log(`Nuevo cliente conectado => ${user}`)

    
        clientSocket.on('message', (data) => {
            const msg = data
            const message = {user, msg}
            menssageLogs.push(message)
            io.emit('message', message)

            Chat.create()


        })
        for (const message of menssageLogs) {
            clientSocket.emit('message', message)
    
        }
    
    })


}

main()

