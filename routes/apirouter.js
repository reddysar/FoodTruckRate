var express = require('express')
const router = express.Router();
var Truck = require('../db/models/truck.js')
var User = require('../db/models/user.js')

router.get('/trucks', function(req, res, next) {
  Truck.find({}, function(err, result) {
    User.find({}, function (err, u) {
    if (!err) {
      res.json({
        trucks: result,
        users: u
      })
    } else {
      next(err)
    }
  })
  })
})

router.post('/trucks/add', function(req, res, next) {
  var q = new Truck({ name: req.body.name, rating: 0, totalRatings: 0, comments: [] }) 
  q.save(function(err) {
    if (!err) {
      res.json({ status: 'OK' })
    } else {
      next(err)
    }
  })
})

router.post('/users/truck'), function(req, res, next) {
  var author = req.session.user
  Truck.findById(req.body.tid, function(err, truck) {
    author.trucks.push(truck)
    author.save(function () {
      if (!err ) {
        res.json({ success: 'OK'})
      }  else {
        next(err)
      }
    })
  })
}

router.post('/users/addFollowing'), function(req, res, next) {
  var author = req.session.user
  User.findById(req.body.uid, function(err, user) {
    author.following.push(user)
    author.save(function () {
      if (!err ) {
        res.json({ success: 'OK'})
      }  else {
        next(err)
      }
    })
  })
}

router.post('/users/removeFollowing'), function(req, res, next) {
  var author = req.session.user
  User.findById(req.body.uid, function(err, user) {
    author.following.splice(author.following.indexOf(user), 1)
    author.save(function () {
      if (!err ) {
        res.json({ success: 'OK'})
      }  else {
        next(err)
      }
    })
  })
}

router.get('/users/following', function(req, res, next) {
  var author = req.session.user
  res.json({
    following: author.following
  })
})

router.post('/trucks/rating', function(req, res, next) {
  Truck.findById(req.body.tid, function (err, truck) {
    var newRate = new Number(0)
    var r = new Number(req.body.rating)
    newRate = Number(truck.rating) * Number(truck.totalRatings)
    newRate = Number(newRate) + Number(r)
    newRate = Number(newRate) / (Number(truck.totalRatings) + Number(1))
    truck.totalRatings ++
    truck.rating = newRate
    truck.save(function () {
      if (!err) {
        res.json({ success: 'OK' })
      } else {
        next(err)
      }
    })
  })
})

router.post('/trucks/like', function(req, res, next) {
  Truck.findById(req.body.tid, function (err, truck) {
    User.findOne({ "username" : req.session.user}, function(err, author) {
    author.trucks.push(truck.name)
    author.save(function () {
      if (!err) {
        res.json({ success: 'OK' })
      } else {
        next(err)
      }
    })
  })
  })
})

router.get('/search', function(req, res, next) {
  User.findOne({"username" : req.body.user}, function(err, user) {
    res.render('profile', {currentUser: user})
  })
})

  router.post('/trucks/comment', function(req, res, next) {
    Truck.findById(req.body.tid, function (err, truck) {
      User.findOne({ "username" : req.session.user}, function(err, author) {
      author.comments.push({comment: req.body.comment, truck: truck.name})
      truck.comments.push({comment: req.body.comment, author: author})
      truck.save(function () {
        if (!err) {
          author.save(function() {
            if (!err) {
              res.json({ success: 'OK' })
            } else {
              next(err)
            }
          })
        } else {
          next(err)
        }
      })
    })
    })
  })
module.exports = router;