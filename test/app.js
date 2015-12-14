var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
//hash = require('./utils').hash,
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    cookie = require('cookie')
    ;

app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://" + req.get('Host'));
    res.header('Access-Control-Allow-Headers', 'Content-Type, *');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next(); // http://expressjs.com/guide.html#passing-route control
});

app.use(morgan('combined'));


app.get('/',
    function (req, res, next) {
        res.redirect('/test/index.html');
    }
);

app.use('/test/target.json', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin'));
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //res.header('Access-Control-Expose-Headers', 'Own-Header');
    next();
});

app.use('/test/target.js', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin'));
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //res.header('Access-Control-Expose-Headers', 'Own-Header');
    next();
});

app.post('/test/target.js', function (req, res, next) {
    //var HALF_HOUR = 1000 * 60 * 30,
    //    sessionTime = (new Date((new Date()).getTime() + HALF_HOUR))
    //    ;
    //console.log(req.cookies);
    //if (!req.cookies['dakt_session']) {
    //    console.log('cookies are undefined')
    //    res.cookie(cookie.serialize('dakt_session', hash(), {
    //        expires: sessionTime
    //    }));
    //} else {
    //    res.cookie(cookie.serialize('dakt_session', req.cookies['dakt_session'], {
    //        expires: sessionTime
    //    }));
    //}

    res.send('//<![CDATA[ function runTDA(){} //]]>');
    next();
});

app.post('/test/target.json', function (req, res, next) {
    res.send(JSON.stringify({t: {key: 'value1', key2: 'value2'}}));
    next();
});

app.get('/dakt.js', function (req, res, next) {
    var referer = req.headers['referer'],
        refererRegex = /http[s]?:\/\/(www\.)?([.\-\w\d]*)/,
        refererName = refererRegex.exec(referer)[2],
        etag,
        staticScript
        ;
    //no special catches, just for tests
    staticScript = fs.readFileSync(__dirname + '/../dist/' + refererName + '/dakt.js');

    //if (!req.headers['if-none-match']) {
    //    etag = hash();
    //} else {
    //    etag = req.headers['if-none-match']
    //}
    //res.header('ETag', etag);
    //res.header('Content-Type', 'application/javascript');
    //
    //res.write(staticScript.toString().replace('/*ETAG_HASH*/', '"' + etag + '"'));
    res.write(staticScript.toString());
    res.end();
    next();
});

app.get('/dakt-ie.js', function (req, res, next) {
    var referer = req.headers['referer'],
        refererRegex = /http[s]?:\/\/(www\.)?([.\-\w\d]*)/,
        refererName = refererRegex.exec(referer)[2],
        etag,
        staticScript
        ;
    //no special catches, just for tests
    staticScript = fs.readFileSync(__dirname + '/../dist/' + refererName + '/dakt-ie.js');

    res.write(staticScript.toString());
    res.end();
    next();
});

app.use('/dist', express.static(__dirname + '/../dist'));
app.use('/test', express.static(__dirname));
app.listen(process.env.PORT || 3000);