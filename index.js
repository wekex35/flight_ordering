
const express = require('express')
const ProductController = require('./app/controller/product.controller')
const bodyParser = require('body-parser')
const CartController = require('./app/controller/cart.controller')
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/bulkInsert', (req, res) => {
  ProductController.insertAll(res,req)
})

app.get('/getProductList', (req, res) => {
  ProductController.getProductList(res,req)
})

app.post('/placeOrder', (req, res) => {
  CartController.placeOrder(res,req)
})

app.post('/paymentResponse', (req, res) => {
  CartController.paymentResponse(res,req)
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
