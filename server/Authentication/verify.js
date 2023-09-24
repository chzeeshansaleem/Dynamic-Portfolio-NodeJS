import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(decoded);
        return;
      }
    });
  });
}
