
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      await signup(values.name, values.email, values.password);
      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-8 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-foreground/70">Discover your perfect career path</p>
          </div>
          
          <div className="bg-card rounded-xl shadow-lg p-8 animate-scale-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full py-6">Create Account</Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-foreground/70">
                Already have an account? <Link to="#" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
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

export default SignUp;
