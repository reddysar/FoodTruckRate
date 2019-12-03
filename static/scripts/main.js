$(document).ready(function() {
  var data = []
  var followData = []
  var activeIdx = -1
  var followIdx = -1
  var FollowUser;
  
  getTrucks()
  //getFollowers()
  setInterval(getTrucks, 2500)
  //setInterval(getFollowers, 2500)

  function getTrucks() {
    $.ajax({
      url: 'apirouter/trucks',
      type: 'GET',
      success: function(res) {
        data = res.trucks
        //console.log(data)
        followData = res.users
        console.log(followData)
        renderPreviewsTruck()
        renderActiveTruck()
      }
    })
  }

  function renderPreviewsTruck() {
    $('#trucks').html(
      data
        .map(i => '<li data-tid="' + i._id + '">' + i.name + '<br> Rating: ' + i.rating + '</li>')
        .join('')
    )
  }

  // $('#profile').on('click', function() {
  //   $.ajax({
  //     url: '/profile',
  //     type: 'GET',
  //     success: function(res) {
  //       console.log(res)
  //     }
  //   })
  // })

  $('#search-profile').on('click', function() {
     followUser = $('#user-search').val()
    $.ajax({
      url: '/profile',
      type: 'POST',
      data: {username: followUser},
      dataType: 'html', 
      success: function(res) {
        console.log(res)
        $("html").html(res)
      }
    })
  })

  $('#follow-user').on('click', function() {
    var user = followUser
    console.log(user)
    $.ajax({
      url: '/follow',
      type: 'POST',
      data: {username: user},
      success: function(res) {
        console.log(res)
      }
    })
  })



  function renderActiveTruck() {
    if (activeIdx > -1) {
      var active = data[activeIdx]
      $('#show-truck').css('display', 'block')
      $('#truck').text(active.name ? active.name : '')
      var obj = $('#rating-text').text('Rating : ' + active.rating  + '\nNumber of Ratings : ' + 
      active.totalRatings )
      obj.html(obj.html().replace(/\n/g,'<br/>'));
      var com = $('#comment-text').text('Comments:\n' + active.comments.map(c => c.comment + ' by ' + c.author.username + 
      '\n'))
      com.html(com.html().replace(/\n/g,'<br/>'));
    } else {
      $('#show-truck').css('display', 'none')
    }
  }



  $('#trucks').on('click', 'li', function() {
    var _id = $(this).data('tid')
   for (var i = 0; i < data.length; i++) {
    var counter = data[i]
    var id = counter._id
    if(id === _id) {
      activeIdx = i
    }
   }
    renderActiveTruck()
  })


  $('#show-truck').on('click', '#submitRating', function() {
    console.log($('#rating').val())
    var rating = parseFloat($('#rating').val())
    console.log(rating + 'hi')
    console.log(data[activeIdx])
    if (rating <= 5 && rating >= 0) {
      $.ajax({
        url: 'apirouter/trucks/rating',
        data: { tid: data[activeIdx]._id, rating: rating},
        type: 'POST',
        success: function(res) {
          console.log(res)
        }
      })
    } else {
      alert('not in bounds')
    }
  })

  $('#show-truck').on('click', '#like-truck', function() {
    $.ajax({
      url: 'apirouter/trucks/like',
      data: { tid: data[activeIdx]._id},
      type: 'POST',
      success: function(res) {
        console.log(res)
      }
    }) 
  })

  $('#show-truck').on('click', '#submitComment', function() {
    var comment = $('#comment').val()
    console.log(comment + 'hi')
    $.ajax({
      url: 'apirouter/trucks/comment',
      data: { tid: data[activeIdx]._id, comment: comment},
      type: 'POST',
      success: function(res) {
        console.log(res)
      }
    })
  })

  $('#new-truck').on('click', function() {
    $('.modal').css('display', 'block')
  })

  $('#close').on('click', function() {
    $('.modal').css('display', 'none')
  })

  $('#submit-truck').on('click', function() {
    var name = $('#truck-text').val()
    $.ajax({
      url: 'apirouter/trucks/add',
      data: { name: name},
      type: 'POST',
      success: function(res) {
        console.log(res)
        $('.modal').css('display', 'none')
      }
    })
  })

})