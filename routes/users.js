var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
    var query = "INSERT INTO Event (creator_id, address_street_name, address_street_number, address_state, address_city, address_postcode, address_country, duration, description, name) VALUES (8, ?, ?, ?, ?, ?, ?, 1, ?, ?);";
    let rb = req.body;
    // let finalised_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(query, [rb.streetName, rb.streetNumber, rb.state, rb.city, rb.postcode, rb.country, rb.description, rb.name], function(err2, rows, fields){
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
                //req.session.user = rows[0]; //session?
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
              console.log("success");
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
    if ("first_name" in val && "last_name" in val && "email" in val && "password" in val)
    {
        req.pool.getConnection(async function(error,connection)
        {
          if(error){
            console.log(error);
            res.sendStatus(500);
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
              //req.session.user = rows[0]; //session?
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
    }
    else if ("token" in val)
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
                //req.session.user = rows[0]; //session?
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
    }
    else
    {
      res.sendStatus(400); //bad request
    }
});


router.post('/logout', function(req, res, next) {
  /*if ('user' in req.session)
  {
    delete req.session.user;
  }*/
  res.send();
});

module.exports = router;
