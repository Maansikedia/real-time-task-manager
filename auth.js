const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Import your User model

const getUserFromToken = async (token) => {
  try {
    if (!token) {
      return null; // No token provided
    }

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret
    const userId = decodedToken.userId; // Extract user ID from the token

    // Fetch user from your database (e.g., MongoDB)
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    // Invalid token or other error
    return null;
  }
};
