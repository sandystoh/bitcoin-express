const request = require('request');
const qs = require('querystring');

module.exports = function(app, API_URL) {
    const BTC_PRICE_API_URL = `${API_URL}/price`;
    const BTC_URI = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/all'
    + '?' + qs.stringify({crypto: 'BTC', fiat: 'SGD'});

// DO A GET TO EXTERNAL API
app.get(BTC_PRICE_API_URL, (req,res,next)=>{
    
    const options = {
        method: 'GET',
        url: BTC_URI,
        headers: {'X-testing': 'testing'}
    };
    request(options, (error, response, body)=>{
        if (!error && response.statusCode == 200) {
            // console.log(body);
            res.status(200).json(body);
        };
    });
});
}