var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com');

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/html-files/index.html');
});

router.get('/form', function(req, res, next) {
  res.sendFile(__dirname + '/html-files/signing.html');
});

// Inserting anonymous availabilities
router.post('/anon_availability/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Dates VALUES ";
    for (const i of req.body.possibleDate){
      query += `(${req.body.event_id}, '${i}'), `;
    }
    console.log(query.substr(0, query.length-2));
    // console.log(`INSERT INTO Dates VALUES ${req.body.event_id}, ${req.body.possibleDate}`);
    connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields){
      connection.release();
      if (err2){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// GET page for event invite links
router.get("/event_invite/:eventid", function(req, res) {

  // Get creator
  let creatorid = "";
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT creator_id FROM Event WHERE event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log("SQL Error");
        console.log(query);
        res.sendStatus(500);
        return;
      }
      if(rows.length == 0){
        console.log("event does not exist");
        res.sendStatus(404);
        return;
      }
      else{
        creatorid = rows[0].creator_id;
        // Check user in session
        if ('user' in req.session)
        {
          // If user is creator, redirect to creator event page
          if(req.session.user == creatorid){
            res.redirect("/event_view?eventid=" + req.params.eventid + "&userid=" + req.session.user);
          }
          else{
            res.sendFile(__dirname + '/html-files/auth_event_linked.html');
          }
        }
        else{
          res.sendFile(__dirname + '/html-files/anon_event_linked.html');
        }
      }

    });
  });
});

router.post("/usersignin",function(req,res,next)
{
    var val = req.body;
    if ("email" in val && "password" in val)
    {
      req.pool.getConnection(async function(error,connection)
      {
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }
        let query = "SELECT user_id,first_name,last_name,email,password FROM User WHERE email= ?";
        connection.query(query,[val.email], async function(error,rows,fields)
        {
          connection.release();
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if (rows.length > 0)
          {

            //console.log("success");
            try {
              if (await argon2.verify(rows[0].password, val.password)) {
                console.log("success");
                req.session.user = rows[0].user_id; //session?
                console.log(req.session.user)
                testVal = req.session.user
                res.sendStatus(200);
                // password match
              } else {
                // password did not match
                console.log("bad password");
                res.sendStatus(401);
              }
            } catch (err) {
              // internal failure
              console.log("bad login");
              res.sendStatus(401);
            }
          }
          else
          {
            console.log("bag user");
            res.sendStatus(401);
          }
        });
        });
    }
    else if ("token" in val)
    {
      let email = null;
      async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: val.token,
            audience: '710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        email = payload['email'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
      verify().then(function()
      {
        req.pool.getConnection(async function(error,connection)
        {
          if(error){
            console.log(error);
            res.sendStatus(500);
            return;
          }

          let query = "SELECT user_id,first_name,last_name,email FROM User WHERE email= ?;";
          connection.query(query,[email], async function(error,rows,fields)
          {
            connection.release();
            if(error)
            {
              console.log(error);
              res.sendStatus(500);
              return;
            }
            if (rows.length > 0)
            {
              req.session.user = rows[0].user_id;
              console.log("success");
              res.sendStatus(200);
            }
            else
            {
              console.log("bad user");
              res.sendStatus(401);
            }
          });
        });
      }).catch(function()
            {
              console.log(email);
              res.sendStatus(403);
            });
    }
    else
    {
      res.sendStatus(400); //bad request
    }
});

