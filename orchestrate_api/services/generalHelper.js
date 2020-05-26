
module.exports.generateRandomInteger = (max) => {
    return Math.floor(Math.random() * (max + 1));
}

module.exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}