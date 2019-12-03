const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
var cookieSession = require('cookie-session')
const accountRouter = require('./routes/account.js')
const apiRouter = require('./routes/apirouter.js')
var Truck = require('./db/models/truck.js')
var User = require('./db/models/user.js')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FinalProject')
// Register body parser middleware
app.engine('html', require('ejs').__express)
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Set 'public' to be a static directory
//app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', function(req, res, next) {
  Truck.find({}, function(err, results) {
    if (!err) {
      res.render('index', { trucks: results, user: req.session.user, })
    } else {
      next(err)
    }
  })
})

app.post('/', function(req, res, next) {
  var name = req.body.name
  var truckObj = new Truck({name: name, rating: 0, totalRatings: 0, comments: []})
  truckObj.save(function(err) {
    if (!err) {
      res.redirect('/')
    } else {
      next(err)
    }
  })
})

app.get('/profile', function(req, res, next) {
  User.findOne({"username" : req.session.user}, function(err, user) {
    if (!err) {
      console.log(user)
      res.render('profile', {currentUser: user})
    } else {
      next(new Error('user does not exist'))
    }
  })
})

app.post('/follow', function(req, res, next) {
    User.findOne({username: req.session.user}, function(err, author){
    author.following.push(req.body.username)
    if (!err) {
      res.json({ success: 'OK'})
    } else {
      next(err)
    }
  })
})

app.post('/profile', function(req, res, next) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (!err) {
      res.render('profile', {currentUser: user})
    } else {
      next(new Error('user does not exist'))
    }
  })
})

app.use('/account', accountRouter)
app.use('/apirouter', apiRouter)
app.use(function(err,_, res,_) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})