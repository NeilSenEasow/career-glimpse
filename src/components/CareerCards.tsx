
import React, { useEffect, useRef } from 'react';

interface CareerCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const CareerCards = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      fadeInObserver.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) {
        fadeInObserver.observe(card);
      }
    });

    return () => {
      fadeInObserver.disconnect();
    };
  }, []);

  const careers: CareerCard[] = [
    {
      title: 'Technology',
      description: 'Explore careers in software development, data science, cybersecurity, and more.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      ),
      color: 'from-blue-500/20 to-cyan-400/20',
    },
    {
      title: 'Healthcare',
      description: 'Discover roles in medicine, nursing, healthcare administration, and research.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 9h-5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5"></path>
          <path d="M12 14v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-2.2 1.8-4 4-4h6c1.1 0 2 .9 2 2v2"></path>
        </svg>
      ),
      color: 'from-red-500/20 to-pink-400/20',
    },
    {
      title: 'Business',
      description: 'Explore opportunities in management, marketing, finance, and entrepreneurship.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="2" rx="2"></rect>
          <rect width="8" height="8" x="8" y="6" rx="1"></rect>
          <path d="M18 18v4"></path>
          <path d="M9 22h9a3 3 0 0 0 3-3v-3"></path>
          <path d="M10 22V8"></path>
        </svg>
      ),
      color: 'from-amber-500/20 to-yellow-400/20',
    },
    {
      title: 'Creative Arts',
      description: 'Discover pathways in design, visual arts, writing, music, and performance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5"></circle>
          <path d="M21 2H9l3 7l-8 7 2 5h4l2-3h7"></path>
        </svg>
      ),
      color: 'from-purple-500/20 to-fuchsia-400/20',
    },
    {
      title: 'Education',
      description: 'Explore careers in teaching, educational leadership, counseling, and training.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 8 10-5 10 5-10 5z"></path>
          <path d="M12 16v6"></path>
          <path d="M22 13.5V18"></path>
          <path d="M18 12v6"></path>
          <path d="M6 12v6"></path>
        </svg>
      ),
      color: 'from-green-500/20 to-emerald-400/20',
    },
    {
      title: 'Science & Research',
      description: 'Discover opportunities in scientific research, environmental science, and academia.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v8.5a2.5 2.5 0 0 1-5 0V8"></path>
          <path d="M7 3a2 2 0 0 0-2 2"></path>
          <path d="M21 15a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-1a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2Z"></path>
        </svg>
      ),
      color: 'from-indigo-500/20 to-violet-400/20',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 fade-in-section">
      <div className="container px-6 md:px-8 mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Explore Possibilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Career Paths</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Our assessment helps match you with career fields that align with your skills, interests, and values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careers.map((career, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="fade-in-section card-3d perspective group cursor-pointer"
            >
              <div className={`h-full p-8 rounded-2xl border border-border shadow-sm bg-gradient-to-br ${career.color} backdrop-blur-sm`}>
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 text-primary group-hover:text-accent transition-colors duration-300">
                  {career.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{career.title}</h3>
                <p className="text-foreground/70 mb-6">{career.description}</p>
                
                <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors duration-300">
                  <span className="mr-2">Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerCards;
