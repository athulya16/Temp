const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.json({ status: 400, success: false, error: 'Unauthorized access' });
  }

  jwt.verify(token, 'damu', (err, decoded) => {
    if (err) {
      return res.json({ status: 400, success: false, error: 'Unauthorized access' });
    }
    req.email = decoded.email;
    next();
  });
}

module.exports = verifyToken;
