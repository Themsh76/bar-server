// npm install express
const express = require("express");

// npm install prisma --save-dev

// npx prisma init --datasource-provider sqlite

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Server automatisch neu starten lassen:
// npm install -g nodemon
// Zum Starten: nodemon server.js

// Oder wer smart ist node --watch server.js -> braucht man keinen nodemon

// npm install cors
const cors = require("cors")

// npm install multer
const multer = require("multer")

// Accessing the filesystem
const path = require("path")
const fs = require("fs")

// Wird für das Passwort hashing benutzt
// npm install bcrypt
const bcrypt = require("bcrypt")

// npm install body-parser
// Macht antwort von server into json
const bodyParser = require("body-parser");


// Wird genutzt im sichere Token zu erstellen
// npm install jsonwebtoken
//const jwt = require("jsonwebtoken")


const port = 3000;
const JWT_SECRET = 'my-secure-token' // Muss ausgetauscht werden für Produktiveinsatz
let app = express();

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/uploads', express.static("uploads"))

const upload = multer({
    dest: "uploads/",
    // Hier können Dinge wie akzeptiere Dateiformate eigestellt werden
})


app.post("/register", async function (req,res){

    try{

    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);


    await prisma.user.create({
        data:{
        name: name,
        email: email,
        password: hashedPassword
        }
    })

    res.send("User created")

} catch(error) {
    console.log(error)
    res.status(500).send("User could not be created")
}
    // Hier wird die Session erzeugt und an den Client geschickt
})

app.post("/login", async function (req,res){

    try{

    const {email, password} = req.body;

    const userRecord = await prisma.user.findUnique({
        where:{
                email: email         
        }
    })

    if(!userRecord){
        return res.status(404).send("User not found")
    }
    const passwordMatch = await bcrypt.compare(password, userRecord.password)
   
    if(!passwordMatch){
        return res.status(401).send("Password does not match")
    }

    return res.send("Login succesful, your name: " + userRecord.name)

} catch(error) {
    console.log(error)
    res.status(500).send("Fehler")
}
    // Hier wird die Session erzeugt und an den Client geschickt
})


app.get("/", function(req, res){
    res.sendFile("index.html")
})

app.post("/menu/drink/:id/upload", upload.single("image"),  function (req,res){
    console.log(req.file);
    const tempPath = req.file.path;
    const id = parseInt(req.params["id"]);
    // Baue den Zielpfad
    // Nimm den akutellen Pfad von server.js
    // Füge den Ordner uploads hinzu und den Dateinamen
    const targetPath = path.join(__dirname, "uploads/" + req.file.originalname);
    fs.rename(tempPath, targetPath, async err => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        // Speichere den Pfad des Bildes in die Datenbank

        const result = await prisma.drink.update({
            where: {
                id: id
            },
            data: {
                bildpfad: "uploads/" + req.file.originalname
            }
        })

        res.send("File uploaded")
    }) 
});


app.post("/menu/drink", async function(req,res) {
    const drink = req.body;
    const result = await prisma.drink.create({
      data: drink

    })

    res.send(result)   
})

app.post("/menu/food", async function(req,res) {
    const food = req.body;
    const result = await prisma.food.create({
      data: food

    })

    res.send(result)   
})


app.get("/menu/drink", async function (req,res) {
    const drinks = await prisma.drink.findMany()
    //const foods = await prisma.food.findMany()
    res.json(drinks)//,food)
})

app.get("/menu/food", async function (req,res) {
    const foods = await prisma.food.findMany()
    res.json(foods)
})


app.get("/menu/drink/:id", async function (req,res) {

    try{
        const id = req.params["id"]
        const drink = await prisma.drink.findUniqueOrThrow({
        where: {
            id: parseInt(id)
        }
    })
    res.json(drink)
    }

    catch(error){
        res.status(404).json({error: "Drink not found"})
    }
    
})

app.get("/menu/food/:id", async function (req,res) {

    try{
        const id = req.params["id"]
        const food = await prisma.food.findUniqueOrThrow({
        where: {
            id: parseInt(id)
        }
    })
    res.json(food)
    }

    catch(error){
        res.status(404).json({error: "Food not found"})
    }
    
})

app.delete("/menu/drink/:id", async function (req,res) {
    const id = req.params["id"]
    try{
        const result = await prisma.drink.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.json(result)
    }
    
    catch(error){
        res.status(404).json({error: "Drink not found"})
    }

})


