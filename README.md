# TutorSA 

* ## Table of content:
  * ### [Install app](#installation)
  * ### [Run app](#run)
  * ### [Notes](#notes)

## Installation

* Install project dependecies
```bash
$ npm install
```

* Setup Postgres database user and database 
[database.sql script](./sql/database.sql)
```sql
CREATE DATABASE tutorsa;

CREATE ROLE tutorsa LOGIN PASSWORD 's3cur3';

GRANT ALL PRIVILEGES ON DATABASE tutorsa TO tutorsa;
```

* Create database tables
[tables.sql](./sql/tables.sql)

```sql
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    post_author INT NOT NULL,
    post_text TEXT NOT NULL,
    post_image TEXT,
    post_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_author) REFERENCES members(id)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    comment_parent INT NOT NULL,
    comment_author INT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_image TEXT,
    comment_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_author) REFERENCES members(id),
    FOREIGN KEY (comment_parent) REFERENCES posts(post_id)
);

CREATE TABLE replies (
    reply_id SERIAL PRIMARY KEY,
    reply_parent INT NOT NULL,
    reply_author INT NOT NULL,
    reply_text TEXT NOT NULL,
    reply_image TEXT,
    reply_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_author) REFERENCES members(id),
    FOREIGN KEY (reply_parent) REFERENCES comments(comment_id)
);

CREATE TABLE liked (
    liked_id SERIAL PRIMARY KEY,
    liked_post INT NOT NULL,
    liked_by INT NOT NULL,
    FOREIGN KEY (liked_by) REFERENCES members(id),
    FOREIGN KEY (liked_post) REFERENCES posts(post_id)
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    message_sender INT NOT NULL,
    message_receiver INT NOT NULL,
    message_text TEXT NOT NULL,
    message_image TEXT,
    message_read BOOLEAN DEFAULT 'f',
    message_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_sender) REFERENCES members(id),
    FOREIGN KEY (message_receiver) REFERENCES members(id)
);


-- SESSION TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

```

## Run

* Start the application
```bash
$ npm start
```

* Start the application in development mode
```bash
$ npm run dev
```

## Notes

### **Currently Needed**
* Strongly need a design for the application (*I am not a designer*)🤦‍♂️
* Welcome page / Index page needs content explaining what the app is about and what it offers

### **Things now working on:**
1. Booking system -:
    1. Students:
        * Students should be able to request a tutor of their choice for a given day/time
        * Students should be able to see which bookings they have made
        * Students should e able to cancel a booking made?
    2. Tutors: 
        * Tutors should be able to see booking request
        * Tutors should be able to reject or accept booking offer (rejection should include reason)
        * Tutors should be able to see a schedule of their booked time slots
    3. Notification: 
        * Students will receive a notification when a booking offer has been accepted
        * A notification shoud be sent on the day of the booking as a reminder?
2. Rating system -: 
    * Students should be able to rate a tutor's ability and leave feedback for others
    * When both student and tutor mark a booking as complete

### **Future plans**:
1. Classroom system -: 
    * Bookings of the same type can be merged to create a classroom for regular students ?