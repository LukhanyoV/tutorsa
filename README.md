# TutorSA 

## Table of content:
  * [Install app](#installation)
  * [Run app](#run)
  * [Dev Notes](#notes)

## Installation

* Install project dependecies
```bash
$ npm install
```

* Setup Postgres database user and database 
[database.sql script](./sql/database.sql)

* Create database tables
[tables.sql script](./sql/tables.sql)

* Populate default data
[data.sql script](./sql/data.sql)

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