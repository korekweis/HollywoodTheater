import express from 'express';
import mongoose from 'mongoose';
// middleware so that if info in the db changes, no need to 
// keep on refreshing
import Pusher from 'pusher';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import { default as connectMongoDBSession} from 'connect-mongodb-session';
// import MongoStore from 'connect-mongo'; 

//importing database objects: 
import Movies from "./model/dbMovie.js";
import Users from "./model/dbUser.js";
import Row from "./model/dbRow.js";
import Wishlist from "./model/dbWishlist.js";
import Tickets from "./model/dbMyTickets.js";

// for session 
var user_email = null;

// app config 
const app = express();
// require('dotenv').config();
const port = process.env.PORT || 9000;

/* Pusher.com
needed since for mongodb you have to refresh everytime an object 
is added so we need this
*/
const pusher = new Pusher({
    appId: "1293565",
    key: "4d65b1d9b99c8c2d34fb",
    secret: "ee719cd471fbbb6733fe",
    cluster: "us3",
    useTLS: true
});

// middleware
app.use(express.json());
// check 3:18:38 for setting Header

// app.use(cors());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
// pw: cinemark-theater

const connection_url = 'mongodb+srv://kweis:cinemark-theater@cluster0.0gpb9.mongodb.net/theaterDB?retryWrites=true&w=majority'
mongoose.connect(connection_url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', err => { 
    console.log(err.message);
})

app.use(cookieParser());

//  session for users 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge  : 1000 * 60 * 60 * 3, // if 1 day * 24 but since *3 its for 3 hours only
    },
    // session: MongoStore.create({ 
    //     mongoUrl: db, 
    //     collection: 'sessions',
    // })
}))

db.once("open", () => { 
    console.log("DB connected");

    const movieCollection = db.collection("moviecontents");
    const changeStream = movieCollection.watch();

    changeStream.on("change", (change) => {
        console.log("A change occured", change);
    })
});

// USER
app.post('/user/register', (req, res) => { 
    const registerUser = req.body;
    Users.create(registerUser, (err, data) => { 
        if (err) { 
            res.status(500).send(err)
        } else { 
            req.session.user = registerUser['_id'];
            console.log("registerUser id");
            console.log(registerUser['_id']);
            res.status(201).send(`new User: ${data}`)
        }
    })
})

app.post('/user/login', (req, res) => { 
    const loginUser = req.body;
    const email = loginUser['email'];
    const password = loginUser['password'];
    if (!email || !password){ 
        res.status(400).json({success: false, error: "Please provide email and password"});
    }
    try { 
        Users.findOne({ email: email }, (err, user) => { 
            console.log("IN LOGGING IN!!!"); 
            console.log(user['password']);
            if (password == user['password']){
                user_email = user['email'];
                // const sessUser = {email: user_email, firstName: user['firstName'], lastName: user['lastName']};
                // req.session.user(user['email']);
                req.session.user = "sessUser";
                // req.session.email = user_email
                console.log("FIND ONE CHECKER");
                console.log(req.session.user);
                res.status(200).send(user_email);
            } else {
                res.status(400).json({success: false, error: "incorrect password"});
            }
        });
    } catch { 
    }
})

app.get('/user/loggedIn', (req, res) => { 
    // console.log("IN USER/LOGGED IN"); 
    // console.log(req.session.user);
    if (user_email) {
        // console.log("PRINTING EMAIL in loggedIn: "); 
        // console.log(user_email);
        Users.findOne({ email: user_email }, (err, user) => { 
            // console.log("in logged in, in server!!!");
            // console.log(user);
            res.status(200).send(user);
        })
    } else { 
        console.log("no session");
        res.status(400);
    }
})

app.post('/user/loggingOut', (req, res) => { 
    console.log("LOGGING OUT");
    user_email = null;
    // req.session.destroy();
    // res.status(200).send(null);

    //to delete if ever
    req.session.destroy((err) => { 
        if (err) { 
            throw err;
        }
        res.clearCookie("session-id");
        res.status(200).send("Logged Out");
    })
});

