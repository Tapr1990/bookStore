require("dotenv").config();


const mongoose = require("mongoose");
const express = require("express");


const app = express();


const booksHtmlRouter = require("./routes/booksHTML");


const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const loginRouter = require("./routes/login");


mongoose
.connect("mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME)
.then( () => console.log("MongoDB connected"))
.catch(err =>  console.error(err)); 


app.set("view engine", "ejs");


app.use(express.json());


app.get("/", (req, res) => res.render("home"));

app.use("/books", booksHtmlRouter)



app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/login", loginRouter);




app.listen(process.env.HTTP_PORT, () =>{
    console.log("listenning in port: " + process.env.HTTP_PORT);
});