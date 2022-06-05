var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/html-files/index.html');
});


//redirection links. Do not edit this code
//any links that need to be logged in for, they need the if else statement
//like the one below
router.get('/home', function(req, res, next) {
  if ('user' in req.session)
  {
    console.log("user logged in");
    res.sendFile(__dirname + '/html-files/home.html');
  }
  else{
    console.log("user not logged in");
    res.sendStatus(401);
  }
});

router.get('/settings', function(req, res, next) {
  if ('user' in req.session)
  {
    console.log("user logged in");
    res.sendFile(__dirname + '/html-files/settings.html');
  }
  else{
    console.log("user not logged in");
    res.sendStatus(401);
  }
});

router.get('/events', function(req, res, next) {
  if ('user' in req.session)
  {
    console.log("user logged in");
    res.sendFile(__dirname + '/html-files/events.html');
  }
  else{
    console.log("user not logged in");
    res.sendStatus(401);
  }
});

//redirection links end here

router.get('/proposed_dates/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Dates.date FROM Dates INNER JOIN Event ON Event.event_id=Dates.event_id WHERE Event.event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// GET all events
router.get('/get_events', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event;";
    connection.query(query, function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// GET availabilities for an event
router.get("/get_availabilities/:eventid", function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT startTime, Availability.event_id, user_id FROM Availability INNER JOIN Event ON Availability.event_id=Event.event_id WHERE Event.event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// GET details for an event
router.get("/get_event_details/:eventid", function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event WHERE event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// GET event author
router.get("/get_author/:eventid", function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT first_name, last_name FROM User INNER JOIN Event ON User.user_id=Event.creator_id WHERE Event.event_id=14;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

module.exports = router;
