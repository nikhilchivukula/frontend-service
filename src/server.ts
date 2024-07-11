import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

const path = require('path');
const reactAppFolder = path.join(__dirname, '.././react-app/build');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.text());
// app.use (express.raw());
// app.use(express.urlencoded({ extended: false }));


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

  // Add Sample data

  // addSampleData(db);

  return db;
}

// Routes
app.get('/api/events/upcoming', async (req, res) => {
  const db = await initDb();
  const events = await db.all('SELECT * FROM events WHERE date >= date("now") ');
  // const events = await db.all('SELECT * FROM events ');
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
  db.run(insertPast, ["August Health and Wellness Workshop", "2024-05-15 15:30:45", "Microsoft Studio H, Bellevue, Wa", "Learn about stress management, mindfulness, and self-care.", "NA", "Upendar Sandadi", "SEA"]);
  db.run(insertPast, ["Community Cleanup Drive:", "2024-06-05 14:00:00", "Green Lake Park", "Clean up litter and promote environmental awareness.", "NA", "Santhi Kalidindi", "SEA"]);
  db.run(insertPast, ["Interactive Sessions with 'Thought Notch Robotica'", "2024-04-19 17:00:00", "Online", "Interact with the Nethra Robotics Team who is attending the Robotics World Championship in Houston", "NA", "Dr. Aparna", "DAL"])
  db.run(insertPast, ["Youth Talent Show", "2024-07-20", "Issaquah Senior Center", "Talent Show for the youth to display their talents.", "NA", "Upendar Sandadi", "SEA"])



  console.log("Adding sample Executives data.");
  // populate sample data
  var insertExecs = 'INSERT INTO EXECUTIVES (name, picture, description) VALUES (?,?,?)';
  db.run(insertExecs, ["Third Exec Name 3", "https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png", "Third executive description text blah blah"]);
  db.run(insertExecs, ["Fourth Exec Name 4", "https://th.bing.com/th/id/OIP.4DvdfTyTJsP10bST3HPsAAHaDt?rs=1&pid=ImgDetMain", "Fourth executive description text blah blah"]);
}

