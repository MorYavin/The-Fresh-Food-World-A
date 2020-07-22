const crypto = require("crypto");
const secret = "AsFreshAsItGets";

function hash(password) {
    return crypto.createHmac("sha512", secret).update(password).digest("hex");
}

module.exports = { hash }