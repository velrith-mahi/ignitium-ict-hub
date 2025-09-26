import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TeacherProfile from "@/components/TeacherProfile";
import CoursesSection from "@/components/CoursesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div id="home" className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <TeacherProfile />
      <CoursesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
