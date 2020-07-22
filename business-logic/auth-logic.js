const User = require('../models/user-model');
const cryptography = require('../helpers/crypto');


function doesEmailExist(emailAddress) {
    return User.find({ emailAddress });
}

function doesUserIdExist(customerId) {
    return User.find({ customerId }).exec();
}


function login(credentials) {
    credentials.password = cryptography.hash(credentials.password);
    return User.find({ emailAddress: credentials.email, password: credentials.password }).populate({path:'shoppingCarts',model:"Cart",populate: {path:"itemsInCart",model:"ItemInCart"}}).exec();
}

function addUser(user) {
    user.password = cryptography.hash(user.password);
    return user.save();
}

module.exports = {
    doesEmailExist,
    doesUserIdExist,
    login,
    addUser
}