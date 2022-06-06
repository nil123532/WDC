var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com');

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/html-files/index.html');
});

router.post("/signin",function(req,res,next)
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
    res.sendFile(__dirname + '/html-files/index.html');
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

router.get('/create_event', function(req, res, next) {
  res.sendFile(__dirname + '/html-files/create_event.html');
});

router.get('/create_event', function(req, res, next) {
  res.sendFile(__dirname + '/html-files/create_event.html');
});

//Redirection links end here

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
