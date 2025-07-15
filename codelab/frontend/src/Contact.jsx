import '../src/Contact.css';
import { Mail, Phone, MapPin } from 'lucide-react'; // A popular icon library

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1 className="contact-heading">Get in Touch</h1>
        <p className="contact-intro">
          Have a question, a project idea, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-content-wrapper">
        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="How can we help you?" required />
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>

        <div className="contact-info-container">
          <h3 className="info-heading">Contact Information</h3>
          <p className="info-text">
            Reach out to us directly through any of the channels below.
          </p>
          <ul className="info-list">
            <li>
              <Mail size={20} />
              <a href="mailto:contact@devsite.com">contact@devsite.com</a>
            </li>
            <li>
              <Phone size={20} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <MapPin size={20} />
              <span>123 Code Lane, Tech City, 90210</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}