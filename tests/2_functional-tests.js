const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  var likesTest

  //Viewing one stock: GET request to /api/stock-prices/
  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          likesTest = parseInt(res.body.stockData.likes)

          done();
        });
    });

//Viewing one stock and liking it: GET request to /api/stock-prices/

test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isAbove(parseInt(res.body.stockData.likes), parseInt(likesTest), "Returns value greater than previous value");

          likesTest = parseInt(res.body.stockData.likes)

          done();
        });
    });

//Viewing the same stock and liking it again: GET request to /api/stock-prices/
test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isAbove(parseInt(res.body.stockData.likes), parseInt(likesTest), "Returns value greater than previous value");

          done();
        });
    });

var relLikesTestArray = []

//Viewing two stocks: GET request to /api/stock-prices/
test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&stock=msft")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, "Returns array");

          for(let i in res.body.stockData){
            relLikesTestArray.push(parseInt(res.body.stockData[i]))

          }

          done();
        });
    });

//Viewing two stocks and liking them: GET request to /api/stock-prices/
test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&stock=msft&like=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, "Returns array");

          for(let i in res.body.stockData){
            for(let j in relLikesTestArray){
              if(res.body.stockData[i].stock == relLikesTestArray[j].stock ){

                assert.isAbove(parseInt(res.body.stockData[i].rel_likes), parseInt(relLikesTestArray[j].likes),"Returns value greater than previous value")

              }
            }
            
          }

          done();
        });
    });

});
