require ("./data-access-layer/dal");
const express = require ("express");
const config = require ("./config.json");

const fileUpload = require ("express-fileupload");
const cors = require ("cors");
const productsController=require ("./controllers/products-controller");
const adminController=require ("./controllers/admin-controller");
const authController = require ("./controllers/auth-controller");
const ordersController = require ("./controllers/orders-controller");
const shoppingCartController = require("./controllers/shoppingCart-controller");
const server = express();
const expressSession = require("express-session"); 
const PORT = process.env.PORT || config.port;
const path = require("path");
server.use(cors());
server.use(fileUpload());
server.use(express.json());
server.use(express.static(__dirname));

server.use(cors({origin:"http://localhost:4200",credentials:true}));
server.use(expressSession({ name: "authenticationCookie", secret: "I-Love-Fresh-Food", resave: true, saveUninitialized: false }));
server.use("/api/products",productsController)
server.use("/api/admin",adminController)
server.use("/api/auth",authController)
server.use("/api/orders",ordersController)
server.use("/api/cart",shoppingCartController)


if (process.env.NODE_ENV === "production") {
  
    server.use(express.static("public/client"));
  
    server.get("*", (request, response) => {
      response.sendFile(path.join(__dirname, "public/client", "index.html"));
    });
  }
  


const app = server.listen(PORT, () => {
    const port = app.address().port;
    console.log("Express is working on port " + port);
  });