// MOVIES
app.get('/movies/', (req, res) => { 
    // find function is used to get all the messages
    Movies.find((err, data) => { 
        if (err) { 
            res.status(500).send(err)
        } else { 
            // this is different from 201 below
            res.status(200).send(data)
        }
    })
})

app.post('/movies/', (req, res) => { 
    const dbMovies = req.body;
    Movies.create(dbMovies, (err, data) => {
        if (err) { 
            res.status(500).send(err)
        } else { 
            res.status(201).send(`new Movie: ${data}`)
        }
    })
})

// ROW
app.get('/rows/:movieId/:timeId', (req, res) => { 
    let movieId = req.params.movieId;
    movieId = movieId.substring(1);
    const timeId = req.params.timeId;
    let getSeats;
    let getTimeSlots;
    const length_timeId = timeId.length;
    Movies.findOne({ _id: movieId }, (err, movie) => {
        let title = movie['title'];
        getTimeSlots = movie['timeslots'];
        let index = timeId.substring(1, length_timeId);
        getSeats = getTimeSlots[parseInt(index)-1];
        res.status(201).send({seats: getSeats["seats"], time: getSeats["time"], movie: movie});
    })
})

app.post('/rows/', (req, res) => { 
    const rows = req.body;
    Row.create(rows, (err, data) => {
        if (err) { 
            res.status(500).send(err)
        } else { 
            res.status(201).send(`new Row: ${data}`)
        }
    })
})

