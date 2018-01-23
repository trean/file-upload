'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express    = require('express'),
      bodyParser = require('body-parser'),
      port       = process.env.PORT || '80',
      url        = require('url'),
      fs         = require('fs'),
      path       = require('path'),

      mongoose   = require('mongoose'),
      Client     = require('./client-schema'),

      multer     = require('multer'),
      multerConf = {
        storage   : multer.diskStorage({
          destination: function (req, res, next) {
            next(null, path.join(__dirname, '..', 'uploads'));
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
            next(null, true);
          } else {
            next({message: 'File type not supported'}, false);
          }
        }
      };

let app    = express();
let upload = multer(multerConf).array('files');

// connect to mongo
mongoose.connect('mongodb://localhost:27017/file-uploader');

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
    let client = new Client({clientName: req.body.userName});
    processUploadedData(client, req);
    res.send('this is upload');
  });
});


/**
 * use client id to create dir
 * @param dir
 */
function createClientDir(dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      let pathToUserDir = path.join(__dirname, '..', 'uploads', dir);
      fs.mkdirSync(pathToUserDir);
      resolve(pathToUserDir)
    } else {
      reject('path exists');
    }

  }).catch(err => console.err(err));
}


function moveFileToUserDir(oldPath, newPath) {
  return new Promise((resolve, reject) => {

    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        //throw err;
        reject(err);
      }
      resolve(newPath);
    });
  }).catch(err => console.error(err));
}


function processUploadedData(client, req) {
  let userId = null;
  client.save().then((model) => {
    userId = model._id;
    return createClientDir(userId.toString());
  })
    .then(pathToUserDir => {
      req.files.forEach(file => {
        let processedFileName = /\s/.test(file.originalname) ? file.originalname.split(' ').join('_') : file.originalname,
            // TODO: fix paths
            oldPathToFile     = path.join(__dirname, '..', 'uploads', file.originalname),
            newPathToFile     = path.join(pathToUserDir, processedFileName);
        moveFileToUserDir(oldPathToFile, newPathToFile)
          .then(newFilePath => {
            updateClientFilesAtDB(Client, newFilePath, userId);
          }).catch(error => console.log(error));
      })
    })
    .catch(error => console.log(error));
}


// TODO: update array
function updateClientFilesAtDB(client, pathToFil, clientid) {
  client.findByIdAndUpdate(
    clientid,
    {$set: {'files': {path: pathToFil}}},
    {
      upsert: true
    },
    function (err, model) {
      console.log(err, model);
    }
  );
}