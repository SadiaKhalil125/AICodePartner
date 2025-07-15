import '../src/Services.css';
import services from './models/services';
import * as Icons from 'lucide-react'; // Import all icons

// A helper component to dynamically render the correct icon
const DynamicIcon = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Return a default icon if the specified one doesn't exist
    return <Icons.HelpCircle />;
  }

  return <IconComponent size={40} className="service-icon" />;
};


export default function Services() {
  return (
    <div className="services-page-container">
      <div className="services-header">
        <h1 className="services-heading">What We Do</h1>
        <p className="services-intro">
          We offer a comprehensive suite of services to help you build, launch, and maintain your digital presence.
        </p>
      </div>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <DynamicIcon name={service.icon} />
            <h2 className="service-card-title">{service.title}</h2>
            <p className="service-card-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}