'use strict';
const myDB = process.env['DB']
const fetch = require("node-fetch")

const mongoose = require('mongoose')

mongoose.connect(myDB, {
  useNewURLParser: true, 
  useUnifiedTopology: true
});

if(!mongoose.connection.readyState){
  console.log("database error")
}

module.exports = function (app) {

  const stockSchema = new mongoose.Schema({
    stock: {
      unique: true,
      type: String,
      required: true
      },
    price: {
      type: Number,
      required: true
      },
    likes: {
      type: Number,
      required: true
      }
    
  })

  let StockData = mongoose.model("stockData", stockSchema);

   async function getLatestData(stockName){
    let url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+stockName+"/quote"

    let response = await fetch(url);
    let latestData = await response.json()

        if (response.status >= 200 && response.status <= 299) {
          return latestData
        } else {
          return false
        }
  };

  app.route('/api/stock-prices')
    .get( async function (req, res){
      //set stock
    //  const output = await getLatestPrice(req.query)

   // await console.log(output )

   if(req.query.stock){
   // console.log(req.query, "update")

    if(Array.isArray(req.query.stock)){

      var myStockArray = []

    for(let i in req.query.stock){
       // myStockArray.push(await getLatestData(req.query.stock[i]))
       var stockName =  req.query.stock[i].toUpperCase()

        let latestData = await getLatestData(stockName)
   // console.log(response, "RESPONSE")

        // do something with JSON, using the 'body' variable
        //console.log(body)

     //   console.log(latestData.symbol, latestData.latestPrice, "HERRE")

        StockData.findOne({stock: stockName},async (err,stockData)=>{


          if(err || stockData == null || stockData == ""){
            
          //  console.log("DATA NOT AVAILABLE")


            var myLikes = 0
            var myFilter = {}

            if(req.query.like == "true"){
                myLikes++
              } else if(req.query.like == "false"){
                myLikes--
              }

                myFilter.price = latestData.latestPrice
              myFilter.likes = myLikes
              myFilter.stock = latestData.symbol

            const myStockData = new StockData(myFilter)
                    //    console.log(myStockData,"new stock")

            await myStockData.save((err,stockData)=>{
                if(err){
                  console.log( err)
                }
                if(stockData){
               /*   console.log( {
                  "stock": stockData.stock,
                  "price": stockData.price,
                  "rel_likes": stockData.likes
                }) */

                }

              })

          } else

          if(stockData){

              stockData.price = latestData.latestPrice
           //   console.log(stockData, "likesValue")


              if(req.query.like == "true"){
                stockData.likes++
          //      console.log(stockData.likes, "increment")
              } else if(req.query.like == "false"){
                stockData.likes--
            //    console.log(stockData.likes, "decrement")


              }

          //    console.log(inputFilter.likes, stockData, "updateStock")

              await stockData.save(async (err,stockData)=>{
                if(err){
                  console.log( err)
                
                }

                if(stockData){
                /*  console.log( {
                  "stock": stockData.stock,
                  "price": stockData.price,
                  "rel_likes": stockData.likes
                }) */
                }

              })

            }

        })

        }

        StockData.find({stock : req.query.stock.map(item => item.toUpperCase())},(err,data)=>{
      if(err){
        console.log(err)
      } else{
          var myArray;
          myArray = data.map(item => {
            return { 
              "stock" : item.stock,
              "price" : item.price,
              "rel_likes" : item.likes
               }
          })
         // console.log({"stockData": myArray },"STOCKDATA")
          return res.json({"stockData": myArray })
        
      }
    })

    } else {
      

    let latestData = await getLatestData(req.query.stock.toUpperCase())
   // console.log(response, "RESPONSE")

        // do something with JSON, using the 'body' variable
        //console.log(body)

      //  console.log(latestData.symbol, latestData.latestPrice, "HERRE")

        //update db with latest price and filter
  StockData.findOne({stock: req.query.stock.toUpperCase()},async (err,stockData)=>{


          if(err || stockData == null || stockData == ""){
            
          //  console.log("DATA NOT AVAILABLE")


            var myLikes = 0
            var myFilter = {}

            if(req.query.like == "true"){
                myLikes++
              } else if(req.query.like == "false"){
                myLikes--
              }

                myFilter.price = latestData.latestPrice
              myFilter.likes = myLikes
              myFilter.stock = latestData.symbol

            const myStockData = new StockData(myFilter)
                    //    console.log(myStockData,"new stock")

            await myStockData.save((err,stockData)=>{
                if(err){
                  console.log( err)
                }
                if(stockData){
                /*  console.log( {
                  "stock": stockData.stock,
                  "price": stockData.price,
                  "likes": stockData.likes
                }) */

                return res.send({"stockData": 
            {"stock": stockData.stock,
              "price": stockData.price,
              "likes": stockData.likes
            }
          })

                }

              })

          } else

          if(stockData){

              stockData.price = latestData.latestPrice
           //   console.log(stockData, "likesValue")


              if(req.query.like == "true"){
                stockData.likes++
          //      console.log(stockData.likes, "increment")
              } else if(req.query.like == "false"){
                stockData.likes--
            //    console.log(stockData.likes, "decrement")


              }

          //    console.log(inputFilter.likes, stockData, "updateStock")

              await stockData.save(async (err,stockData)=>{
                if(err){
                  console.log( err)
                
                }

                if(stockData){
                /*  console.log( {
                  "stock": stockData.stock,
                  "price": stockData.price,
                  "likes": stockData.likes
                }) */

                return res.send({"stockData": 
            {"stock": stockData.stock,
              "price": stockData.price,
              "likes": stockData.likes
            }
          })

                }

              })

            }

        })
    }   

     } else {
      return res.send( "Please enter stock")
    }
      
    });
    
};
