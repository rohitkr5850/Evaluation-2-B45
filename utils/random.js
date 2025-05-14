const crypto = require('crypto');

function getRandomDuration(){
    return crypto.randomInt(1,7);
}
module.exports = {getRandomDuration};