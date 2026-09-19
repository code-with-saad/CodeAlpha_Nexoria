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
    // If SMTP credentials exist in .env, use them; otherwise use ethereal / test transporter
    let transporter;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'support@nexoriastore.com';

    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      // Create ephemeral test account or jsonTransport in development
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }

    const mailOptions = {
      from: `"Nexoria Contact" <${smtpUser || 'no-reply@nexoriastore.com'}>`,
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
