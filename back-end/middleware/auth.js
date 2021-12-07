const jwt = require("jsonwebtoken");
require("dotenv").config();

var secretKey = process.env.SECRET_KEY;
 

  
//Implémentation du token unique à chaque utilisateur.
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      req.userId = userId;
      next();
    }
    
  } catch(error) {
     res.status(401).json({ error });
  }
};

module.exports.secretKey = secretKey;