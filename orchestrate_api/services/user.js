
const mongoose = require('mongoose');

module.exports.getUser = async (reqbody) => {

    const User = mongoose.model('user');
    const foundUser = await User.findOne({ auth0ID: reqbody.user.sub });
    return foundUser;

}
