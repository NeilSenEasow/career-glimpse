
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Award, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate("/signup");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-lg overflow-hidden">
              <div className="bg-primary/10 py-10 px-8 text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 bg-white rounded-full shadow-md mb-4">
                  <UserCircle className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center justify-center mt-2">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Career Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg flex items-start">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Software Developer</h3>
                        <p className="text-sm text-muted-foreground">92% match with your profile</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">UX Designer</h3>
                        <p className="text-sm text-muted-foreground">87% match with your profile</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Data Analyst</h3>
                        <p className="text-sm text-muted-foreground">78% match with your profile</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Project Manager</h3>
                        <p className="text-sm text-muted-foreground">73% match with your profile</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Skills Assessment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg flex items-start">
                      <Award className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Problem Solving</h3>
                        <p className="text-sm text-muted-foreground">Advanced</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Award className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Communication</h3>
                        <p className="text-sm text-muted-foreground">Intermediate</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Award className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Technical Aptitude</h3>
                        <p className="text-sm text-muted-foreground">Advanced</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-start">
                      <Award className="h-5 w-5 text-primary mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium">Creativity</h3>
                        <p className="text-sm text-muted-foreground">Intermediate</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button onClick={() => navigate("/test")} className="px-8">Take Another Assessment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-8 bg-secondary/80">
        <div className="container px-6 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-xl font-semibold text-foreground mb-4 md:mb-0">
              career<span className="text-primary">glimpse</span>
            </div>
            <div className="text-sm text-foreground/60">
              © {new Date().getFullYear()} CareerGlimpse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
