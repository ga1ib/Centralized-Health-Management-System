from flask_mail import Mail
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import ssl

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def send_otp_email(to_email, otp):
    try:
        # Get credentials from environment
        smtp_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('MAIL_PORT', 587))
        smtp_username = os.getenv('MAIL_USERNAME')
        smtp_password = os.getenv('MAIL_PASSWORD')

        logger.debug(f"Attempting to send email using: {smtp_username} via {smtp_server}:{smtp_port}")

        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Your HMS Authentication Code'
        msg['From'] = smtp_username
        msg['To'] = to_email

        # Create HTML content
        html = f"""
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #2c3e50; text-align: center;">Your Authentication Code</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h1 style="color: #2c3e50; font-size: 32px; letter-spacing: 5px;">{otp}</h1>
              </div>
              <p style="color: #666;">This code will expire in 10 minutes.</p>
              <p style="color: #666;">If you did not request this code, please ignore this email.</p>
            </div>
          </body>
        </html>
        """

        text_part = MIMEText("Your authentication code is: " + str(otp), 'plain')
        html_part = MIMEText(html, 'html')

        msg.attach(text_part)
        msg.attach(html_part)

        # Create SMTP connection with explicit SSL/TLS handling
        logger.debug("Creating SMTP connection...")
        
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.set_debuglevel(1)  # Enable SMTP debug
            server.starttls(context=context)
            
            logger.debug("Attempting SMTP login...")
            server.login(smtp_username, smtp_password)
            
            logger.debug(f"Sending email to {to_email}")
            server.send_message(msg)
            logger.debug("Email sent successfully!")
            return True

    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {str(e)}")
        raise Exception("Email authentication failed. Please check Gmail credentials.")
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred: {str(e)}")
        raise Exception(f"Failed to send email: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        raise Exception(f"Failed to send email: {str(e)}")
