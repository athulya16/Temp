const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../db/models/userData');
const verifyToken = require('../middlewares/verifyToken');
const smtpTransport = require('../../utils/mailer');
const handlebars = require('handlebars');
const readHTMLFile = require('../../utils/readFile');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
module.exports = router;


router.get('/getg2f', verifyToken, async (req, res) => {
    try {
        var secret = speakeasy.generateSecret({ length: 20 });
        qrcode.toDataURL(secret.otpauth_url, async function(err, image_data) {
            if (err) {
                return res.json({ status: 400, message: 'Something went wrong, Try again later !', error: err.message });
            }
            const body = {
                secret: secret.base32,
                img: image_data,
            };
            var email = req.email;

            let user = await User.findOne({ email });
            user.tfa_temp = secret.base32;

            var doc = await user.save();
            console.log(body);
            if (doc) {
                return res.json({ status: 200, message: 'image url received!', result: body });
            }
            else
            {
            	return res.json({ status: 400, message: 'image url not received!', result: body });
            }
        });
    } catch (err) {
        return res.json({ status: 400, message: 'Something went wrong, Try again later !' + err })
    }
});

router.post('/enable', verifyToken, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.email });
        if (user.tfa_active) {
            return res.json({ status: 400, message: 'Google Two Factor already enabled' });
        }
        var userToken = req.body.otp;
        var secret = user.tfa_temp;
        var verified = speakeasy.totp.verify({ secret: secret, encoding: 'base32', token: userToken });

        if (verified) {
            user.tfa = user.tfa_temp;
            user.tfa_temp = null;
            user.tfa_active = true;

            let doc = await user.save();
            if(doc)
            {
            	return res.json({ status: 200, message: 'Google Two Factor enabled!' });
            }
            else
            {
            	return res.json({ status: 400, message: 'Google Two Factor  not enabled! Cant save to db'});
            }
            
        } else {
            return res.json({ status: 400, message: 'Invalid OTP' });
        }
    } catch (err) {
        return res.json({ status: 400, message: 'Something went wrong, Try again later !' + err })
    }
});

router.post('/verifyg2fa', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user.tfa_active) {
            return res.json({ status: 400, message: 'Enable Google Two Factor' });
        }

        var userToken = req.body.otp;
        var secret = user.tfa;
        var verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: userToken,
        });

        if (verified === true) {
            return res.json({ status: 200, message: 'Otp verified!' });
        } else {
            return res.json({ status: 400, error: true, message: 'Otp is incorrect' });
        }

    } catch (err) {
        return res.json({ status: 400, message: 'Something went wrong, Try again later !' + err });
    }
});

router.post('/disable', verifyToken, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.email })
        if (!user.tfa_active) {
            return res.json({ status: 400, message: 'Enable Google Two Factor already diabled' });
        }
        user.tfa = null;
        user.tfa_temp = null;
        user.tfa_active = false;

        let doc = await user.save()
        if (doc) {
            return res.json({ status: 200, message: 'Google Two Factor Disabled Successfully', result: null });
        } else {
            return res.json({ status: 400, message: 'Google Two Factor disable failed !' });
        }

    } catch (err) {
        return res.json({ status: 400, message: 'Something went wrong, Try again later !', error: err.message, });
    }
});