import { useState } from 'react';
import User from './models/user';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login: setAuthUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const newUser = new User(formData.name, formData.email, formData.password);
    try {
      const res = await axios.post('http://127.0.0.1:8000/validate-user', {
        id: null,
        username: newUser.name,
        email: newUser.email,
        password: newUser.password
      });
      setSuccess('User logged in successfully!');

      setAuthUser({ username: newUser.name, email: newUser.email, id: res.data.user_id });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  const styles = {
    page: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: "'poppins' , sans-serif"
    },
    container: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    header: {
      fontSize: '1.75rem',
      fontWeight:'bold',
      marginBottom: '0.5rem',
      color: '#1c1e21',
    },
    subHeader: {
      fontSize: '1rem',
      color: '#606770',
      marginBottom: '2rem',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      margin: '0.5rem 0',
      borderRadius: '6px',
      border: '1px solid #dddfe2',
      fontSize: '1rem',
      backgroundColor: '#f5f6f7',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#281C2D',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    error: {
      color: '#f02849',
      marginTop: '1rem',
    },
    success: {
      color: '#28a745',
      marginTop: '1rem',
    },
    mess:{
      marginTop:'10px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>Welcome Back</h2>
        <p style={styles.subHeader}>Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
        </form>
        <div style = {styles.mess} >Don't have an account? <a href="/signup">Signup</a></div>
      </div>
    </div>
  );
}

export default Login;