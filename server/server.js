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
      frontDir = path.join(rootDir, 'app', 'build'),

      staticDir  = path.join(rootDir, 'static'),

      uploadsDir = path.join(staticDir, 'uploads' ),

      multerConf = {
        storage   : multer.diskStorage({
          destination: function (req, res, next) {
            next(null, uploadsDir);
          },
          filename   : function (req, file, next) {
            next(null, file.originalname);
          }
        }),
        fileFilter: function (req, file, next) {
          if (!file) next();
          const doc  = file.mimetype.endsWith('/msword'),
                docx = file.mimetype.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.document'),
                pdf  = file.mimetype.endsWith('/pdf');
          if (doc || docx || pdf) {
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

app.use('/', express.static(frontDir));
app.use('/static', express.static(path.join(rootDir, 'static')));

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

app.listen(port, function () {
  console.log('Server listening on port ' + port + '!');
});

app.get('/', function (req, res) {
  res.sendFile(frontDir + '/index.html', {root: __dirname});
});

app.get('/list', function (req, res) {
  res.sendFile(frontDir + '/index.html');
});

app.get('/details', function (req, res) {
  res.sendFile(frontDir + '/index.html');
});

app.get('/details/:userId', function (req, res) {
  res.sendFile(frontDir + '/index.html');
});

app.post('/upload', function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return null;
    }
    let client = new Client({clientName: req.body.userName});
    processUploadedData(client, req).then((model) => res.status(200).send('ok'), (err) => res.status(400).send(err))
      .catch(console.error);
  });
});


/**
 * This API will return list of all clients with ids and name
 */
app.get('/clients', function(req, res) {
  Client.find({}, function(err, docs){
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
      // An error occurred when uploading
      return null;
    }

    Client.findOne({_id: clientId}, function(err, client){
      processUploadedData(client, req).then((model) => res.status(200).send('ok'), res.status(400).send)
        .catch(err => console.error("HERE", err));
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
          fs.unlink(filePath, (err) => res.status(200).send('ok'));
        }).catch((err) => res.status(400).send(err));
      }else{
        res.status(404).send("File not found");
      }
    }else{
      res.status(404).send(err);
    }
  })
});

/**
 * This API will delete all files from request.
 */
app.post('/client/:clientId/delete_many', function (req, res) {
  const clientId         = req.params.clientId;
  const filesToDeleteIds = req.body.files;

  Client.findOne({_id: clientId}, function (err, doc) {
    if (!err && doc) {
      const files = doc.get("files");

      const filesToRemove = [];
      const filesToKeep   = [];

      files.forEach(file => {
        if (filesToDeleteIds.includes(file._id.toString())) {
          filesToRemove.push(file)
        } else {
          filesToKeep.push(file)
        }
      });


      if (filesToRemove.length > 0) {
        doc.set('files', filesToKeep);
        doc.save().then((doc) => {
          filesToRemove.forEach(fileToRemove => {
            let filePath = path.join(rootDir, fileToRemove.path);
            fs.unlink(filePath, (err) => console.log(err));
          });
          res.status(200).send('ok');
        }).catch((err) => res.status(400).send(err));
      } else {
        res.status(404).send("File not found");
      }
    } else {
      res.status(404).send(err);
    }
  })
})


/**
 * use client id to create dir
 * @param dir
 */
function createClientDir(dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      let pathToUserDir = path.join(uploadsDir, dir);
      try {
        fs.mkdirSync(pathToUserDir);
      }catch (error){}

      resolve(pathToUserDir);
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


function processUploadedData(client, req) {
  return new Promise((resolve, reject) => {

    let userId = null;
    client.save().then((model) => {
      userId = model._id;
      return createClientDir(userId.toString());
    }, (err) => console.error("Cant save client", err))
      .then(pathToUserDir => {
        let filePromises = req.files.map(file => {
          let processedFileName   = /\s/.test(file.originalname) ? file.originalname.split(' ').join('_') : file.originalname,
              oldPathToFile       = path.join(uploadsDir, file.originalname),
              newPathToFile       = path.join(pathToUserDir, processedFileName),
              pathFromProjectRoot = path.join('static', 'uploads', userId.toString(), processedFileName);
          return moveFileToUserDir(oldPathToFile, newPathToFile)
            .then(newFilePath => pathFromProjectRoot);
        });
        Promise.all(filePromises).then(filePaths => updateClientFilesAtDB(client, filePaths), reject).then(resolve, reject)
      });
  });
}


function updateClientFilesAtDB(client, pathToFiles) {
  return new Promise((resolve, reject) => {
    let files = client.get('files');
    files     = files.concat(pathToFiles.map(pathToFile=> {return {path: pathToFile}}));
    client.set('files', files);
    client.save().then(resolve, err => {console.log("cant write files"); reject(err)} )
  });
}
