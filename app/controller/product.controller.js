const MongoDB = require("../db/mongodb");
const { request } = require("express");
const Config = require("../../config");

const ProductController = {};
ProductController.insertAll = async (res,req)=> {
  
     try {      
        if(req.body.length == 0) sendResponse(res,"fail","Unable Insert Data","Minimum one Item is required")     
        var result =await MongoDB.bulkInsert(Config.productTable,req.body)
        sendResponse(res,"success","Product Inserted",result) 
     } catch (error) {
        sendResponse(res,"fail","Unable Insert Data",error)        
     }
    
}

ProductController.getProductList = async (res,req) => {
    console.log(req.query);
    var query = req.query;
    try {   
        var sort = {};
        var search = {};
        var priceRange = {}
        if(query.sortBy && query.sortOrder) sort[query.sortBy] = query.sortOrder == "asc" ? 1 : -1;
        if(query.searchBY && query.searchText) search[query.searchBY] = query.searchText;
        if(query.priceMin && query.priceMax) priceRange['price'] = {min: Number(query.priceMin), max: Number(query.priceMax)};
      var result = await MongoDB.getAllProducts(Config.productTable,search,priceRange,sort,query.page)
        sendResponse(res,"success","Product List",result) 
     } catch (error) {
        sendResponse(res,"fail","Unable Read Data",error)        
     }
}

function sendResponse(res,status,message,result){
    res.json({
        status: status,
        message : message,
        result: result
    })
}
module.exports = ProductController;