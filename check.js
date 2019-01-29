var AmazonProducts = require('crawl-amazon-products');

var SID    = 'TWILIO_SID',
    TOKEN  = 'TWILIO_TOKEN',
    TO     = 'TO_NUMBER',
    FROM   = 'FROM_NUMBER';

var sendAlert = function(product) {
  var client = require('twilio')(SID, TOKEN),
      body   = product.name + ' is now available for pre-order.';

  client.messages
    .create({
      to: TO,
      body: body,
      from: FROM
    })
    .then(function() {
      console.log('Text Alert Sent');
    }).done();
};

var checkAvailibility = function(error, product) {
  var isProductAvailible = product.availability.toLowerCase().indexOf('pre-order now') > -1;

  if (isProductAvailible) {
    sendAlert(product);
  } else {
    console.log('Product Not Availible, checking again in 1m');
    setTimeout(function() { 
      checkProduct();
    }, 60000);
  }
};

var checkProduct = function() {
  AmazonProducts.getProductDetail({
    url: 'https://www.amazon.co.uk/dp/B07GZCL9KP'
  }, checkAvailibility);
};

checkProduct();