const Schema = require("../../../../mongodb.conf");
const mongoose = require("mongoose");

const rolesSchema = new Schema({
    roleName: String,
    roleDesc: String,
    permissions: Array,
})
module.exports = mongoose.model('role',rolesSchema);
