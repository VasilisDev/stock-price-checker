/*
*
*
*       @Author:Vasileios Tsakiris
*
*
*/

'use strict';

var expect      = require('chai').expect;
var MongoClient = require('mongodb');
var fetch       = require('node-fetch');
const { Stock } = require("../models/Stock");





module.exports =  (app,db) => {
  app.route('/api/stock-prices')
    .get((req, res) => {
    console.log("DEBUG 1")
      if(!Array.isArray(req.query.stock)){
       fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${req.query.stock}&types=price`)
       .then(response => {
            return response.json();
        })
        .catch(error => console.error(error))
         .then( data=>{
           Promise.all(Object.keys(data).map((stock) => {
                  var { price } = data[stock];
                  var allowLike;
                  console.log(price)
          Stock.findOne({ symbol:stock},(err,doc)=>{
            if(err) throw new Error(err);
              allowLike = !(doc && doc.ips && doc.ips.includes(req.ip));
              console.log("DEBUG 2 OBJECT:")
    Stock.findOneAndUpdate({ symbol: stock}, {$inc: {likes: (req.query.like && allowLike)  ? 1 : 0},$addToSet: {ips: req.query.like && req.ip},$set:{price:price}}, { upsert: true, new: true, setDefaultsOnInsert: true },(err,doc)=>{
       if(err)  throw new Error(err);
       res.json({
              stockData: {
              stock: doc.symbol,
              likes: doc.likes,
              price: doc.price
                }
             });
           })//end findOne
         })//end findOneAndUpdate
      }))//end promise
    })//end data
  .catch((err) => Promise.reject(err));
}//end if
else {

fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${req.query.stock.join(',')}&types=price`)
  .then(response =>{
       return response.json();
      })
    .catch(error => console.error(error))
      .then(data => {
        var allowLike;
        Promise.all(Object.keys(data).map((stock) => {
      var { price } = data[stock];
      console.log("DEBUG 2 OBJECT:"+price)
      console.log(data)
      console.log("DEBUG 3 OBJECT:"+stock)

       var doc =  Stock.findOne({ symbol: stock});
       allowLike = !(doc && doc.ips && doc.ips.includes(req.ip));


  return  Stock.findOneAndUpdate({ symbol: stock }, {$inc: {likes: (req.query.like && allowLike)  ? 1 : 0},$addToSet: {ips: req.query.like && req.ip},$set: {price: price }}, { upsert: true, new: true, setDefaultsOnInsert: true },(err,doc)=>{
    if(err)  throw new Error(err);

              })
           }))
             .then((doc)=>{
              console.log("doc"+doc)
              return res.json({
                     stockData: [
                       {
                         stock: doc[0].symbol,
                         price: doc[0].price,
                         rel_likes: doc[0].likes - doc[1].likes,
                       },
                       {
                         stock: doc[1].symbol,
                         price: doc[1].price,
                         rel_likes: doc[1].likes - doc[0].likes,
                       },
                     ],
                 });
              })
           })//end data
           .catch((err) => Promise.reject(err));
        }//end else
    });
  }
