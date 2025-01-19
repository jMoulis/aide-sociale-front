import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

const generateToken = () => {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretKey);
};

export default generateToken;