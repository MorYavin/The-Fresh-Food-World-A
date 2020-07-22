const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    totalOrderPrice: Number,
    cityForDelivery: String,
    streetForDelivery: String,
    dateOfDelivery:String,
    orderDate:String,
    creditCardDigits:String,
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });


    

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;