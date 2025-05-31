const express = require('express');
const Contact = require('../models/contact.js');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create transporter only if email credentials are available
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        console.log('Received contact form:', { name, email, subject, message });
        
        // Save to database first
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });
        
        await contact.save();
        console.log('Contact message saved to database');
        
        // Try to send email if transporter is configured
        if (transporter) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: 'riteshshinde0912@gmail.com',
                    subject: `New Contact: ${subject || 'No Subject'}`,
                    text: `From: ${name} (${email})\n\n${message}`
                });
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Don't fail the request if email fails
            }
        } else {
            console.log('Email not configured, skipping email send');
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router;