const mongoose = require("mongoose");
const config = require ("../config.json");

function connectAsync() {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            config.mongodb.URI,
            config.mongodb.options,
            (err, mongo) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(mongo);
            }
          );
      
    })
}

async function connectToDatabase(){
    try {
        const db = await connectAsync();
        console.log("We're connected to " + db.name + " database on MongoDB")
    }
    catch (err){
        console.error(err);
    }
}

connectToDatabase();