//CONFIRM SEATS
app.post('/confirm/:movieId/:timeId', (req, res) => { 
    let movieId = req.params.movieId;
    movieId = movieId.substring(1);
    const timeId = req.params.timeId;
    const selectedSeats = req.body.seats;
    const getData = req.body.data;
    let getSeats;
    let getTimeSlots;
    const length_timeId = timeId.length;
    // Movies.findOne({ movieId }, (err, movie) => {
    //     getTimeSlots = movie['timeslots'];
    //     let index = timeId.substring(1, length_timeId);

    //     //get the seats
    //     getSeats = getTimeSlots[parseInt(index)-1];
    // })

    let temp_timeId = parseInt(timeId.substring(1, length_timeId));
    var testObject = [[
                        {"id": 1,"number": 1,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 2,"number": 2,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 3,"number": 3,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 4,"number": 4,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 5,"number": 5,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 6,"number": 6,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 7,"number": 7,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 8,"number": 8,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 9,"number": 9,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 10,"number": 10,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 11,"number": 11,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 12,"number": 12,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 13,"number": 13,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 14,"number": 14,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 15,"number": 15,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 16,"number": 16,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 17,"number": 17,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 18,"number": 18,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 19,"number": 19,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 20,"number": 20,"isReserved":false,"isSelected":false,"tooltip":""} 
                    ], [
                        {"id": 21,"number": 1,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 22,"number": 2,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 23,"number": 3,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 24,"number": 4,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 25,"number": 5,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 26,"number": 6,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 27,"number": 7,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 28,"number": 8,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 29,"number": 9,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 30,"number": 10,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 31,"number": 11,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 32,"number": 12,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 33,"number": 13,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 34,"number": 14,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 35,"number": 15,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 36,"number": 16,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 37,"number": 17,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 38,"number": 18,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 39,"number": 19,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 40,"number": 20,"isReserved":false,"isSelected":false,"tooltip":""}
                    ], [
                        {"id": 41,"number": 1,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 42,"number": 2,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 43,"number": 3,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 44,"number": 4,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 45,"number": 5,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 46,"number": 6,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 47,"number": 7,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 48,"number": 8,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 49,"number": 9,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 50,"number": 10,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 51,"number": 11,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 52,"number": 12,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 53,"number": 13,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 54,"number": 14,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 55,"number": 15,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 56,"number": 16,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 57,"number": 17,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 58,"number": 18,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 59,"number": 19,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 60,"number": 20,"isReserved":false,"isSelected":false,"tooltip":""}
                    ], [
                        {"id": 61,"number": 1,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 62,"number": 2,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 63,"number": 3,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 64,"number": 4,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 65,"number": 5,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 66,"number": 6,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 67,"number": 7,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 68,"number": 8,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 69,"number": 9,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 70,"number": 10,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 71,"number": 11,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 72,"number": 12,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 73,"number": 13,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 74,"number": 14,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 75,"number": 15,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 76,"number": 16,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 77,"number": 17,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 78,"number": 18,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 79,"number": 19,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 80,"number": 20,"isReserved":false,"isSelected":false,"tooltip":""}
                    ], [
                        {"id": 81,"number": 1,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 82,"number": 2,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 83,"number": 3,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 84,"number": 4,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 85,"number": 5,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 86,"number": 6,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 87,"number": 7,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 88,"number": 8,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 89,"number": 9,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 90,"number": 10,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 91,"number": 11,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 92,"number": 12,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 93,"number": 13,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 94,"number": 14,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 95,"number": 15,"isReserved":false,"isSelected":false,"tooltip":""},
                        {"id": 96,"number": 16,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 97,"number": 17,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 98,"number": 18,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 99,"number": 19,"isReserved":false,"isSelected":false,"tooltip":""}, 
                        {"id": 100,"number": 20,"isReserved":false,"isSelected":false,"tooltip":""}
                    ]
                ]
    
    for (var i = 0; i<getData.length; i++) { 
        for (var j = 0; j<getData[i].length; j++) { 
            for (var s=0; s<selectedSeats.length; s++) {
                if (selectedSeats[s] === getData[i][j]["id"]) {
                    getData[i][j]["isReserved"] = true;
                }
            }
        }
    }
    
    Movies.updateOne(
        { _id: movieId },
        { $set: {"timeslots.$[time].seats": getData}},
        // { $set: {"timeslots.$[time].seats": testObject}},
        { arrayFilters: [{"time.id": temp_timeId}]}
    ).then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`)
        }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))


    //COMMENT OUT IF YOU WILL RESET SEATS
    let movie = mongoose.Types.ObjectId(movieId);
    let time = req.body.time;
    if (user_email) { 
        // console.log("inside creating tickets");
        // let timeIndex = parseInt(timeId.substring(1, length_timeId));
        Tickets.create([{user: user_email, movie: movie, time: time, tickets: selectedSeats}], (err, data) => { 
            if (err) { 
                res.status(500).send(err)
            } else { 
                res.status(201).send(`new WishList: ${user_email} and ${movie}`)
            }
        })
    }
})

//getting tickets
app.get('/user/myTickets', (req, res) => { 
    Tickets.find({user: user_email}).populate("movie", null, "moviecontents").exec((err, data) => { 
        if (err) { 
            console.log("error");
            console.log(err);
            res.status(500).send(err);
        } else { 
            console.log("printing data");
            console.log(data);
            res.status(201).send(data);
        }
    })
})

//Adding to WishList
app.post('/user/wishlist', (req, res) => { 
    let user = req.body.user;
    let movie = req.body.movie;
    console.log(movie);
    console.log(movie);
    movie = mongoose.Types.ObjectId(movie);
    if (user_email) {
        Wishlist.create([{user: user_email, movie: movie}], (err, data) => { 
            if (err) { 
                res.status(500).send(err)
            } else { 
                res.status(201).send(`new WishList: ${user} and ${movie}`)
            }
        })
    }
})

//remove from wishlist
app.post('/user/removeWishlist', (req, res) => { 
    let id = req.body.id;
    console.log("in remove wishlist");
    Wishlist.deleteOne({_id: id}, (err, data) => {
        if (err) { 
            // console.log(err);
            res.status(500).send(err);
        } else { 
            // console.log("deleted");
            res.status(201).send(`deleted wishlist ${id}`);
        }
    })
    // console.log("in remove wishlist");
    // console.log(id);
});

//get movies of user in wishlist
app.get('/user/wishlist', (req, res) => { 
    Wishlist.find({user: user_email}).populate("movie", null, "moviecontents").exec((err, data) => { 
        if (err) { 
            // console.log("error");
            // console.log(err);
            res.status(500).send(err);
        } else { 
            // console.log("printing data");
            // console.log(data);
            res.status(201).send(data);
        }
    })
})

// listening to port
app.listen(port, () => console.log(`Listening on port: ${port}`));