/* Table for storing users */
CREATE TABLE `User` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(50) DEFAULT NULL,
	`last_name` VARCHAR(50) DEFAULT NULL,
	`google` VARCHAR(100) DEFAULT NULL,
	`password` VARCHAR(200) DEFAULT NULL,
	`email` VARCHAR(100) DEFAULT NULL,
	PRIMARY KEY (`user_id`)
);

/* Table for the notification feature */
CREATE TABLE Notifications (
    NotiCancel boolean,
    NotiRespond boolean,
    NotiFinal boolean,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

/* Table for storing events */
CREATE TABLE `Event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int DEFAULT NULL,
  `address_street_name` varchar(50) DEFAULT NULL,
  `address_street_number` varchar(10) DEFAULT NULL,
  `address_state` varchar(50) DEFAULT NULL,
  `address_city` varchar(50) DEFAULT NULL,
  `address_postcode` varchar(10) DEFAULT NULL,
  `address_country` varchar(50) DEFAULT NULL,
  `finalised_time` datetime DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `responses` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  FOREIGN KEY (`creator_id`) REFERENCES User(`user_id`)
);

/* Table for storing availability */
CREATE TABLE `Availability` (
  `startTime` datetime NOT NULL,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES Event(`event_id`),
  FOREIGN KEY (`user_id`) REFERENCES User(`user_id`)
);

/* Table for storing dates */
CREATE TABLE `Dates` (
  `event_id` int NOT NULL,
  `date` date NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`)
);

/* Default entry to handle anonymous users */
INSERT INTO `User` (user_id, first_name, last_name, google, password, email) VALUES (0,'Anon','User',NULL,'$argon2i$v=19$m=4096,t=3,p=1$xHbbALAT4g9KyR3OyrkX5A$fo717dX/vxxvZuXwrfrsqBk8XQNymvdhnTLlqSCQFno', 'A');
UPDATE User SET user_id=0; /* Required since user_id automatically starts as 1 */

//////////Queries for retrieving and inserting data

var query = "INSERT INTO Dates VALUES ";
for (const i of req.body.possibleDate){
query += `(${req.body.event_id}, '${i}'), `;

console.log(query.substr(0, query.length-2));
// console.log(`INSERT INTO Dates VALUES ${req.body.event_id}, ${req.body.possibleDate}`);
connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields)

//
var query = "SELECT creator_id FROM Event WHERE event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)

