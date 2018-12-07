/**
 * NPM Module dependencies.
 */
const express = require('express');
const trackRoute = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
var mongoose   = require('mongoose');
mongoose.connect('mongodb://root:myPasswordIsSafe1234@mongo:27017/db');
var spawn = require('child_process').spawn;

const { exec } = require('child_process');

const app = express();
app.use('/song', trackRoute);



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
      var filename = Date.now().toString();
      var savename = filename + '.mp3';
      fs.rename(file.path, 'uploads/' + savename, function (err){
        if(err)throw err;

        var song = new Song({
          titel: req.body.titel,
          interpret: req.body.interpret,
          song: savename
        });

        convertAudio(filename).then(function(data){
          res.json(data);
        }, function(err){

        });

        song.save(function(err, result){
          if(err){

          }

          console.log("saved");
        })
      })
    })


  }


})


function convertAudio(file){

  return new Promise((resolve, reject) => {

    file = 'uploads/' + file;

    var converter = spawn('ffmpeg', ['-i', file + '.mp3', '-b:a', '96k', '-bufsize', '64k', file + '-96.mp3']);

    converter.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    converter.stderr.on('end', function () {
        resolve('file has been converted succesfully');
    });

    converter.stderr.on('exit', function () {
        reject('child process exited');
    });



  })
}



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


app.listen(3000, () => {
  console.log("App listening on port 3005!");
});
