import { Award, GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import teacherImage from "@/assets/teacher-profile.jpg";

const TeacherProfile = () => {
  const qualifications = [
    {
      degree: "Master of Science (MSc)",
      field: "Computer Science & Engineering",
      grade: "First Class",
      institution: "University of Rajshahi",
    },
    {
      degree: "Bachelor of Science (BSc Hons)",
      field: "Computer Science & Engineering", 
      grade: "First Class",
      institution: "University of Rajshahi",
    },
  ];

  const achievements = [
    "8+ Years Teaching Experience",
    "500+ Students Successfully Guided",
    "95% Success Rate in Board Exams",
    "Expert in SSC & HSC ICT Curriculum",
    "University Admission Specialist",
  ];

  return (
    <section id="about" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Your <span className="text-gradient">Expert Instructor</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from a qualified professional with proven expertise and dedication to student success
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Teacher Image & Basic Info */}
          <div className="text-center lg:text-left">
            <div className="relative inline-block mb-8">
              <img
                src={teacherImage}
                alt="Md Ali Hossain - ICT Teacher"
                className="w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-primary/20"
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse-glow">
                <Award className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-gradient mb-2">Md Ali Hossain</h3>
            <p className="text-xl text-muted-foreground mb-6">ICT Expert & Educator</p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>01303-177324</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>alih.bd@gmail.com</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Rajshahi, Bangladesh</span>
              </div>
            </div>

            <Button className="btn-hero">
              <Phone className="h-4 w-4 mr-2" />
              Contact on WhatsApp
            </Button>
          </div>

          {/* Qualifications & Achievements */}
          <div className="space-y-8">
            {/* Education */}
            <Card className="card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h4 className="text-2xl font-bold">Education</h4>
              </div>
              <div className="space-y-6">
                {qualifications.map((qual, index) => (
                  <div key={index} className="border-l-4 border-primary/30 pl-6">
                    <h5 className="text-lg font-semibold text-primary">{qual.degree}</h5>
                    <p className="text-foreground">{qual.field}</p>
                    <p className="text-muted-foreground">
                      {qual.grade} • {qual.institution}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="h-8 w-8 text-primary" />
                <h4 className="text-2xl font-bold">Achievements</h4>
              </div>
              <div className="grid gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherProfile;