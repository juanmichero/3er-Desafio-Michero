const ProductManager = require('./ProductManager')
const express = require('express')

const app = express()

app.use(express.urlencoded({extended: true}))

const productsManager = new ProductManager(`${__dirname}/../assets/Products.json`)

app.get('/products', async (req, res) => {
    try {
        const products = await productsManager.getProducts()
        const limit = req.query.limit

        const limitedProducts = limit
            ? products.slice(0, limit)
            : products
        
        res.json(limitedProducts)
        return
    } 
    catch (err) {
        res.json({ error: 'Error retrieving products' })
    }
})

app.get('/products/:productId', async (req, res) => {
    try {
        const product = await productsManager.getProductsById(parseInt(req.params.productId))

        if(!product) {
            res.json({ error: `Product ${req.params.productId} not found`})
            return
        }

        res.json(product)
        return
    }
    catch (err) {
        res.json({ error: 'Error retrieving product' })
    }
})
    
const main = async () => {
    try {
        await productsManager.initializeProducts()

        app.listen(8080, () => {
            console.log('Server ready');
        })
    }
    catch (err) {
        throw err
    }
}

main()