app.delete("/menu/food/:id", async function (req,res) {
    const id = req.params["id"]
    try{
        const result = await prisma.food.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.json(result)
    }
    
    catch(error){
        res.status(404).json({error: "Food not found"})
    }

})



app.patch("/menu/drink/:id", async function (req,res) {
    const id = req.params["id"]
    try{
        const drink = req.body
        const result = await prisma.drink.update({
        where: {
            id: parseInt(id)
        },
        data: drink
    })
    res.json(result)
    }
    catch(error){
        res.status(404).json({error: "Drink not found"})
    }
})


app.patch("/menu/food/:id", async function (req,res) {
    const id = req.params["id"]
    try{
        const food = req.body
        const result = await prisma.food.update({
        where: {
            id: parseInt(id)
        },
        data: food
    })
    res.json(result)
    }
    catch(error){
        res.status(404).json({error: "Food not found"})
    }
})




/*
Wichtig in einer Order, darf ein Drink nicht doppelt vorkommen

{
    "drinks": [
        {"drinkId": 2, "quantity": 2},
        {"drinkId": 3, "quantity": 4}
    ]
}


*/



app.post("/order", async function(req, res) {
    let order = req.body
    try{
        const result = await prisma.order.create({
            data: {
                drinks: {   // drinks = OrderDrinks
                    // Eintrag in Zwischentabelle OrderDrink erstellen
                    // Gehe jeden Eintrag in dem empfangenen JSON durch
                    create: order.drinks.map(row =>({
                        // Verknüpfe die drinkId mit dem neu erstellten OrderDrink Element
                        drink: {
                            connect: {
                                id: row.drinkID
                            }
                        },
                        // Setze die Quantity von OrderDrink
                        quantity: row.quantity
                    })

                    )
                },

                foods: { 
                    create: order.foods.map(row =>({
                        food: {
                            connect: {
                                id: row.foodID
                            }
                        },
                        quantity: row.quantity,
                        notes: row.notes
                    })

                    )
                }
            }

        })
        res.json(result)
    }

    catch(error){
        console.log(error)
        res.status(500).json({error: "Could not create order"})
    }
    
})


app.get("/order", async function (req, res) {
    const orders = await prisma.order.findMany({
        include: {
            // Inkludiere die Zwischentabelle
            drinks: {   // drinks = OrderDrinks
                include: {
                    // Inkludiere den Drink in der Zwischentabelle
                    drink: true
                }
            },

            foods: {
                include: {
                    food: true
                }
            }
        }
    })
    res.json(orders)
})


app.get("/order/:id", async function (req,res) {
    const orderId = parseInt(req.params["id"])
    try{
        const order = await prisma.order.findUniqueOrThrow({
            
            where: {id: orderId},
            include: { 
                // Inkludiere die Zwischentabelle
                drinks: {   // drinks = OrderDrinks
                    include: {
                        // Inkludiere den Drink in der Zwischentabelle
                        drink: true
                    }
                },

                foods: {
                    include: {
                        food: true
                    }
                }
            }

    })
    res.json(order)
    }
    
    catch(error){
        res.status(404).json({error: "Order not found"})
    }

})


    app.delete("/order/:id", async function (req,res) {
        const id = parseInt(req.params["id"])

        try{
            const result = await prisma.order.delete({
                where: {id: id}

            })
            res.json(result);
        }
        catch(error){
            res.status(404).json({"error": "Order not found"})
        }
    })




    app.patch("/order/:id", async function (req,res){
        let id = req.params["id"]
        let updatedOrder = req.body

        try{
            await prisma.orderDrink.deleteMany({
                where: {
                    orderID: parseInt(id)
                }
            })

            await prisma.orderFood.deleteMany({
                where: {
                    orderID: parseInt(id)
                }
            })
            

            const result = await prisma.order.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    drinks: {
                        create: updatedOrder.drinks.map(row =>({
                            drink: {
                                connect: {
                                    id: row.drinkID
                                }
                            },
                            quantity: row.quantity

                        }))
                        
                    },

                    foods: {
                        create: updatedOrder.foods.map(row =>({
                            food: {
                                connect: {
                                    id: row.foodID
                                },
                                
                            },
                            quantity: row.quantity,
                            notes: row.notes
    
                        }))
                        
                    }

                }

            })
            res.json(result)
        } 
        catch(error){
            console.log(error)
            res.status(404).json
        }
    })










app.listen(port, function(){
    console.log("Server started");
})