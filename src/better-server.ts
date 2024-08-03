import express from 'express';
//import sqlite3 from 'sqlite3';
//const sqlite3 = require("sqlite3").verbose();
const betterSqlite3 = require("better-sqlite3");
// import { open } from 'sqlite';
import bodyParser from 'body-parser';
const session = require('express-session')
const passport = require('passport');

const path = require('path');


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

console.log ("App settings: GOOGLE_CLIENT_ID = " + GOOGLE_CLIENT_ID);
console.log ("App settings: GOOGLE_CLIENT_SECRET = " + GOOGLE_CLIENT_SECRET);
console.log ("App settings: GOOGLE_CALLBACK_URL = " + GOOGLE_CALLBACK_URL);
console.log ("App settings: PORT = " + process.env.PORT);

require('./auth');


function isLoggedIn(req: any, res: any, next: any) {
    req.user ? next() : res.sendStatus(401);
}


const app = express();

const port = process.env.PORT || 8080;

const reactAppFolder = path.join(__dirname, './build');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: "cats" }))
app.use(passport.initialize());
app.use(passport.session());

// Initialize database
function initDb() {
    // const db = await open({
    //   filename: './database.sqlite',
    //   driver: sqlite3.Database
    // });

    //  const db = new sqlite3.Database('./database.sqlite');
    const options = { verbose: console.log };
    const db = betterSqlite3('./database.sqlite', options);

    // let db = new sqlite3.Database(':memory:');
    console.log("Creating events if not exist.");
    db.prepare(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date datetime,
    location TEXT,
    description TEXT,
    link TEXT,
    lead TEXT,
    branchID TEXT
  )`).run();

    console.log("Creating Executives if not exist.");
    db.prepare(`CREATE TABLE IF NOT EXISTS executives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    picture TEXT,
    description TEXT
  )`).run();

    // Store ID for local identifier (users table), display name, first, last name, email, prof pic, branch ID, Role, When was Acc created
    // confirm that each branch has their own admin/director. 
    // Getting ready to show a demo for the VTS Hub App, and had a few questions regarding the specifics of VTSeva. 
    //    1. Does each branch have only 1 director? Can one person be director for multiple branches (Not including National directors/advisors)

    console.log("Creating USERS if not exist.");
    db.prepare(`CREATE TABLE IF NOT EXISTS USERS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id TEXT,
    display_name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    profile_picture TEXT,
    user_role INTEGER,
    branchID TEXT,
    create_date datetime
  )`).run();

    // Add Sample data

    AddSampleDataIfNotAlready(db);
    console.log("AddSampleDataIfNotAlready completed!");


    return db;
}

/* Google Auth routes - BEGIN */
app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
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
    res.send('Hello!' + JSON.stringify(req.user));
});

app.get('/auth/success', isLoggedIn, async (req: any, res) => {
    // res.send ('Hello!' + JSON.stringify(req.user));
    let cookieUser = req.user._json;
    const auth_id = req.user.sub;

    // Now check if the user is in our users database.
    const db = await initDb();
    const sql = "SELECT * FROM Users WHERE auth_id = '" + auth_id + "'";
    console.log("User check query = " + sql);

    // const users = await db.all(sql);

    let isUserAllowed: boolean = false;

    var registeredUsers = db.prepare(sql).iterate();
    for (const user of registeredUsers) {
        console.log("Checking User.auth_id " + user.auth_id);
        if (user.auth_id == auth_id) {
            isUserAllowed = true;
            break;
        }
    };

    if (isUserAllowed) {
        // if user is registered then add the cookie and let the user-in back to home page.
        cookieUser.vts = { branchId: 'SEA', role: 0 };
        res.cookie("user", JSON.stringify(cookieUser));
        res.redirect('/');
    } else {
        // user is not-registered therefore not allowed to see the signed-in experience.
        res.clearCookie("user");
        req.session.destroy();
        res.redirect('/un-registered');
    }
});

app.get('/auth/logout', (req: any, res: any, next: any) => {
    res.clearCookie("user");
    req.logout(function (err: string) {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.redirect('/');
    });

});

app.get('/un-registered', isLoggedIn, (req: any, res) => {
    res.sendFile("./unregistered.html");
});

/* Google Auth routes - END */



// Routes
app.get('/api/events/upcoming', async (req, res) => {
    const db = await initDb();
    const events = db.prepare("SELECT * FROM events WHERE date >= date('now') ").all();
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

    console.log("Query being made = " + query);
    const events = db.prepare(query).all();

    res.header("Access-Control-Allow-Origin", "*");
    res.json(events);
});

app.get('/api/events/past', async (req, res) => {
    const db = initDb();
    const events = db.prepare("SELECT * FROM events WHERE date < date('now')").all();
    // const events = await db.all('SELECT * FROM events ');
    res.header("Access-Control-Allow-Origin", "*");
    res.json(events);
});

app.get('/api/executives', async (req, res) => {
    const db = initDb();
    const executives = db.prepare('SELECT * FROM executives').all();
    res.header("Access-Control-Allow-Origin", "*");
    res.json(executives);
});

app.get('/api/users', async (req, res) => {
    const db = initDb();
    const users = db.prepare('SELECT * FROM users').all();
    res.header("Access-Control-Allow-Origin", "*");
    res.json(users);
});



app.get('/api/events/event', async (req, res) => {
    const db = initDb();
    const eventId = req.query.id;

    const events = db.prepare('SELECT * FROM events WHERE id = ' + eventId).all();
    // const events = await db.all('SELECT * FROM events ');
    res.header("Access-Control-Allow-Origin", "*");
    res.json(events);
});


/* 
  This method takes event-id as querystring param and the Event Details as form input and updates the event in the database.
*/
app.post('/api/events/event', async (req, res) => {
    const db = initDb();
    const eventId = req.query.id;
    res.header("Access-Control-Allow-Origin", "*");


    if (eventId != null) {
        console.log(JSON.stringify(req.body));

        const eventToUpdate = [req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID, eventId];
        const sql = "UPDATE Events SET Name = ?, Date = ?, Location = ?, Description = ?, Link = ?, Lead = ?, branchID = ? WHERE (ID = ?)";

        console.log("UPDATING EVENT: " + JSON.stringify(eventToUpdate))
        var stmt = db.prepare(sql);
        stmt.run(req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID, eventId);
        // res.redirect("/event-details?id=" + eventId);

        const querySql = 'SELECT * FROM events WHERE id = ' + eventId;
        const events = db.prepare(querySql).all();
        const event = events.length == 1 ? events[0] : null;

        res.header("Access-Control-Allow-Origin", "*");
        res.json(event);
    } else {
        // NO EVENTID exists, so this is Add New Event flow.

        console.log(JSON.stringify(req.body));

        try {
            // Insert new event into sqlite and fetch the newly inserted ID and return error or redirect to event-details page.
            const eventToUpdate = [req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID];
            const sql = "INSERT INTO Events (name, date, location, description, link, lead, branchID) VALUES (?,?,?, ?,?,?,?)";
            //        var insertPast = 'INSERT INTO EVENTS (name, date, location, description, link, lead, branchID) VALUES (?,?,?, ?,?,?,?)';

            console.log("Inserting EVENT: " + JSON.stringify(eventToUpdate))
            var stmt = db.prepare(sql);
            const info = stmt.run(req.body.eventName, req.body.eventDate, req.body.eventLocation, req.body.eventDescription, req.body.eventLink, req.body.eventLead, req.body.eventBranchID);
            console.log ( "insert run INFO = " + JSON.stringify(info));
            if (info.changes == 1)
            {
                const rowid = info.lastInsertRowid;
                //display success, show event that was created, redirect to edit event page
                const querySql = 'SELECT * FROM events WHERE ROWID = ' + rowid;
                const newlyAddedEventResult = db.prepare(querySql).all();
                const newlyAddedEvent = newlyAddedEventResult.length == 1 ? newlyAddedEventResult[0] : null;
                // res.json(newlyAddedEvent);
                const newEventId = newlyAddedEvent["id"];
                res.redirect("/event-details?action=addcompleted&id=" + newEventId);
            }
        } catch (err) {
            // TODO: REMOVE THIS for production builds
            res.status(500).send("Internet Server Error - Error: " + err);
        }
    }

    console.error("EVENT - POST API -- Internet Server Error - Unexpected codepath reached.");

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
    console.log("__dirname: " + __dirname);
    console.log("reactAppFolder: " + reactAppFolder);
});



function AddSampleDataIfNotAlready(db: any) {
    console.log("********  Checking and seeding sample data!!!!  ***************");

    // var savedEvents: any = null, savedExecs: any = null, savedUsers: any = null;

    console.log("Checking and adding EVENTS.");
    var savedEvents = db.prepare("select * from EVENTS").all();
    console.log("Checking EVENTS.");
    if (savedEvents != null && savedEvents.length == 0) {
        // add sample events
        var insertPast = 'INSERT INTO EVENTS (name, date, location, description, link, lead, branchID) VALUES (?,?,?, ?,?,?,?)';
        var stmt = db.prepare(insertPast);
        // Name, Date, Des, Link, Lead, ID
        stmt.run("SAMPLE: August Health and Wellness Workshop", "2024-05-15 15:30:00Z", "Microsoft Studio H, Bellevue, Wa", "Learn about stress management, mindfulness, and self-care.", "NA", "Upendar Sandadi", "SEA");
        stmt.run("SAMPLE: Community Cleanup Drive:", "2024-06-05 14:00:00Z", "Green Lake Park", "Clean up litter and promote environmental awareness.", "NA", "Santhi Kalidindi", "SEA");
        stmt.run("SAMPLE: NO TIME Community Cleanup Drive:", "2024-06-05", "Green Lake Park", "Clean up litter and promote environmental awareness.", "NA", "Santhi Kalidindi", "SEA");
        stmt.run("SAMPLE: Interactive Sessions with 'Thought Notch Robotica'", "2024-04-19 17:00:00Z", "Online", "Interact with the Nethra Robotics Team who is attending the Robotics World Championship in Houston", "NA", "Dr. Aparna", "DAL")
        stmt.run("SAMPLE: Youth Talent Show", "2024-07-29 09:00:00Z", "Issaquah Senior Center", "Talent Show for the youth to display their talents.", "NA", "Upendar Sandadi", "SEA")
    } else {
        console.log('EVENTS table has ' + savedEvents?.length + ' rows already');
    }

    console.log("Checking and adding EXECUTIVES.");
    const savedExecs = db.prepare("select * from EXECUTIVES").all();
    console.log("Checking EXECUTIVES table.");

    if (savedExecs != null && savedExecs.length == 0) {
        console.log("Adding sample Executives data.");
        // populate sample data
        var insertExecs = 'INSERT INTO EXECUTIVES (name, picture, description) VALUES (?,?,?)';
        var stmt = db.prepare(insertExecs);
        stmt.run("SAMPLE: Third Exec Name 3", "https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png", "Third executive description text blah blah");
        stmt.run("SAMPLE: Fourth Exec Name 4", "https://th.bing.com/th/id/OIP.4DvdfTyTJsP10bST3HPsAAHaDt?rs=1&pid=ImgDetMain", "Fourth executive description text blah blah");
    } else {
        console.log('EXECUTIVES table has ' + savedExecs?.length + ' rows already');
    }

    // db.all("delete from USERS", [], (err: string, rows: any) => {
    // });
    // console.log ("DELETED users table");

    console.log("Checking and adding EXECUTIVES.");

    const savedUsers = db.prepare("select * from USERS").all();
    console.log("Checking USERS table");
    if (savedUsers != null && savedUsers.length == 0) {

        console.log("Adding sample USERS data.");
        // populate sample USERS data
        // id INTEGER AUTOINCREMENT, auth_id INTEGER, display_name TEXT, first_name TEXT, last_name TEXT, email TEXT, profile_picture TEXT, user_role INTEGER, branchID TEXT, create_date datetime

        var insertUsers = 'INSERT INTO USERS (auth_id, display_name, first_name, last_name, email, profile_picture, user_role, branchID, create_date) VALUES (?,?,?, ?,?,?, ?,?,?)';
        var stmt = db.prepare(insertUsers);
        stmt.run("117281734342025434229", "Nikhil Chivukula", "Nikhil", "Chivukula", "nicksterchiv@gmail.com", "https://lh3.googleusercontent.com/a/ACg8ocKFc9yhu4dZogOd3KNWst5jpoqxINmrTyua5hSqUfGJtp25yKMs=s96-c", 0, "SEA-B", '2024-07-06 13:11');
        // db.run(insertUsers, ["SAMPLE: Fourth Exec Name 4", "https://th.bing.com/th/id/OIP.4DvdfTyTJsP10bST3HPsAAHaDt?rs=1&pid=ImgDetMain", "Fourth executive description text blah blah"]);
    } else {
        console.log('USERS table has ' + savedUsers?.length + ' rows already');
    }

}

