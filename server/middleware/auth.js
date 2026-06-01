const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    res.status(401).json({
      message: "Invalid token"
    });
  }
};