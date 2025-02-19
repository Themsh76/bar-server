// npm install express
const express = require("express");

// npm install mariadb

const mariadb = require("mariadb");


// Server automatisch neu starten lassen:
// npm i -g nodemon
// Zum Starten: nodemon server.js

let swear = ["Bimbo ", "Vegetable", "Butterhexe", "Bitch", "Rotzlöffel ", "Saupreiß ", "Satansbraten "] 
const port = 3000;

let app = express();


// Konvertiere Daten an den Server zu Text
//app.use(express.text())

// Konvertiere Daten an den Server zu JSON
app.use(express.json())

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "menu",
    connectionLimit: 5
})

/*
pool.query("Select * from drinks;")
.then(result =>
{
    console.log(result);
})
*/

app.get("/menu", function(req,res){

    pool.query("Select * from drinks;")
    .then(result =>
    {
        res.json(result)
    })
})


app.get("/menu/:id", function(req,res){

    let id = req.params["id"]

    pool.query("Select * from drinks where Id = "+ id)
    .then(result =>
    {
        res.json(result)
    })
})





function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }  

app.get("/", function(req, res){
    res.send("Hello World!");
});

// Aufgabe: Schreibe zwei GET Routen
// Eine mit dem Pfad greeting, die eine Begrüßung zurück liefert 
// Eine mit dem Pfad swear, die eine zufällige Beleidigung liefert

app.get("/greeting", function(req,res){
    res.send("Servus mein weißer Freund!");
})

app.get("/swear", function(req, res){
    let random = getRandomInt(7)
    res.send(swear[random])
})

// Aufgabe 2: Schreibe eine weitere GET Route swear, die deine 
// Lieblingsbeleidugung liefert

app.get("/swear/favourites", function(req,res){
    res.send("Bimbo")
}) 




app.post("/", function(req, res){
    console.log(req.body)
    // res.send("Add World")
    res.send(req.body)
})


app.post("/swear", function(req, res){

    const swear = req.body
    let answer = "";
    
    for(let i = 0; i < 10; i++){
        answer += "Du " + swear + "\n"
    }
    res.send(answer);

})



// Definiere die Klasse Drinks

class Drink {
    name
    ml
    price
    alcohol

    constructor(name, ml, price, alcohol){
        this.name = name
        this.ml = ml
        this.price = price
        this.alcohol = alcohol
    }
}

// Erstelle ein Menü mit vorgefertigten Drinks
// Aufgabe: Erstelle drei Getränke

let menu = [new Drink("Water", 500, 20, 0),
    new Drink("Wake-up Drink", 500, 5, 60), 
    new Drink("Sleep Drink", 2000, 10, 80 )
]

// Erstelle eine GET Route /menu
// Die das ganze Menü als JSOn zurück liefert
// Tipp: Mit res.json() kann ein JSON zurück geliefert werden

/*
app.get("/menu", function(req, res){
    res.json(menu)
})
*/

/*app.get("/menu/:id", function(req,res){

    // Hole die Wildcard aus dem request
    let id = req.params["id"]

    // Aufgabe: Liefere das gesuchte Element als JSON zurück
    res.json(menu[id])
   
})

*/


// Aufgabe: GET Route, die nach Namen sucht
// localhost:3000/water

// In req.query enthalten:
// localhost:3000/menu?name=Water

app.get("/menu", function(req,res){

    /*
    let placeholder = req.params ["placeholder"]  

    for(let i = 0; i < menu.length; i++){
        
        if(menu[i].name == placeholder){

            res.json(menu[i])
        }
    }
    */

    if(req.query["name"]){
        let name = req.query["name"]
        res.json(menu.find((item) => item.name === name))
    }
    else{
        res.json(menu);
    }     
})


// In Headers setzen: Content-Type application/json

app.post("/menu", function(req, res){
    let newdrink = req.body
    console.log(newdrink)
    menu.push(newdrink)
    res.send("Hinzugefügt")
})


app.delete("/menu", function(req,res){

   /* if(req.query["name"]){
        let name = req.query["name"]
        drinkid = menu.indexOf(name)
        menu.splice(drinkid, 1)

        res.send("Delete worked")
    }
    else{
        res.json(menu);
    }     

    */

    if(req.query["name"]){
        let name = req.query["name"]
        res.json(menu = menu.filter((item) => item.name !== name))
    }
    else{
        res.json(menu);
    }     
})


app.patch("/menu/:id", function (req,res){

    let id = req.params["id"]
    let patchobject = req.body
    console.log(patchobject)
    menu[id] = patchobject
    res.send("Objekt geändert")

})


class Food {
    name
    calories
    price

    constructor(name, calories, price){
        this.name = name
        this.calories = calories
        this.price = price
    }
}

let food_menu = [new Food("Chicken", 500, 20),
    new Food("Beef", 750, 10), 
    new Food("Lamb", 250, 25)
]

app.get("/food_menu/:id", function(req,res){

    let id = req.params["id"]
    res.json(food_menu[id]) 
})

app.get("/food_menu", function(req,res){

    res.json(food_menu)
})

app.post("/food_menu", function(req, res){
    let newfood = req.body
    console.log(newfood)
    food_menu.push(newfood)
    res.send("Hinzugefügt")
})

app.delete("/food_menu", function(req,res){

     if(req.query["name"]){
         let name = req.query["name"]
         res.json(food_menu = food_menu.filter((item) => item.name !== name))
     }
     else{
         res.json(food_menu);
     }     
 })

 app.patch("/food_menu/:id", function (req,res){

    let id = req.params["id"]
    let patchobject = req.body
    console.log(patchobject)
    food_menu[id] = patchobject
    res.send("Objekt geändert")

})

app.listen(port, function(){
    console.log("Server started");
})