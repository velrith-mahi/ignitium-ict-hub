import { BookOpen, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold text-gradient">Exclusive ICT Care</div>
                <div className="text-sm text-muted-foreground">Excellence in Education</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Expert ICT tuition for SSC, HSC, and University Admission preparation. 
              Learn from qualified professionals with proven success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-3 text-sm">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Teacher
              </a>
              <a href="#courses" className="block text-muted-foreground hover:text-primary transition-colors">
                Our Courses
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>01303-177324</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>alih.bd@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Rajshahi, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Exclusive ICT Care. All rights reserved. | 
            <span className="text-primary"> Md Ali Hossain</span> - BSc (Hons) MSc in CSE, Rajshahi University
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;