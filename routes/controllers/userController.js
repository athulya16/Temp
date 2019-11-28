const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../db/models/userData');
const verifyToken = require('../middlewares/verifyToken');
const smtpTransport = require('../../utils/mailer');
const handlebars = require('handlebars');
const readHTMLFile = require('../../utils/readFile');
module.exports = router;

router.get('/read', async (req, res) => {
    let email = req.query.email;
    let doc = await User.findOne({ email });
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
    return res.json({ result: doc });
});

router.post('/update', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({ email });

    user.password = password;
    let doc = await user.save();
    return res.json({ result: doc });
});

router.post('/delete', async (req, res) => {
    let email = req.body.email;
    let user = await User.remove({ email });
    return res.json({ result: user });
});

router.post('/register', async (req, res) => {
    try {
        let { email, password, user_name } = req.body;

        if (!email || !password || !user_name) {
            return res.json({ status: 400, message: "Please enter all the required fields" });
        }
        var emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.json({ status: 400, message: "Email already registered" });
        }

        var userExist = await User.findOne({ user_name });
        if (userExist) {
            return res.json({ status: 400, message: "Username already registered" });
        }

        var genSalt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, genSalt);

        let user = new User({
            email,
            password: hash,
            user_name,
        });

        let doc = await user.save();
        if (doc._id) {

            var token = jwt.sign({ email: user.email }, "damu", { expiresIn: 300 });
            var redirectUrl = 'http://localhost:3000/api/user/register' + '/' + token;

            readHTMLFile(__dirname + '/../../templates/signUp.html', (err, html) => {
                if (err) {
                    return res.json({ status: 200, success: false, error: true, message: 'template fetch error' });
                }

                var template = handlebars.compile(html);
                var replacements = {
                    username: doc.user_name,
                    redirectUrl: redirectUrl,
                };
                var htmlToSend = template(replacements);
                var data = {
                    to: doc.email,
                    from: 'support@nextazy.com',
                    subject: 'Confirm your registration!',
                    html: htmlToSend,
                };

                smtpTransport.sendMail(data, function(err) {
                    if (!err) {
                        return res.json({ status: 200, success: true, error: false, message: 'Registered Successfully Verification mail has been sent to your email.' });
                    } else {
                        return res.json({ status: 200, success: false, error: true, message: 'Verification mail not sent. Please try again' + err });
                    }
                });

            });

        } else {
            return res.json({ status: 400, message: "registeration failed" });
        }
    } catch (err) {
        return res.json({ status: 400, message: "something went wrong!Please try again later" });
    }

});

router.post('/login', async (req, res) => {
    try {

        let { email, password } = req.body;

        if (!email || !password) {
            return res.json({ status: 400, message: "Please enter all the required fields" });
        }

        var emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.json({ status: 400, message: "Please Register" });
        }
        if (!emailCheck.verified) {
            return res.json({ status: 400, message: "Please Verify" });
        }
        var hash = emailCheck.password;
        let passwordCheck = await bcrypt.compareSync(password, hash);
        if (!passwordCheck) {
            return res.json({ status: 400, message: "Invalid credentials" });
        } else {
            var token = jwt.sign({ email: emailCheck.email }, "damu", { expiresIn: 86400 });
            return res.json({ status: 200, message: "loggedin successfully", result: emailCheck.user_name, token: token });
        }
    } catch (err) {
        return res.json({ status: 400, message: "something went wrong!Please try again later " + err });
    }
});

router.post('/updatePassword', verifyToken, async (req, res) => {
    try {

        let email = req.email;
        let { newPassword } = req.body;

        if (!newPassword) {
            return res.json({ status: 400, message: "Please enter all the required fields" });
        }

        var emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.json({ status: 400, message: "Please Register" });
        }
        var oldPassword = emailCheck.password;
        //update Password

        let passwordCheck = await bcrypt.compareSync(newPassword, oldPassword);
        if (passwordCheck) {
            return res.json({ status: 400, message: "Please enter diffrent password" });
        } else {
            var genSalt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(newPassword, genSalt);

            emailCheck.password = hash;
            var result = await emailCheck.save();
            return res.json({ status: 200, message: "password changed successfully", result: result });

        }

    } catch (err) {
        return res.json({ status: 400, message: "something went wrong!Please try again later " + err });
    }
});

router.post('/verify', verifyToken, async (req, res) => {
    try {
        var email = req.email;
        var user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: 400, message: "email not found" });
        }
        user.verified = true;
        var result = await user.save();
        return res.json({ status: 200, message: "email Verified" });
    } catch (err) {
        return res.json({ status: 400, message: "email not Verified" + err });

    }
});