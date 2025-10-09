import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { client } from '../sanityClient.js';
import dotenv from 'dotenv';
import { client } from '../client.js';
dotenv.config();


// Create a user in Sanity with type "user"
export const signup = async (req, res) => {
    try {
        const { name, email, password, role = 'patient' } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });


        // Check if user exists
        const existing = await client.fetch('*[_type == "user" && email == $email][0]', { email });
        if (existing) return res.status(409).json({ message: 'User already exists' });


        const hashed = await bcrypt.hash(password, 10);


        const doc = {
            _type: 'user',
            name,
            email,
            password: hashed,
            role
        };


        const created = await client.create(doc);


        const token = jwt.sign({ id: created._id, role: created.role }, process.env.JWT_SECRET, { expiresIn: '7d' });


        res.status(201).json({ token, user: { id: created._id, name: created.name, email: created.email, role: created.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });


        const user = await client.fetch('*[_type == "user" && email == $email][0]', { email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });


        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};