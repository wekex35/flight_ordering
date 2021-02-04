const MongoDB = require("../db/mongodb")
const Config = require("../../config")

const CartController = {}

CartController.placeOrder = async (res, req) => {
    try {
        if (req.body.productIds == undefined) sendResponse(res, "fail", "Product Unavailable", "Minimum one Item is required")
        var productIds = req.body.productIds;
        var totalPayableAmout = 0;
        if (productIds.lenght == 0) sendResponse(res, "fail", "Product Unavailable", "Minimum one Item is required")
        for (let index = 0; index < productIds.length; index++) {
            const element = productIds[index];

            var result = await MongoDB.getProduct(Config.productTable, element.id)
         
            if (!(element.qty <= result.stock)) {
                throw { message: `${result.name} is out Stock` }
            }
            totalPayableAmout += result.price
        }
        console.log(totalPayableAmout);
        for (let index = 0; index < productIds.length; index++) {
            const element = productIds[index];
            console.log(element)
            var v = await MongoDB.placeOrderStockUpdate(Config.productTable, element.id, - element.qty)
        }


        sendResponse(res, "success", "Payment Order Created", {
            totalPayableAmout,
            productIds
        })
    } catch (error) {
        sendResponse(res, "fail", "Product Unavailable", error.message || error)
    }

    //    MongoDB.singleProduct(Config.productTable,{_id})
}

CartController.paymentResponse = async (res, req) => {
    var body = req.body;
    var status = body.paymentStatus;
    var productIds = body.productIds;
    if(!status){
        for (let index = 0; index < productIds.length; index++) {
            const element = productIds[index];
            console.log(element)
            var v = await MongoDB.placeOrderStockUpdate(Config.productTable, element.id, + element.qty)
        }
        sendResponse(res, "fail", "Order Declined", "Payment Unsuccessfull")
    }else{
        sendResponse(res, "success", "Order Created",)
    }

}

function sendResponse(res, status, message, result) {
    res.json({
        status: status,
        message: message,
        result: result
    })
}

module.exports = CartController 