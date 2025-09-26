import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      title: "SSC ICT Complete Course",
      level: "Secondary",
      duration: "6 Months",
      students: "150+",
      rating: "4.9",
      features: [
        "Complete Board Syllabus Coverage",
        "Practical Computer Skills",
        "Board Exam Preparation",
        "Weekly Mock Tests",
        "24/7 Support"
      ],
      color: "from-blue-500 to-purple-600",
      popular: false
    },
    {
      title: "HSC ICT Mastery Program",
      level: "Higher Secondary",
      duration: "1 Year",
      students: "200+",
      rating: "4.9",
      features: [
        "Advanced Programming Concepts",
        "Database Management",
        "Web Development Basics",
        "Board Exam Strategy",
        "University Prep Guidance"
      ],
      color: "from-primary to-accent",
      popular: true
    },
    {
      title: "University Admission Special",
      level: "Pre-University",
      duration: "3 Months",
      students: "100+",
      rating: "4.8",
      features: [
        "University Question Analysis",
        "Advanced Problem Solving",
        "Time Management Techniques",
        "Mock University Tests",
        "Career Counseling"
      ],
      color: "from-orange-500 to-red-600",
      popular: false
    },
    {
      title: "HSC Final Revision Crash",
      level: "Intensive",
      duration: "1 Month",
      students: "80+",
      rating: "4.9",
      features: [
        "Last-minute Preparation",
        "Important Topics Focus",
        "Quick Revision Techniques",
        "Exam Tips & Tricks",
        "Confidence Building"
      ],
      color: "from-green-500 to-teal-600",
      popular: false
    }
  ];

  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient">Premium Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive ICT education designed for different academic levels and goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <Card key={index} className="card-glow relative overflow-hidden group">
              {course.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              {/* Course Header */}
              <div className={`h-2 bg-gradient-to-r ${course.color} rounded-t-xl`} />
              
              <div className="p-8">
                {/* Course Title & Level */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">{course.duration}</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">{course.students}</div>
                  </div>
                  <div className="text-center">
                    <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">{course.rating}/5</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {course.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full group ${course.popular ? 'btn-hero' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="card-glow max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your <span className="text-gradient">ICT Journey?</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of successful students who have achieved excellence with our expert guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                Contact for Free Consultation
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Courses
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;