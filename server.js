const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// MongoDB Connection (Optional - for storing messages)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('📦 Connected to MongoDB'))
        .catch(err => console.log('❌ MongoDB connection error:', err));
}

// Contact Message Schema (Optional)
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'new' }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail', // or your email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use App Password for Gmail
        }
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Portfolio Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Save to database (if MongoDB is connected)
        if (mongoose.connection.readyState === 1) {
            const contactMessage = new Contact({
                name,
                email,
                subject,
                message
            });
            await contactMessage.save();
            console.log('💾 Message saved to database');
        }

        // Send email
        const transporter = createTransporter();
        
        // Email to you (notification)
        const mailOptionsToYou = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Sent from your portfolio website at ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        // Auto-reply to sender
        const mailOptionsToSender = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">Thank You for Your Message!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Your Message:</h3>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <div style="background: white; padding: 15px; border-radius: 4px;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <p>Best regards,<br>Adnan Ali</p>
                    <p style="color: #6b7280; font-size: 14px;">
                        This is an automated response. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(mailOptionsToYou);
        await transporter.sendMail(mailOptionsToSender);

        console.log('📧 Emails sent successfully');

        res.json({
            success: true,
            message: 'Message sent successfully! Thank you for reaching out.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Get all contact messages (Optional - for admin panel)
app.get('/api/contacts', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database not connected'
            });
        }

        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:3000`);
    console.log(`🔧 Backend API: http://localhost:${PORT}/api`);
});