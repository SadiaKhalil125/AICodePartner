import './Footer.css';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <Link to="/" className="footer-logo">
            <Code size={30} />
            <span className="logo-text">AI Code Partner</span>
          </Link>
          <p className="about-text">
            Crafting the future of the web with innovative and user-centric digital solutions.
          </p>
        </div>

        <div className="footer-section links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h4 className="footer-heading">Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h4 className="footer-heading">Stay Connected</h4>
          <div className="social-icons">
            <a href="#" aria-label="GitHub" className="social-icon"><Github size={24} /></a>
            <a href="#" aria-label="Twitter" className="social-icon"><Twitter size={24} /></a>
            <a href="#" aria-label="LinkedIn" className="social-icon"><Linkedin size={24} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DevSite. All Rights Reserved.</p>
      </div>
    </footer>
  );
}