// request Upload file 
(function(callback) {
    'use strict';
        
    if (!process.env.LOKALISE_APIKEY) {
        console.log("Please setup the LOKALISE_APIKEY env before using this script");
        return;
    }
    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: 'api.lokalise.com',
        port: '443',
        path: '/api2/projects/983881975d551c5fdba845.54008358/files/upload',
        method: 'POST',
        headers: {"Content-Type":"application/json","x-api-token":process.env.LOKALISE_APIKEY}
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;
 
    const fs = require('fs');
    const contents = fs.readFileSync('src/translations/en.json', {encoding: 'base64'});
    //console.log("file contents", contents);

    const request = httpTransport.request(httpOptions, (res) => {
        let responseBufs = [];
        let responseStr = '';
        
        res.on('data', (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                responseBufs.push(chunk);
            }
            else {
                responseStr = responseStr + chunk;            
            }
        }).on('end', () => {
            responseStr = responseBufs.length > 0 ? 
                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
            
            callback(null, res.statusCode, res.headers, responseStr);
        });
        
    })
    .setTimeout(0)
    .on('error', (error) => {
        callback(error);
    });
    request.write("{\"filename\":\"en.json\",\"data\":\"" + contents + "\",\"lang_iso\":\"en\",\"tags\":[\"js_upload\",\"profile\"]}")
    request.end();
    

})((error, statusCode, headers, body) => {
    console.log('ERROR:', error); 
    console.log('STATUS:', statusCode);
    console.log('HEADERS:', JSON.stringify(headers));
    console.log('BODY:', body);
});

