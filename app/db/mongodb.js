var ObjectID = require('mongodb').ObjectID;
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const Config = require('../../config');

class MongoDB {   
    static async initDb() {
        var uri = Config.mongoConnectionString;
        var dbClient = await MongoClient.connect(uri);
        return dbClient.db('flight_ordering');
    }
    static async insert(collection, data) {
        try {
            var db = await this.initDb();
            var res = await db.collection(collection).insertOne(data);
            return res.insertedCount;
        } catch (error) {
            // console.log(error);
        }
        return false;
    }

    static async bulkInsert(collection, data) {
        try {
            var db = await this.initDb();
            var res = await db.collection(collection).insertMany(data)
            return res.insertedCount;
        } catch (error) {
           throw {"message":error}
        }
    }
    static async update(collection, query, data) {
        try {
            var db = await this.initDb();
            var res = await db.collection(collection).updateOne(
                query,
                data
            );
            return res.modifiedCount == 1;
        } catch (error) {
            // console.log(error);
        }
        return false;
    }

    static async placeOrderStockUpdate(collection, id, quantity) {
        try {
            var db = await this.initDb();
            var res = await db.collection(collection).
            updateOne(
                {_id: new ObjectID(id)},
                { $inc: { stock: quantity} }
            );
            return res.modifiedCount == 1;
        } catch (error) {
            // console.log(error);
        }
        return false;
    }

    static async hardDelete(collection, query) {
        try {
            var db = await this.initDb();
            var res = await db.collection(collection).deleteOne(query);
            return res.deletedCount;
        } catch (error) {
            // console.log(error);
        }
        return false;
    }

    static async retriveAll(collection, query, projection) {
        try {
            var db = await this.initDb();
            var data = await db.collection(collection).find(query).project(projection)
            .toArray()
            return data;
        } catch (error) {
            // console.log(error);
        }
    }


    static async getProduct(collection, id) {
        try {
            var data;
            var db = await this.initDb();
            data = await db.collection(collection).findOne({_id: new ObjectID(id)});
            return data;

        } catch (error) {
            // console.log(error);
        }
    }

    static async getAllProducts(collection, condition,priceRange,sort, page = 1,) {
        var skip = Config.itemPerPage * (page - 1);
        console.log(priceRange);
        console.log("here");
        var mainCondition =  { $and: [ condition, { price: {$gte: priceRange.price.min, $lte:  priceRange.price.max}} ] } 
        try {
            var data = {};
          
            var db = await this.initDb();
            data['product'] = await db.collection(collection)
                .find(mainCondition)
                .sort(sort)
                .limit(Config.itemPerPage)
                .skip(skip)
                .toArray();
          
            data['total'] = await db.collection(collection)
                .find(mainCondition)
                .count();
            var pages = []
            for (let index = 0; index < Math.ceil(data['total'] / 10); index++) {
                pages[index] = {
                    current: page == index + 1,
                    page: index + 1,
                }

            }

            data['pages'] = pages;

            return data;
        } catch (error) {
            // console.log(error);
        }
    }




}

module.exports = MongoDB;
