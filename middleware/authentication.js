const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. Token missing"
      });
    }

    // token format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    // attach user data to request
    req.userId = decoded.id;
    req.email = decoded.email;
    req.role = decoded.role;
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

};