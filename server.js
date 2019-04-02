const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

var db;

app.set("port", process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: true }));

// Connection URL
const url = "mongodb://dbuser:ds151431@ds049624.mlab.com:49624/projects_quotes";

// Database Name
const dbName = 'projects_quotes';
// Connection MongoDB to mLab (MongoLab)
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(
  (err) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    app.listen(app.get("port"), function() {
      console.log("listening on: ", app.get("port"));
    });
  }
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(express.static(`${__dirname}/src`)); 

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/src/index.html");
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/home/danilosic/Documents/Estudos/Programming/nodejs-crud' for this app.
});

app.get("/classes", function(req, res) {
  var cursor = db
    .collection("classes")
    .find()
    .toArray(function(err, results) {
      res.json(results);
    });
});

const funnyStuff = {
  question: `Why did the chicken cross the road?`,
  answer: `To get to the other side`
};

app.get(`/data`, (req, res) => {
  res.json(funnyStuff);
});

// app.use('/almoxarifado', almoxarifadoControll)
// app.get('/almoxarifado', function (req, res) {
//   res.send('almox')
// })

// app.get('/listar', function (req, res) {
//   var cursor = db.collection('quotes').find().toArray(function (err, results) {
//     res.send(results)
//   })
// })

// app.post('/quotes', (req, res) => {
//   db.collection('quotes').save(req.body, (err, result) => {
//     if (err) return console.log(err)

//     console.log('saved to database')
//     res.redirect('/')
//   })
// })
