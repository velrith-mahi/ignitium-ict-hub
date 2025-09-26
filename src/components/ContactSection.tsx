import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = `Hello! I'm interested in ICT tuition.%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0A%0AMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/8801303177324?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecting to WhatsApp",
      description: "Your message has been prepared for WhatsApp"
    });

    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      value: "01303-177324",
      action: () => window.open("tel:01303177324"),
      color: "text-green-500"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Direct",
      value: "Start Chat",
      action: () => window.open("https://wa.me/8801303177324"),
      color: "text-primary"
    },
    {
      icon: Mail,
      title: "Email",
      value: "alih.bd@gmail.com",
      action: () => window.open("mailto:alih.bd@gmail.com"),
      color: "text-blue-500"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Rajshahi, Bangladesh",
      action: () => {},
      color: "text-red-500"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your ICT learning journey? Contact us for personalized guidance and course information
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={index} 
                    className="card-glow p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={info.action}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center ${info.color}`}>
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{info.title}</h4>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick WhatsApp Button */}
            <Card className="card-glow p-8 bg-gradient-to-r from-green-500/10 to-primary/10">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Instant Support</h4>
                <p className="text-muted-foreground mb-6">
                  Get immediate responses to your queries via WhatsApp
                </p>
                <Button 
                  onClick={() => window.open("https://wa.me/8801303177324")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start WhatsApp Chat
                </Button>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="card-glow p-8">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="bg-background border-border"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your ICT learning goals, preferred schedule, or any questions you have..."
                  rows={6}
                  className="bg-background border-border resize-none"
                  required
                />
              </div>

              <Button type="submit" className="btn-hero w-full group">
                <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Send Message via WhatsApp
              </Button>
            </form>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <Card className="card-glow max-w-2xl mx-auto p-8">
            <h4 className="text-xl font-bold mb-4">Why Choose Exclusive ICT Care?</h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <p className="text-muted-foreground">Expert instruction from qualified CSE graduate</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <p className="text-muted-foreground">Personalized attention and flexible scheduling</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">3</span>
                </div>
                <p className="text-muted-foreground">Proven track record with 95% success rate</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;