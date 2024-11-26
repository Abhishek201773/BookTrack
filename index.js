import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import ejs from 'ejs';
import axios from 'axios';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Books",
    password: "Abhishek@1507" 
});
db.connect();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/up', async (req, res) => {
    let email = req.body.start; 
    let pass = req.body.end;
    try {
        await db.query("INSERT INTO signup (email, password) VALUES ($1, $2)", [email, pass]);
        res.render('index.ejs');
    } catch (error) {
        console.log(error);
        res.send("Error Occurred");
    }
});

app.post('/submit', async (req, res) => {
    try {
        const result = await db.query("SELECT email, password FROM signup WHERE email=$1 AND password=$2", [req.body.first, req.body.pass]);
        if (result.rows.length > 0) {
            res.render('home.ejs');
        } else {
            res.send("Invalid Credentials");
        }
    } catch (error) {
        console.log(error);
        res.send("Error Occurred");
    }
});
app.post('/addingBook',(req,res)=>{
    let isbn=req.body.isbn;
    let title=req.body.title;
    let author=req.body.author;
    let description=req.body.description;
    let rating=req.body.rating;
  try{
    db.query("INSERT INTO add (isbn,title,author,description,rating) VALUES($1,$2,$3,$4,$5)",[isbn,title,author,description,rating]);
  } 
  catch(error){
    console.log(error);
    res.send("Error Occurred");
  }
    res.render('home.ejs');
});


app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.get('/signin', (req, res) => {
    res.render('index.ejs');
});

app.get('/add',(req,res)=>{
    res.render('add.ejs');
});
app.get('/view', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM add");
        if (result.rows.length > 0) {
            res.render('view.ejs', { books: result.rows });
        } else {
            res.send("No books found in the database.");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("An error occurred.");
    }
});
