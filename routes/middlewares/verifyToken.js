const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  console.log(req.headers);
  var token = req.headers['x-access-token'] || req.headers['authorization'];
  console.log(token)
  if (!token) {
    return res.json({ status: 400, success: false, error: 'Unauthorized access' });
  }

  jwt.verify(token, 'damu', (err, decoded) => {
    if (err) {
      console.log('scene')
      return res.json({ status: 400, success: false, error: 'Unauthorized access' });
    }
    req.email = decoded.email;
    next();
  });
}

module.exports = verifyToken;
