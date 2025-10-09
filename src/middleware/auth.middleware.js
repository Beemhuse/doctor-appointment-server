import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const authenticate = (req, res, next) => {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ message: 'Missing Authorization header' });


const [type, token] = header.split(' ');
if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid Authorization format' });


try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { id: '<sanityDocId>', role: 'patient' }
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
};


export const authorizeRole = (role) => (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
next();
};