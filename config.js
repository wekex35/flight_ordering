module.exports = class Config{
    static productTable = "productTable";
    static mongoConnectionString = "mongodb://localhost:27017/flight_ordering";//"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false";
    static itemPerPage = 10;
}