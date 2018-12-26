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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));
app.use('/song', trackRoute);



var Song = mongoose.model('Song', {
    titel: {
      type: String
    },
    interpret: {
      type: String
    },
    dateioriginial: {
      type: String
    },
    datei96: {
      type: String
    },
    datei48: {
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



        this.filename = filename;


        var convertAudio96 = new Promise((resolve, reject) => {

          var inFile = 'uploads/' + this.filename;

          var outFile = inFile + '-96.mp3';

          var converter = spawn('ffmpeg', ['-i', inFile + '.mp3', '-b:a', '96k', '-bufsize', '64k', outFile]);

          converter.stderr.on('data', function (data) {
              console.log(data.toString());
          });

          converter.stderr.on('end', function () {
              resolve(outFile);
          });

          converter.stderr.on('exit', function () {
              reject('child process exited');
          });



        });


        var convertAudio48 = new Promise((resolve, reject) => {

          var inFile = 'uploads/' + this.filename;

          var outFile = inFile + '-48.mp3';

          var converter = spawn('ffmpeg', ['-i', inFile + '.mp3', '-b:a', '48k', '-bufsize', '64k', outFile]);

          converter.stderr.on('data', function (data) {
              console.log(data.toString());
          });

          converter.stderr.on('end', function () {
              resolve(outFile);
          });

          converter.stderr.on('exit', function () {
              reject('child process exited');
          });



        });

        Promise.all([convertAudio96, convertAudio48])
        .then(values => {
          console.log('jaaaaaaaaaaaaaaaaaaaaaaaa maaaaaaaaaaaaaaaaaaaaaaaaaaannn');
          console.log(values);
          var song = new Song({
            titel: req.body.titel,
            interpret: req.body.interpret,
            dateioriginial: savename,
            datei96: values[0],
            datei48: values[1]
          });
          console.log(song);
          song.save(function(err, result){
            if(err){

            }
            res.json(result);
            console.log("saved");
          })
        });



      })
    })


  }


});



trackRoute.get('/:songtitel', function(req, res) {
		Song.find({ titel: req.params.songtitel }, function(err, song) {
			if (err)
				res.send(err);
			res.json(song);
		});
	});


  trackRoute.get('/', function(req,res,next){

    Song.find(function(err, songs){
      res.json(songs);
    })

  });


// trackRoute.get('/', function(req,res,next){
//   //Example how to run a Command for the Commandline
//   //Could use this for checking the bitrate of the uploaded audiofile
//   exec('git version', (err, stdout, stderr) => {
//     if (err) {
//       return;
//     }
//     res.json(stdout);
//   });
//
// });


app.listen(3000, () => {
  console.log("App listening on port 3005!");
});
