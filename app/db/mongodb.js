var ObjectID = require('mongodb').ObjectID;
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const Constants = require('../utils/constant');

class MongoDB {   
    static async initDb() {
        // var uri = "mongodb://localhost:27017/flutteruix";
        var uri = "mongodb://flutteruix:123flutteruix@172.105.18.47:27017/test?authSource=test&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false";
        var dbClient = await MongoClient.connect(uri);
        return dbClient.db('flutteruix');
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

    static async selectOne(collection, condition) {
        try {
            var data;
            var db = await this.initDb();
            data = await db.collection(collection).findOne(condition);
            return data;
        } catch (error) {
            // console.log(error);
        }
    }
    static async singlePost(collection, condition) {
        try {
            var data;
            var db = await this.initDb();
            data = await db.collection(collection).findOne(condition);
            // console.log(data);
            if(data == null)
                return undefined;
     
            var pre = await db.collection(collection).find({ _id: { $lt: new ObjectID(data['_id']) } })
                .sort({ _id: -1 })
                .project({ title: 1, url: 1, })
                .limit(1)
                .toArray();
            var next = await db.collection(collection).find({ _id: { $gt: new ObjectID(data['_id']) } })
                .sort({ _id: 1 })
                .project({ title: 1, url: 1, })
                .limit(1)
                .toArray();



            data['related'] = await db.collection(collection).find(
                {
                    $or: [
                        { "subcategory": data['subcategory'] != null ? data['subcategory'] : "" },
                        { "category": data['category'] != null ? data['category'] : "" }],
                    _id: { $ne: new ObjectID(data['_id']) }
                }
            ).limit(Constants.related).project({ title: 1, description: 1, image: 1, url: 1, views: 1 }).toArray()

            if (pre) {
                data['pre'] = pre[0]
                // console.log(pre);
            }
            if (next) {
                data['next'] = next[0]
                // console.log(next);
            }


 
            return data;

        } catch (error) {
            // console.log(error);
        }
    }

    static async getAllProducts(collection, condition, page = 1) {
        condition['$or'] = [{ publish: "true" }, { publish: true }];

        var skip = 10 * (page - 1);
        try {
            var data = {};
            var db = await this.initDb();
            data['product'] = await db.collection(collection)
                .find(condition)
                .sort({ published_at: -1 })
                .limit(Constants.perPage)
                .project({ title: 1, description: 1, image: 1, url: 1, published_at: 1, views: 1, category: 1, subcategory: 1 })
                .skip(skip)
                .toArray();
            data['total'] = await db.collection(collection)
                .find(condition)
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
