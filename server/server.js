'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express    = require('express'),
      bodyParser = require('body-parser'),
      port       = process.env.PORT || '80',
      url        = require('url'),
      fs         = require('fs'),

      mongoose   = require('mongoose'),
      //Schema     = mongoose.Schema,
      //ObjectId   = Schema.ObjectId,

      //client = require('./client-model'),

      multer     = require('multer'),
      multerConf = {
        storage   : multer.diskStorage({
          destination: function (req, res, next) {
            next(null, __dirname + '/../uploads/');
          },
          filename   : function (req, file, next) {
            //const ext = file.mimetype.split('/')[1];
            next(null, file.originalname);
          }
        }),
        fileFilter: function (req, file, next) {
          if (!file) next();
          const doc = file.mimetype.endsWith('/msword'),
                pdf = file.mimetype.endsWith('/pdf');
          if (doc || pdf) {
            console.log('ok');
            next(null, true);
          } else {
            next({message: 'File type not supported'}, false);
          }
        }
      },
      upload = multer().any('file');


let app = express();

// connect to mongo
mongoose.connect('mongodb://localhost:27017', 'file-uploader');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  }
  else {
    // Pass to next layer of middleware
    next();
  }
});

app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/../app/build');
app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/../app/build'));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(port, function () {
  console.log('Server listening on port ' + port + '!');
});

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      // An error occurred when uploading
      return null;
    }
    console.log('/upload');
    console.log(req.file);
    //if (req.file) {
    //  req.body.file = req.file['filename'];
    //}
    //client.saveNewClientByName();
    console.log(req.body);
    // TODO: call client.saveToDB()
    res.send('this is upload');
  });
});


/**
 * use client id to create dir
 * @param dir
 */
function createClienDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

