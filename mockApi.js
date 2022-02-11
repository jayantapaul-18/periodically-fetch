const express = require('express');
const router = express.Router();

function generateRandomID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
// This is Mock API inbuild on this server to tested out the functionality!
router.all('/some-api/access-token', function (req, res) {
    var time = new Date;
    res.status(200).json({
        access_token: "some jwt value which will come from real API "+generateRandomID(100),
        expires_in: 36000
    });
})


module.exports = router;