//
let query = "SELECT user_id,first_name,last_name,email,password FROM User WHERE email= ?";
connection.query(query,[val.email], async function(error,rows,fields)

//
let query = "SELECT user_id,first_name,last_name,email,admin FROM User WHERE email= ?;";
connection.query(query,[email], async function(error,rows,fields)

//
let query = "SELECT * FROM User WHERE email = ?";
connection.query(query,[val.email],async function(error,rows,fields)
//
let query = "INSERT INTO User(first_name,last_name,email,password,admin) VALUES(?,?,?,?,0);";
connection.query(query,[val.first_name,val.last_name,val.email,hash],async function(error,rows,fields)
//
let query = "SELECT user_id,first_name,last_name,email,password,admin FROM User WHERE email= ?";
connection.query(query,[val.email], async function(error,rows,fields)

//check if email already exists in database
//if it does then throw error and do not allow user.
let query = "SELECT * FROM User WHERE email = ?";
connection.query(query,[val.email],async function(error,rows,fields)
//
let query = "INSERT INTO User(first_name,last_name,email,admin) VALUES(?,?,?,0);";
connection.query(query,[first_name,last_name,email],async function(error,rows,fields)
//
let query = "SELECT user_id,first_name,last_name,email,admin FROM User WHERE user_id=LAST_INSERT_ID();";
connection.query(query,async function(error,rows,fields)

//Notifcation default settings set to 0, meaning they do not want notifications
let query = "INSERT INTO Notifications VALUES (0,0,0,?)";
connection.query(query,[rows[0].user_id],async function(error,rows,fields)

// let query = "SELECT user_id,first_name,last_name,email,password FROM User WHERE user_id=LAST_INSERT_ID();";
connection.query(query,async function(error,rows,fields)

//
let query = "INSERT INTO Notifications VALUES (0,0,0,?)";
connection.query(query,[rows[0].user_id],async function(error,rows,fields)
//
var query = "SELECT Dates.date FROM Dates INNER JOIN Event ON Event.event_id=Dates.event_id WHERE Event.event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "SELECT * FROM Event WHERE event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "SELECT first_name, last_name FROM User INNER JOIN Event ON User.user_id=Event.creator_id WHERE Event.event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "SELECT * FROM Availability WHERE event_id=? AND NOT startTime='1000-01-01 00:00:00';";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "UPDATE Event SET responses=? WHERE event_id=?;";
connection.query(query, [req.body.responses, req.params.eventid], function(err2, rows, fields)
//
var query = "DELETE FROM Availability WHERE event_id=? AND NOT startTime='1000-01-01 00:00:00';";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ";
for (const i of req.body.nonDummy){
query += `('${i.startTime}', '${req.params.eventid}', '${i.user_id}'), `;
}
connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields)

//
var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ";
for (const i of req.body.timestamps){
query += `('${i}', '${req.params.eventid}', '0'), `;
}
connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields)
//
var query = "SELECT email from User WHERE user_id IN (SELECT creator_id FROM Event WHERE event_id = ? AND user_id IN (SELECT user_id FROM Notifications WHERE NotiRespond = 1));";
connection.query(query, [eventID], function(err2, rows, fields)
//
var query = "SELECT email from User WHERE user_id IN (SELECT user_id FROM Availability WHERE event_id = ? AND user_id IN (SELECT user_id FROM Notifications WHERE NotiCancel = 1));";
connection.query(query, [eventID], function(err2, rows, fields)
//
var query = "DELETE FROM Availability WHERE event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "DELETE FROM Dates WHERE event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "DELETE FROM Event WHERE event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "UPDATE Event SET finalised_time=? WHERE event_id=?;";
connection.query(query, [req.body.final, req.params.eventid], function(err2, rows, fields)
//
var query = "SELECT email from User WHERE user_id IN (SELECT user_id FROM Availability WHERE event_id = ? AND user_id IN (SELECT user_id FROM Notifications WHERE NotiFinal = 1));";
connection.query(query, [eventID], function(err2, rows, fields)
//
var query = "INSERT INTO Availability (startTime, event_id, user_id) VALUES ('1000-01-01 00:00:00', ?, ?), ";
for (const i of req.body.timestamps){
query += `('${i}', '${req.params.eventid}', '${userid}'), `;
}
connection.query(query.substr(0, query.length-2) + ";", [req.params.eventid, userid], function(err2, rows, fields)
//
var query = "SELECT email from User WHERE user_id IN (SELECT creator_id FROM Event WHERE event_id = ? AND user_id IN (SELECT user_id FROM Notifications WHERE NotiRespond = 1));";
connection.query(query, [eventID], function(err2, rows, fields)
//
let query = "UPDATE User SET password = ? WHERE user_id = ?";
connection.query(query,[hash,req.session.user], async function(error,rows,fields)
//
var query = "INSERT INTO Dates VALUES ";
for (const i of req.body.possibleDate){
query += `(${req.body.event_id}, '${i}'), `;
}
connection.query(query.substr(0, query.length-2) + ";", function(err2, rows, fields)
//
var query = "SELECT MAX(event_id) FROM Event WHERE creator_id = ?;";
connection.query(query, userid, function(err2, rows, fields)
//
let query = "SELECT * FROM User WHERE email = ?";
connection.query(query,[val.email],async function(error,rows,fields)
//
let query = "INSERT INTO User(first_name,last_name,email,password,admin) VALUES(?,?,?,?,1);";
connection.query(query,[val.first_name,val.last_name,val.email,hash],async function(error,rows,fields)
//
var query = "SELECT * FROM User;";
connection.query(query, function(err2, rows, fields)
//
var query = "DELETE FROM User WHERE user_id =?;";
connection.query(query, [val.user_id] , function(err2, rows, fields)
//
var query = "SELECT * FROM Event;";
connection.query(query, function(err2, rows, fields)
//
var query = "DELETE FROM Event WHERE event_id =?;";
connection.query(query, [val.event_id] , function(err2, rows, fields)
//
var query = "SELECT * FROM Event WHERE Event.creator_id = ? UNION SELECT Event.* FROM Event INNER JOIN (SELECT DISTINCT event_id, user_id from Availability) AS DT ON Event.event_id = DT.event_id WHERE DT.user_id = ?;";
connection.query(query, [userid, userid], function(err2, rows, fields)
//
var query = "SELECT * FROM (SELECT * FROM Event WHERE Event.creator_id = ? UNION SELECT Event.* FROM Event INNER JOIN (SELECT DISTINCT event_id, user_id from Availability) AS DT ON Event.event_id = DT.event_id WHERE DT.user_id = ?) AS FT WHERE FT.finalised_time IS NOT NULL;";
connection.query(query, [userid, userid], function(err2, rows, fields)
//
var query = "SELECT * FROM Event;";
connection.query(query, function(err2, rows, fields)
//
var query = "SELECT startTime, Availability.event_id, user_id FROM Availability INNER JOIN Event ON Availability.event_id=Event.event_id WHERE Event.event_id=?;";
connection.query(query, [req.params.eventid], function(err2, rows, fields)
//
var query = "SELECT startTime FROM Availability INNER JOIN User ON Availability.user_id=User.user_id INNER JOIN Event ON Event.event_Id=Availability.event_id WHERE Event.event_id=? AND User.user_id=? AND NOT Availability.startTime='1000-01-01 00:00:00';";
connection.query(query, [req.params.eventid, req.session.user], function(err2, rows, fields)
//
var query = "SELECT * FROM Event INNER JOIN Availability ON Event.creator_id=Availability.user_id WHERE Event.creator_id=?;";
connection.query(query, [req.params.userid], function(err2, rows, fields)
//
var query = "INSERT INTO Event (creator_id, address_street_name, address_street_number, address_state, address_city, address_postcode, address_country, duration, description, name, responses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);";
let rb = req.body;
connection.query(query, [req.session.user, rb.streetName, rb.streetNumber, rb.state, rb.city, rb.postcode, rb.country, rb.duration, rb.description, rb.name], function(err2, rows, fields)
//get first name last name and email using session user id
var query = "SELECT first_name, last_name, email FROM User WHERE user_id = ?";
connection.query(query, [req.session.user], function(err2, rows, fields)

//
var query = "SELECT NotiFinal, NotiCancel, NotiRespond FROM Notifications WHERE user_id = ?";
connection.query(query, [req.session.user], function(err2, rows, fields)

//
var query = "UPDATE Notifications SET NotiFinal = ?, NotiCancel = ?, NotiRespond = ? WHERE user_id = ?;";
connection.query(query, [emailChecks[0],emailChecks[1],emailChecks[2],req.session.user], function(err2, rows, fields)