router.post("/signup",function(req,res,next)
{
    var val = req.body;
    if ("token" in val)
    {
      let email = null;
      var name = null;
      async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: val.token,
            audience: '710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        email = payload['email'];
        name = payload['name'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
      verify().then(function()
      {
        req.pool.getConnection(async function(error,connection)
        {
          if(error){
            console.log(error);
            res.sendStatus(500);
          }

          //check if email already exists in database
          //if it does then throw error and do not allow user.
          let query = "SELECT * FROM User WHERE email = ?";
          connection.query(query,[val.email],async function(error,rows,fields)
          {
            //connection.release();
            if(rows.length > 0)
            {
              console.log('email exists');
              res.sendStatus(409);
              return;
            }

            var names = name.split(" ");
            var first_name = names[0];
            names.shift();
            var last_name = names.join(' ');
            let query = "INSERT INTO User(first_name,last_name,email) VALUES(?,?,?);";
            connection.query(query,[first_name,last_name,email],async function(error,rows,fields)
            {
              //connection.release();
              if(error)
              {
                console.log(error);
                res.sendStatus(403);
                return;
              }
              let query = "SELECT user_id,first_name,last_name,email FROM User WHERE user_id=LAST_INSERT_ID();";
              connection.query(query,async function(error,rows,fields)
              {
                connection.release();
                if(error)
                {
                  console.log(error);
                  res.sendStatus(403);
                  return;
                }
                if (rows.length > 0)
                {
                  console.log("success");
                  req.session.user = rows[0].user_id; //session?
                  res.sendStatus(200);
                }
                else
                {
                  console.log("bag login");
                  res.sendStatus(401);
                }
              });
            });
          });
        });
      });
    }
    else if ("first_name" in val && "last_name" in val && "email" in val && "password" in val)
    {
      req.pool.getConnection(async function(error,connection)
      {
        if(error){
          console.log(error);
          res.sendStatus(500);
        }

        //check if email already exists in database
        //if it does then throw error and do not allow user.
        let query = "SELECT * FROM User WHERE email = ?";
        connection.query(query,[val.email],async function(error,rows,fields)
        {
          //connection.release();
          if(rows.length > 0)
          {
            connection.release();
            console.log('email exists');
            res.sendStatus(409);
            return;
          }
            let hash= null;
            try {
              hash = await argon2.hash(val.password);
            } catch (err) {
              console.log("to err is human");
              console.log(error);
              res.sendStatus(500);
              return;
            }
          let query = "INSERT INTO User(first_name,last_name,email,password) VALUES(?,?,?,?);";
          connection.query(query,[val.first_name,val.last_name,val.email,hash],async function(error,rows,fields)
          {
            //connection.release();
            if(error)
            {
              console.log(error);
              res.sendStatus(403);
              return;
            }
            let query = "SELECT user_id,first_name,last_name,email,password FROM User WHERE user_id=LAST_INSERT_ID();";
            connection.query(query,async function(error,rows,fields)
            {
              connection.release();
              if(error)
              {
                console.log(error);
                res.sendStatus(403);
                return;
              }
              if (rows.length > 0)
              {
                console.log("success");
                req.session.user = rows[0].user_id; //session?
                res.sendStatus(200);
              }
              else
              {
                console.log("bad login");
                res.sendStatus(401);
              }
            });
          });
        });
      });
    }
    else
    {
      res.sendStatus(400); //bad request
    }
});

// GET proposed dates for an event
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
    var query = "SELECT first_name, last_name FROM User INNER JOIN Event ON User.user_id=Event.creator_id WHERE Event.event_id=?;";
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

router.get('/existing_availabilities/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Availability WHERE event_id=? AND NOT startTime='1000-01-01 00:00:00';";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// DELETE all non-dummy availability for an event
router.post('/delete_non_dummy_availability/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      // console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM Availability WHERE event_id=? AND NOT startTime='1000-01-01 00:00:00';";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        // console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// Re-INSERT non-dummy availability
router.post('/reinsert_availability/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ";
    console.log(req.body.nonDummy);
    for (const i of req.body.nonDummy){
      // console.log(i);
      query += `('${i.startTime}', '${req.params.eventid}', '${i.user_id}'), `;
    }
    connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// INSERT anon availability
router.post('/anon_submit_availability/:eventid', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ";
    console.log(req.params);
    for (const i of req.body.timestamps){
      query += `('${i}', '${req.params.eventid}', '0'), `;
    }
    console.log(query.substr(0, query.length-2) + ";");
    connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

//AUTHORIZATION BLOCK
//ALL ROUTES FROM HERE REQUIRE AUTHORIZATION
//Redirection links.
router.use(function(req, res, next) {
  if ('user' in req.session)
  {
    console.log("user logged in");
    next();
  }
  else{
    console.log("user not logged in");
    res.statusCode = 401;
    res.sendFile(__dirname + '/html-files/signing.html');
  }
});

router.get('/home', function(req, res, next) {
    res.sendFile(__dirname + '/html-files/home.html');
});

router.get('/settings', function(req, res, next) {
    res.sendFile(__dirname + '/html-files/settings.html');
});

router.get('/events', function(req, res, next) {
    res.sendFile(__dirname + '/html-files/events.html');
});

router.post('/delete_avail/:eventid', function(req, res, next) {
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM Availability WHERE event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/delete_dates/:eventid', function(req, res, next) {
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM Dates WHERE event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/delete_event/:eventid', function(req, res, next) {
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM Event WHERE event_id=?;";
    connection.query(query, [req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/finalise_time/:eventid', function(req, res, next) {
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Event SET finalised_time=? WHERE event_id=?;";
    connection.query(query, [req.body.final, req.params.eventid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// INSERT auth availability
router.post('/auth_submit_availability/:eventid', function(req, res, next){
  let userid = req.session.user;
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ('1000-01-01 00:00:00', ?, ?), ";
    console.log(req.params);
    for (const i of req.body.timestamps){
      query += `('${i}', '${req.params.eventid}', '${userid}'), `;
    }
    console.log(query.substr(0, query.length-2) + ";");
    connection.query(query.substr(0, query.length-2) + ";", [req.params.eventid, userid], function(err2, rows, fields){
      connection.release();
      if (err2){
        console.log(err2);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/settingsChangePassword1', function(req, res, next) {
  let val = req.body
  if ("new_password" in val)
    {
      req.pool.getConnection(async function(error,connection)
      {
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }

        let hash= null;
            try {
              hash = await argon2.hash(val.new_password);
            } catch (err) {
              console.log("to err is human");
              console.log(error);
              res.sendStatus(500);
              return;
            }

        let query = "UPDATE User SET password = ? WHERE user_id = ?";
        connection.query(query,[hash,req.session.user], async function(error,rows,fields)
        {
          connection.release();
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          else{
            res.sendStatus(200);
            return;
          }
        });
      });
    }
});

router.get('/create_event', function(req, res, next) {
  res.sendFile(__dirname + '/html-files/create_event.html');
});

router.post('/create_proposed_dates', function(req, res, next){
  let userid = req.session.user;
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Dates VALUES ";
    for (const i of req.body.possibleDate){
      query += `(${req.body.event_id}, '${i}'), `;
    }
    console.log(query.substr(0, query.length-2));
    // console.log(`INSERT INTO Dates VALUES ${req.body.event_id}, ${req.body.possibleDate}`);
    connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields){
      connection.release();
      if (err2){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.get('/most_recent_event_insertion', function(req, res, next){
  let userid = req.session.user;
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT MAX(event_id) FROM Event WHERE creator_id = ?;";
    connection.query(query, userid, function(err2, rows, fields){
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

router.get('/event_view', function(req, res, next){
  let userid = req.session.user;
  let creatorid = req.query.userid;
  if (userid == creatorid){
    res.sendFile(__dirname + '/html-files/event_creator_view.html');
  }
  else{
    res.sendFile(__dirname + '/html-files/event_attendee_view.html');
  }
});

router.get('/auth_event_linked', function(req, res, next) {
  res.sendFile(__dirname + '/html-files/auth_event_linked.html');
});

//Redirection links end here


// GET a user's events
router.get('/get_user_events', function(req, res, next){
  let userid = req.session.user;
  req.pool.getConnection(function(err, connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event WHERE creator_id = ?;";
    connection.query(query, userid, function(err2, rows, fields){
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

module.exports = router;
