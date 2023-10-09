require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const path=require("path");
const expressEjsLayouts=require("express-ejs-layouts");
const initRoutes=require("./routes/web");
const mongoose=require("mongoose");
const session=require("express-session");
const flash=require("express-flash");
const MongoStore = require('connect-mongo');
const passport=require("passport");
const bodyParseer=require("body-parser");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const Emitter=require("events");

const app=express();
const server = createServer(app);
app.use(express.static("public"));
app.use(bodyParseer.urlencoded({extended:true}));
app.use(express.json());

mongoose.connect("mongodb://0.0.0.0:27017/pizzaDB");

// emitter config
const eventEmitter=new Emitter();
app.set("eventEmitter",eventEmitter);

// section config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({
         mongoUrl: "mongodb://0.0.0.0:27017/pizzaDB" ,
         collectionName:"sessions"
        }),
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24} //24 hour
}));

// passport config
const passportInit=require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


//flash setup
app.use(flash());

//ejs template setup
app.use(expressEjsLayouts);
app.set("views", path.join(__dirname, "/resources/views"));
app.set('view engine','ejs');

// global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next();
})


initRoutes(app);



server.listen(3000,function (req,res){
    console.log("server started successfully on port 3000.");
});




const io = new Server(server);
io.on('connection', (socket) => {
    // console.log('a user connected');

    // receive emitter from client side with the name join 
    socket.on("join",(roomName)=>{
        // create private room
        socket.join(roomName)
    })
});


eventEmitter.on("orderUpdated",(data)=>{
    io.to("order_"+data.id).emit("orderUpdated",data);
});

eventEmitter.on("orderPlaced",(data)=>{
    io.to("adminRoom").emit("orderPlaced",data);
})

