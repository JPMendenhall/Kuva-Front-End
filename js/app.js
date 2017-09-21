$(document).ready(function() {
  $('.materialboxed').materialbox();
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 2, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
  // Adding email fields dynamically
  var counter = 1;
  var limit = 15;

  function addInput(divName) {
    if (counter == limit) {
      alert("You have reached the limit of adding " + counter + " inputs");
    } else {
      var newdiv = document.createElement('div');
      newdiv.innerHTML = "Enter email " + (counter + 1) + " <br><input type='text' name='myInputs[]'>";
      document.getElementById(divName).appendChild(newdiv);
      counter++;
    }
  }
  $(function() {
    var API = 'https://kuvafundb.herokuapp.com/api/sidenav/events/1'
    $.get(API)
      .then(function(data) {
        for (var i = 0; i < data.length; i++) {
          var album = data[i].name
          var tripid = data[i].trip_id
          $("#albumnames").append(`
            <li class="viewalbum" id="${tripid}"> ${album}</li>
      `)
        }
      });
  })
  //gets trip name/date
  var startdate;
  var enddate;
  $("#albumnames").on('click', '.viewalbum', function() {
    $('#picDiv').empty()
    event.preventDefault()
    var tripid = this.id
    var API = "https://kuvafundb.herokuapp.com/api/event/eventdata/" + tripid;
    $.get(API)
      .then(function(data) {
        var response = data[0]
        var eventName = response.name;
        startdate = response.start_date;
        enddate = response.end_date;
        var eventstartdate = moment(JSON.parse(response.start_date)).format('l');
        var eventenddate = moment(JSON.parse(response.end_date)).format('l');
        $("#eventname").text(`
              ${eventName}
            `)
        $("#daterange").text(`
              ${eventstartdate} - ${eventenddate}
              `)
      })
    getUserPhotos(tripid)
  })
  //loop through the user keys retrieved from database
  function appendPhotos(userid) {
    var API = 'https://api.instagram.com/v1/users/self/media/recent/?access_token='
    $.getJSON(API + userid + '&callback=?', function(insta) {
      console.log(insta.data)
      $.each(insta.data, function(photos, src) {
        var postTime = insta.data[photos].created_time + "000";
        console.log(startdate)
        console.log(enddate)
        if (postTime >= startdate && postTime <= enddate) {
          // if (photos === 20) {
          //   return false;
          // }
          var imgUrl = src.images.standard_resolution.url
          $("#picDiv").append(`
                           <div class="col s12 m6 l4 ">
                             <div class="card">
                               <div class="card-image">
                                 <img class="materialboxed" src=${imgUrl}>
                               </div>
                             </div>
                           </div>
                         `)
        }
      });
    });
  }

  //Add photos to album
  function getUserPhotos(tripid) {
    var API = 'https://kuvafundb.herokuapp.com/api/event/profilepics/' + tripid;
    $.get(API)
      .then(function(data) {
        console.log(data)
        for (var i = 0; i < data.length; i++) {
          appendPhotos(data[i].instagram_key)
        }
      })
  }

  //POST request from create album page

  $(".submitNewEvent").on('click', function() {
    var newEventData = {}
    var tripName = "name"
    var tripStartDate = "start_date"
    var tripEndDate = "end_date"
    // moment($('#newEventStartDate').val()).unix() + "000"
    newEventData[tripName] = $('#newEventName').val();
    newEventData[tripStartDate] = Date.parse($('#newEventStartDate').val());
    newEventData[tripEndDate] = Date.parse($('#newEventEndDate').val());
    console.log(newEventData)

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://kuvafundb.herokuapp.com/api/trips",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      "processData": false,
      "data": JSON.stringify(newEventData)
    }

    $.ajax(settings).done(function(response) {
      console.log(response);
    });
  })
});
