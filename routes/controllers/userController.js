var express = require('express');
var router = express.Router();
var User = require('../../db/models/userData');
module.exports = router;

router.get('/read',async (req, res) => {
    let email = req.query.email;
    let doc = await User.findOne({email});
    return res.json({ result: doc })
});

router.post('/create', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user_name = req.body.user_name
    var user = new User({
        email,
        password,
        user_name,
    });

    let doc = await user.save();
    /*user.save().then(doc=>{
        console.log("successfull, ",doc);
    })*/
    console.log(doc);
    return res.json({ result: doc });

})