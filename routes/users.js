var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
              if (await argon2.verify(row[0].password, val.password)) {
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
              console.log("bag login");
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
            console.log(error);
            res.sendStatus(500);
            return;
          }
        let query = "INSERT INTO User(first_name,last_name,email,password) VALUES(?,?,?,?)";
        connection.query(query,[val.first_name,val.last_name,val.email,hash],function(error,rows,fields)
        {
          //connection.release();
          if(error)
          {
            console.log(error);
            res.sendStatus(403);
            return;
          }
          let query = "SELECT user_id,first_name,last_name,email,password FROM User WHERE user_id=LAST_INSERT_ID()";
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
    else
    {
      res.sendStatus(400); //bad request
    }
});

module.exports = router;
