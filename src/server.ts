import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
const session = require ('express-session')
const passport = require('passport');


const path = require('path');

require('./auth');


function isLoggedIn(req: any, res: any, next: any) {
    req.user ? next() : res.sendStatus(401);
}


const app = express();
const port = 8080;

const reactAppFolder = path.join(__dirname, '.././react-app/build');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: "cats"}))
app.use(passport.initialize());
app.use(passport.session());

// Initialize database
const initDb = async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // let db = new sqlite3.Database(':memory:');
  console.log("Creating events if not exist.");
  await db.exec(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date datetime,
    location TEXT,
    description TEXT,
    link TEXT,
    lead TEXT,
    branchID TEXT
  )`);

  console.log("Creating Executives if not exist.");
  await db.exec(`CREATE TABLE IF NOT EXISTS executives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    picture TEXT,
    description TEXT
  )`);

  // Store ID for local identifier (users table), display name, first, last name, email, prof pic, branch ID, Role, When was Acc created
  // confirm that each branch has their own admin/director. 
  // Getting ready to show a demo for the VTS Hub App, and had a few questions regarding the specifics of VTSeva. 
  //    1. Does each branch have only 1 director? Can one person be director for multiple branches (Not including National directors/advisors)
  
  console.log("Creating USERS if not exist.");
  await db.exec(`CREATE TABLE IF NOT EXISTS USERS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER,
    display_name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    profile_picture TEXT,
    user_role INTEGER,
    branchID TEXT,
    create_date datetime
  )`);

  // Add Sample data

// addSampleData(db);

  return db;
}

/* Google Auth routes - BEGIN */
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/google/callback',
  passport.authenticate('google', {
      successRedirect: '/auth/success',
      failureRedirect: '/failure'
  })
)

app.get('/failure', (req, res) => {
  res.send('something went wrong');
});

app.get('/protected', isLoggedIn, (req: any, res) => {
  res.send ('Hello!' + JSON.stringify(req.user));
});

app.get('/auth/success', isLoggedIn, (req: any, res) => {
  // res.send ('Hello!' + JSON.stringify(req.user));
  let cookieUser = req.user._json;
  cookieUser.vts = { branchId: 'SEA', role: 0 };
  res.cookie ("user", JSON.stringify(cookieUser));
  res.redirect ('/');
});

app.get('/auth/logout', (req: any, res: any, next: any) => {
  res.clearCookie("user");
  req.logout(function(err: string) {
    if (err) { 
      return next(err); 
    }
    req.session.destroy();
    res.redirect('/');
  });

});
/* Google Auth routes - END */



// Routes
app.get('/api/events/upcoming', async (req, res) => {
  const db = await initDb();
  const events = await db.all('SELECT * FROM events WHERE date >= date("now") ');
  // const events = await db.all('SELECT * FROM events ');
  res.header("Access-Control-Allow-Origin", "*");
  res.json(events);
});

// Routes
app.get('/api/events/calendar', async (req, res) => {
  const db = await initDb();
  var now = new Date();

  // month is 0-index based. 0-11 months in a year.
  const monthParam: any = req.query.month ?? now.getMonth();

  // const month = parseInt(monthParam);
  // var monthStart = "date('" + now.getFullYear() + "-" + month + "-1')";
  // var monthEnd = "date('" + now.getFullYear() + "-" + month + "-31')";
  // const query = 'SELECT * FROM events WHERE date BETWEEN ' + monthStart + ' and ' + monthEnd;

  // const monthInt = parseInt(monthParam);
  // const month = monthInt < 10 ? ("0" + monthInt) : monthInt;
  // var monthStart = "'" + now.getFullYear() + "-" + month + "-1'";
  // var monthEnd = "'" + now.getFullYear() + "-" + month + "-31'";
  // const query = 'SELECT * FROM events WHERE date BETWEEN ' + monthStart + ' and ' + monthEnd;

  const query = 'SELECT * FROM events';

  console.log ("Query being made = " + query);
  const events = await db.all(query);

  res.header("Access-Control-Allow-Origin", "*");
  res.json(events);
});

app.get('/api/events/past', async (req, res) => {
  const db = await initDb();
  const events = await db.all('SELECT * FROM events WHERE date < date("now")');
  // const events = await db.all('SELECT * FROM events ');
  res.header("Access-Control-Allow-Origin", "*");
  res.json(events);
});

app.get('/api/executives', async (req, res) => {
  const db = await initDb();
  const executives = await db.all('SELECT * FROM executives');
  res.header("Access-Control-Allow-Origin", "*");
  res.json(executives);
});

app.get('/api/users', async (req, res) => {
  const db = await initDb();
  const users = await db.all('SELECT * FROM users');
  res.header("Access-Control-Allow-Origin", "*");
  res.json(users);
});



app.get('/api/events/event', async (req, res) => {
  const db = await initDb();
  const eventId = req.query.id;

  const events = await db.all('SELECT * FROM events WHERE id = ' + eventId);
  // const events = await db.all('SELECT * FROM events ');
  res.header("Access-Control-Allow-Origin", "*");
  res.json(events);
});


/* 
  This method takes event-id as querystring param and the Event Details as form input and updates the event in the database.
*/
app.post('/api/events/event', async (req, res) => {
  const db = await initDb();
  const eventId = req.query.id;

  console.log (JSON.stringify(req.body));

  const eventToUpdate = [req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID, eventId];
  const sql = "UPDATE Events SET Name = ?, Date = ?, Location = ?, Description = ?, Link = ?, Lead = ?, branchID = ? WHERE (ID = ?)";
  db.run(sql, eventToUpdate, function (err: any) {
    if (err) {
      console.log ("ERROR UPDATING EVENT: " + err + "\n\nData :" + JSON.stringify(eventToUpdate))
    } else {
      res.redirect("/event-details?id=" + eventId);
    }
  });

  const querySql = 'SELECT * FROM events WHERE id = ' + eventId;
  const events = await db.all(querySql);
  const event = events.length == 1 ? events[0] : null;

  res.header("Access-Control-Allow-Origin", "*");
  res.json(event);
});


/* 
  This method takes event-id as querystring param and the Event Details as form input and updates the event in the database.
*/
/*
app.post('/api/users/sample_users', async (req, res) => {
  const db = await initDb();

  console.log (JSON.stringify(req.body));

  const eventToUpdate = [req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID, eventId];
  const sql = "UPDATE Events SET Name = ?, Date = ?, Location = ?, Description = ?, Link = ?, Lead = ?, branchID = ? WHERE (ID = ?)";
  db.run(sql, eventToUpdate, function (err: any) {
    if (err) {
      console.log ("ERROR UPDATING EVENT: " + err + "\n\nData :" + JSON.stringify(eventToUpdate))
    } else {
      res.redirect("/event-details?id=" + eventId);
    }
  });

  const querySql = 'SELECT * FROM events WHERE id = ' + eventId;
  const events = await db.all(querySql);
  const event = events.length == 1 ? events[0] : null;

  res.header("Access-Control-Allow-Origin", "*");
  res.json(event);
});
*/





//server.js method app.post - enhance and get the event id there + extract properties of event, take input from query stream and focus on simplifying css files. 







// NECESSARY to ensure we can render the react-app bundle files.
app.use(express.static(reactAppFolder));

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
      next();
  } else {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      res.sendFile(path.join(reactAppFolder, 'index.html'));
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log ("__dirname: " + __dirname);
  console.log ("reactAppFolder: " + reactAppFolder);
});

function addSampleData(db: any) {
  console.log("Adding sample Events data.");
  // add sample events
  var insertPast = 'INSERT INTO EVENTS (name, date, location, description, link, lead, branchID) VALUES (?,?,?, ?,?,?,?)';
  // Name, Date, Des, Link, Lead, ID
  db.run(insertPast, ["SAMPLE: August Health and Wellness Workshop", "2024-05-15 15:30:45", "Microsoft Studio H, Bellevue, Wa", "Learn about stress management, mindfulness, and self-care.", "NA", "Upendar Sandadi", "SEA"]);
  db.run(insertPast, ["SAMPLE: Community Cleanup Drive:", "2024-06-05 14:00:00", "Green Lake Park", "Clean up litter and promote environmental awareness.", "NA", "Santhi Kalidindi", "SEA"]);
  db.run(insertPast, ["SAMPLE: NO TIME Community Cleanup Drive:", "2024-06-05", "Green Lake Park", "Clean up litter and promote environmental awareness.", "NA", "Santhi Kalidindi", "SEA"]);
  db.run(insertPast, ["SAMPLE: Interactive Sessions with 'Thought Notch Robotica'", "2024-04-19 17:00:00", "Online", "Interact with the Nethra Robotics Team who is attending the Robotics World Championship in Houston", "NA", "Dr. Aparna", "DAL"])
  db.run(insertPast, ["SAMPLE: Youth Talent Show", "2024-07-20", "Issaquah Senior Center", "Talent Show for the youth to display their talents.", "NA", "Upendar Sandadi", "SEA"])



  console.log("Adding sample Executives data.");
  // populate sample data
  var insertExecs = 'INSERT INTO EXECUTIVES (name, picture, description) VALUES (?,?,?)';
  db.run(insertExecs, ["SAMPLE: Third Exec Name 3", "https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png", "Third executive description text blah blah"]);
  db.run(insertExecs, ["SAMPLE: Fourth Exec Name 4", "https://th.bing.com/th/id/OIP.4DvdfTyTJsP10bST3HPsAAHaDt?rs=1&pid=ImgDetMain", "Fourth executive description text blah blah"]);
}

