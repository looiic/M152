/**
 * NPM Module dependencies.
 */
const express = require('express');
const trackRoute = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db');

const { exec } = require('child_process');

const app = express();
app.use('/song', trackRoute);


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         var songName = Date.now() + '.mp3';
//         cb(null, songName)
//     }
// });
//
// var upload = multer({ storage: storage }).single('song');
//
// trackRoute.post('/', function (req, res) {
//     upload(req, res, function (err) {
//         if (err) {
//             // An error occurred when uploading
//             console.log(err);
//         }
//         res.json({
//             success: true,
//             message: 'Song uploaded!'
//         });
//
//         // Everything went fine
//     })
// });

var Song = mongoose.model('Song', {
    titel: {
      type: String
    },
    interpret: {
      type: String
    },
    song: {
      type: String
    }
})

trackRoute.post('/', upload.any(), function(req,res,next){

  if(req.files){
    req.files.forEach(function(file){
      var filename = Date.now() + '.mp3';
      fs.rename(file.path, 'uploads/' + filename, function (err){
        if(err)throw err;

        var song = new Song({
          titel: req.body.titel,
          interpret: req.body.interpret,
          song: filename
        });

        song.save(function(err, result){
          if(err){

          }
          res.json(result);
        })
      })
    })


  }


})

trackRoute.get('/', function(req,res,next){
  //Example how to run a Command for the Commandline
  //Could use this for checking the bitrate of the uploaded audiofile
  exec('git version', (err, stdout, stderr) => {
    if (err) {
      return;
    }
    res.json(stdout);
  });

})


app.listen(3005, () => {
  console.log("App listening on port 3005!");
});
