/*
*
*
*       @Author:Vasileios Tsakiris
*
*
*/


var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
             assert.equal(res.status, 200);
             assert.property(res.body, 'stockData');
             assert.equal(res.body.stockData.stock, 'GOOG');
             assert.property(res.body.stockData, 'price');
             assert.equal(res.body.stockData.likes, 0);
          done();
        });
      });

      test('1 stock with like', function(done) {

      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {

      });

      test('2 stocks', function(done) {

      });

      test('2 stocks with like', function(done) {

      });

    });

});
