import { Link } from 'react-router-dom';

function Header() {
  const styles = {
    header: {
      backgroundColor: "#281C2D",
      padding: '15px 30px',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(58,57,99,0.18)',
      fontFamily: "'poppins', sans-serif" // Improved font family
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
      fontSize: '24px',
      textDecoration: 'none'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      marginRight: '10px',
    },
    logoText: {
      fontWeight: 700,
      letterSpacing: '1px',
    },
    navList: {
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      margin: 0,
      padding: 0,
      flexWrap: 'wrap'
    },
    navItem: {
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
      fontWeight: 600,
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px rgba(102,126,234,0.08)',
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const CodeLogo = () => (
    <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8L3 12L7 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Link to="/" style={styles.logoContainer}>
          <CodeLogo />
          <span style={styles.logoText}>AICodePartner</span>
        </Link>
        <nav>
          <ul style={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} style={styles.navItem}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;