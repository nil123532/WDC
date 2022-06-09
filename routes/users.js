var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET a user's availability for an event
router.get('/:userid/events/:eventid/my_availability', function(req, res, next){
  // console.log(req.session.user);
  // if (!req.session.user) res.send(200);
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT startTime FROM Availability INNER JOIN User ON Availability.user_id=User.user_id INNER JOIN Event ON Event.event_Id=Availability.event_id WHERE Event.event_id=? AND User.user_id=?;";
    connection.query(query, [req.params.eventid, req.params.userid], function(err2, rows, fields){
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


// GET events a user is attending
router.get('/:userid/get_events', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event INNER JOIN Availability ON Event.creator_id=Availability.user_id WHERE Event.creator_id=?;";
    connection.query(query, [req.params.userid], function(err2, rows, fields){
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

// Create an event
router.post('/create_event', function(req, res, next){
  console.log("Creating event");
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Event (creator_id, address_street_name, address_street_number, address_state, address_city, address_postcode, address_country, duration, description, name, responses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);";
    let rb = req.body;
    // let finalised_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(query, [req.session.user, rb.streetName, rb.streetNumber, rb.state, rb.city, rb.postcode, rb.country, rb.duration, rb.description, rb.name], function(err2, rows, fields){
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

//info to display in the settings page
router.get('/getSettingsInfo', function(req, res, next) {
  //console.log("runs 1");
  console.log(req.session.user);
  if ('user' in req.session)
  {
    req.pool.getConnection(function(err, connection){
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
    //get first name last name and email using session user id
    var query = "SELECT first_name, last_name, email FROM User WHERE user_id = ?";
    connection.query(query, [req.session.user], function(err2, rows, fields){
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
  }

  else{
    res.sendStatus(401);
  }
});

//to change values of what emails users want
router.post('/emailNotificationsSettings', function(req, res, next) {
  //console.log("runs 1");
  //console.log(req.session.user);

  if ('user' in req.session)
  {
    var val = req.body;
    var emailChecks = [];
    emailChecks[0] = 0;
    emailChecks[1] = 0;
    emailChecks[2] = 0;
    emailChecks[3] = 0;

    //conditions to check which checkboxes were ticked
    if(req.body.emailFinal){
      emailChecks[0] = 1;
    }
    if(req.body.emailCancel){
      emailChecks[1] = 1;
    }
    if(req.body.emailDayBefore){
      emailChecks[2] = 1;
    }
    if(req.body.emailRes){
      emailChecks[3] = 1;
    }

    req.pool.getConnection(function(err, connection){
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
    //get first name last name and email using session user id
    var query = "UPDATE Notifications SET NotiFinal = ?, NotiCancel = ?, NotiDayBefore = ?, NotiRespond = ? WHERE user_id = ?;";
    connection.query(query, [emailChecks[0],emailChecks[1],emailChecks[2],emailChecks[3],req.session.user], function(err2, rows, fields){
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
  }

  else{
    res.sendStatus(401);
  }

});

router.get('/logout', function(req, res, next) {
  //console.log("runs 1");
  console.log(req.session.user);
  if ('user' in req.session)
  {
    //console.log("runs 2");
    delete req.session.user;
  }
  res.send();
});

module.exports = router;
