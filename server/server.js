//alle module und so holen
const express = require('express');
const trackRoute = express.Router();
const fs = require('fs');
const multer = require('multer');
//einstellen wo die songs gespeichert werden sollen beim ersten upload
const upload = multer({dest: 'uploads/'});
var mongoose   = require('mongoose');
//mit der DB verbinden
mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: false });
var spawn = require('child_process').spawn;

const { exec } = require('child_process');

const app = express();
app.use(function(req, res, next) {
  //CORS header einrichten
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));
//alle routen auf song
app.use('/song', trackRoute);


//db model für einen song
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
//was wenn jemand ein post auf localhost:3000/song macht
trackRoute.post('/', upload.any(), function(req,res,next){
  if(req.files){
    req.files.forEach(function(file){
      var filename = Date.now().toString();
      var savename = filename + '.mp3';
      //renamen mit mp3 am schluss und aktuellem datum als ID
      fs.rename(file.path, 'public/uploads/' + savename, function (err){
        if(err)throw err;



        this.filename = filename;

        //in 96 bit konvertieren
        var convertAudio96 = new Promise((resolve, reject) => {

          var inFile = 'public/uploads/' + this.filename;

          var outFile = 'uploads/' + this.filename + '-96.mp3';

          //aufruf auf ffmpeg
          var converter = spawn('ffmpeg', ['-i', inFile + '.mp3', '-b:a', '96k', '-bufsize', '64k', 'public/' + outFile]);

          converter.stderr.on('data', function (data) {
              console.log(data.toString());
          });

          converter.stderr.on('end', function () {
              //konvertuerung erfolgreich
              resolve(outFile);
          });

          converter.stderr.on('exit', function () {
              reject('child process exited');
          });



        });

        //in 48 bit konvertieren
        var convertAudio48 = new Promise((resolve, reject) => {

          var inFile = 'public/uploads/' + this.filename;

          var outFile = 'uploads/' + this.filename + '-48.mp3';

          //aufruf auf ffmpeg
          var converter = spawn('ffmpeg', ['-i', inFile + '.mp3', '-b:a', '48k', '-bufsize', '64k', "public/" + outFile]);

          converter.stderr.on('data', function (data) {
              console.log(data.toString());
          });

          converter.stderr.on('end', function () {
              //konvertierung erfolgreich
              resolve(outFile);
          });

          converter.stderr.on('exit', function () {
              reject('child process exited');
          });



        });
        //wenn die beiden promises resolved sind von den konvertierungen kommt er hier hin
        Promise.all([convertAudio96, convertAudio48])
        .then(values => {
          console.log(values);
          var song = new Song({
            titel: req.body.titel,
            interpret: req.body.interpret,
            dateioriginial: savename,
            datei96: values[0],
            datei48: values[1]
          });
          console.log(song);
          //song auf DB speichern mit speicherort
          song.save(function(err, result){
            if(err){

            }
            //das ans frontend zurückgeben
            res.json(result);
            console.log("saved");
          })
        });



      })
    })


  }


});


//wenn jemand nach einem song sucht
trackRoute.get('/:songtitel', function(req, res) {
    //auf db suchen und zurückgeben
		Song.find({ titel: req.params.songtitel }, function(err, song) {
			if (err)
				res.send(err);
      //zurücksenden ans frontend
			res.json(song);
		});
	});

//wenn jemand auf localhost:3000/song einen get macht dann alle songs zurückgeben
  trackRoute.get('/', function(req,res,next){

    Song.find(function(err, songs){
      res.json(songs);
    })

  });



//init startup
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
