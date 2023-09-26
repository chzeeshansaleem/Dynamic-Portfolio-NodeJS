import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
const verifyToken1 = (token) => {
  try {
    // verify the token
    const decoded = jwt.verify(token, secretKey);
    return decoded; // returns the decoded token  with username  and role
  } catch (error) {
    // token verification failed
    console.error("Token verification failed:", error);
    return null; // return null
  }
};

export { verifyToken1 };
