import '../src/About.css';

function About() {
  return (
    <div className="about-page-container">
      <div className="about-container">
        <h1 className="about-heading">About Our Company</h1>
        <p className="about-intro">
          Welcome to our digital home! We are a team of passionate developers, designers, and strategists dedicated to building high-quality, modern web experiences. We thrive on turning complex problems into beautiful, intuitive, and effective solutions.
        </p>

        <div className="about-section">
          <h2 className="about-subheading">Our Mission</h2>
          <p>
            Our mission is to empower businesses and individuals by creating innovative digital products that are not only visually appealing but also scalable, secure, and user-friendly. We believe that great software can make a significant impact, and we are committed to delivering excellence in every project we undertake.
          </p>
        </div>

        <div className="about-section">
          <h2 className="about-subheading">Our Vision</h2>
          <p>
            We envision a world where technology seamlessly integrates with everyday life, making it simpler and more efficient. Our goal is to be at the forefront of this change, constantly exploring new technologies and methodologies to build the solutions of tomorrow.
          </p>
        </div>

        <div className="about-mission-highlight">
          <p>
            "Creating the future of the web, one line of code at a time."
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;