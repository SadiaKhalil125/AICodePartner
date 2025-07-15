import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import Blog from './Blog';
import Login from './Login';
import Signup from './signup';
import Dashboard from './Dashboard';
import Home from './Home';
import QuestionSolve from './questionsolve';
import SubmissionsList from './SubmissionsList';
import Footer from './Footer'
function App() {
  return (
    <BrowserRouter>
      <div className="bg-amber-400">Hello</div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questionsolve" element={<QuestionSolve />} />
        <Route path="/submissionslist" element={<SubmissionsList />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
