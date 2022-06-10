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