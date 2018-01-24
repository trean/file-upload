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

      rootDir    = path.join(__dirname, '..'),

      staticDir  = path.join(rootDir, 'static'),

      uploadsDir = path.join(staticDir, 'uploads' ),

      multerConf = {
        storage   : multer.diskStorage({
          destination: function (req, res, next) {
            next(null, uploadsDir);
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

app.use('/static', express.static(path.join(rootDir, 'static')))

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
    processUploadedData(client, req, function(err, model){
      if(err){
        console.log(err);
        res.status(400).send('error');
      }else{
        res.send('ok')
      }
    });
  });
});


/**
 * This API will return list of all clients with ids and name
 */
app.get('/clients', function(req, res) {
  Client.find({}, '_id clientName', function(err, docs){
    res.send(docs);
  })
});


/**
 * This API will return full client object by id or 404 error if not found
 */
app.get('/client/:clientId', function(req, res){
  Client.findOne({_id: req.params.clientId}, function(err, doc){
    if(!err && doc){
      res.send(doc)
    }else{
      res.status(404).send(err);
    }
  })
});

app.post('/client/:clientId/upload', function(req, res){
  const clientId = req.params.clientId;
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      // An error occurred when uploading
      return null;
    }

    Client.findOne({_id: clientId}, function(err, doc){
      processUploadedData(client, req, function(err, model){
        if(err){
          console.log(err);
          res.status(400).send('error');
        }else{
          res.send('ok')
        }
      });
    })
  });

});

/**
 * This API will delete particular file for particular user.
 */
app.delete('/client/:clientId/file/:fileId', function(req, res){
  const clientId = req.params.clientId;
  const fileId = req.params.fileId;
  Client.findOne({ _id: clientId }, function(err, doc){
    if(!err && doc){

      const files = doc.get("files");

      let fileToRemove = null;

      const filesToKeep = [];

      files.forEach(file => { if (file._id == fileId){ fileToRemove = file }else{ filesToKeep.push(file) }});

      if(fileToRemove){
        doc.set('files', filesToKeep);
        doc.save().then((doc) => {
          let filePath = path.join(staticDir, fileToRemove.path);
          fs.unlink(filePath, (err) => res.send('ok'));
        }).catch((err) => res.status(400).send(err))
      }else{
        res.status(404).send("File not found")
      }
    }else{
      res.status(404).send(err);
    }
  })
});


/**
 * use client id to create dir
 * @param dir
 */
function createClientDir(dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      let pathToUserDir = path.join(uploadsDir, dir);
      fs.mkdirSync(pathToUserDir);
      resolve(pathToUserDir)
    } else {
      reject('path exists');
    }

  });
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
  });
}


function processUploadedData(client, req, callback) {
  let userId = null;
  client.save().then((model) => {
    userId = model._id;
    return createClientDir(userId.toString());
  })
    .then(pathToUserDir => {
      req.files.forEach(file => {
        let processedFileName = /\s/.test(file.originalname) ? file.originalname.split(' ').join('_') : file.originalname,
            // TODO: fix paths
            oldPathToFile     = path.join(uploadsDir, file.originalname),
            newPathToFile     = path.join(pathToUserDir, processedFileName);
        moveFileToUserDir(oldPathToFile, newPathToFile)
          .then(newFilePath => {
            updateClientFilesAtDB(model, newFilePath, callback);
          }).catch(callback);
      })
    })
    .catch(callback);
}


// TODO: update array
function updateClientFilesAtDB(client, pathToFile, callback) {
  let files = client.get('files');
  files = files.concat([{path: pathToFile}]);
  client.set('files', files);
  client.save().then((model) => callback(null, model)).catch(callback)
}


app.get('/client/:clientId/test', function(req, res){
  Client.findOne({_id: req.params.clientId}, function(err, doc){
    if(!err && doc){
      updateClientFilesAtDB(doc, "TEST_PATH2", (err, model) => {
        if(err) res.status(400)
        console.log(err, model);
        res.send(model)
      })
    }else{
      res.status(404).send(err);
    }
  })
})