const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    customerId:String,
    password:String,
    cityOfResidence:String,
    streetOfResidence:String,
    role:String,
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

    UserSchema.virtual("shoppingCarts", {
        ref: "Cart",
        localField: "_id",
        foreignField: "customerId"
    });
    

const Customer = mongoose.model("Customer", UserSchema, "customers");

module.exports = Customer;