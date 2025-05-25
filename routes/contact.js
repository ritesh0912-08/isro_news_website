import express from 'express';
import Contact from '../models/contact.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        console.log('Received contact form:', { name, email, subject, message });
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'riteshshinde0912@gmail.com',
            subject: `New Contact: ${subject || 'No Subject'}`,
            text: `From: ${name} (${email})\n\n${message}`
        });
        
        res.status(200).json({ 
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;