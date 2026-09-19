import nodemailer from 'nodemailer';

// @desc    Send contact form message via nodemailer
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please provide name, email, and message');
    }

    // Configure transporter
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpFrom = process.env.SMTP_FROM?.trim() || `"Nexoria Support" <${smtpUser || 'no-reply@nexoriastore.com'}>`;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim() || smtpUser || 'support@nexoriastore.com';

    let transporter;

    if (smtpUser && smtpPass) {
      if (smtpHost) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });
      } else if (smtpUser.includes('@gmail.com')) {
        // Automatically configure Gmail service if host is omitted
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });
      } else {
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });
      }
    } else {
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }

    const mailOptions = {
      from: smtpFrom,
      replyTo: `"${name}" <${email}>`,
      to: recipientEmail,
      subject: `[Nexoria Contact] ${subject || 'New Customer Inquiry from ' + name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669; margin-top: 0;">New Contact Form Message</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Message Content:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 6px; color: #334155;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">This message was submitted via the Nexoria E-Commerce contact form.</p>
        </div>
      `,
      text: `New Contact Form Message from ${name} (${email})\nSubject: ${subject || 'General Inquiry'}\n\nMessage:\n${message}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Contact email handled:', info.messageId || 'Delivered via transport');

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent to our support team.'
    });
  } catch (error) {
    next(error);
  }
};
