import React, { useState, useEffect, useRef } from 'react';

export default function PortfolioCostellazione() {
  const [activeStars, setActiveStars] = useState([]);
  const [particleOpacity, setParticleOpacity] = useState(0);
  const particleCanvasRef = useRef(null);
  const constellationRef = useRef(null);
  const [backgroundStars, setBackgroundStars] = useState([]);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const experiences = [
    { 
      id: 1, 
      title: "Data analytics", 
      period: "2020 - 2022",
      top: 20,
      left: 35,
      leftMobile: 20,
    },
    { 
      id: 2, 
      title: "Business analyst", 
      period: "2021 - 2023",
      top: 40,
      left: 45,
      leftMobile: 70,
      tooltipLeft: true,
      description: "Bridge between business and technology"
    },
    { 
      id: 3, 
      title: "PSM I (Professional Scrum Master)",
      period: "2023",
      top: 55,
      left: 65,
      leftMobile: 30,
      description: "Certification"
    },
    { 
      id: 4, 
      title: "Scrum Matser", 
      period: "2024 - 2025",
      top: 75,
      left: 35, 
      leftMobile: 70,
      tooltipLeft: true,
      description: "Manage 2 teams, Agile ceremonies, backlog refinement, improvement learned"
    },
  ];

  const blogPosts = [
    {
      title: "Introduction to Agile methodology with Scrum - End to End explanation",
      date: "some days ago... 👀",
      read: "120 min read 🙈",
      image: "🦋",
      color: "#5A5A5A",
      description: "We start to say that Scrum is an agile project management framework that helps teams to manage their work through a set of values, principles, and practices...",
      link: "https://medium.com/@alessandro-difa/introduction-to-agile-methodology-with-scrum-end-to-end-explanation-92c46bd3aaf2"
    },
    {
      title: "Iterations in Software Engineering Life Cycle, a non linear journey",
      date: "1 week ago",
      read: "7 min read",
      image: "✨",
      color: "#0d7effff",
      description: "Software development is not a straight line. Explore how iterations and feedback loops create better products through continuous improvement...",
      link: "https://alessandro-difa.medium.com/iterations-in-software-engineering-life-cycle-a-non-linear-journey-9d8cc4aa75c5"
    },
    {
      title: "Capire gli alberi decisionali per la classificazione (Python)",
      date: "Mar 26, 2021",
      read: "8 min read",
      image: "🐍",
      color: "#F7DF1E",
      description: "Gli alberi decisionali sono uno strumento potente per la classificazione. Impara come implementarli in Python con esempi pratici...",
      link: "https://alessandro-difa.medium.com/capire-gli-alberi-decisionali-per-la-classificazione-python-d51b8ca0d6a4"
    }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Particle system
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || particleOpacity === 0) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.2 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(opacity) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 0.6})`;
        ctx.fill();
      }
    }

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = `rgba(168, 85, 247, ${particleOpacity * 0.08})`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * particleOpacity * 0.08;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(particleOpacity);
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleOpacity]);

  useEffect(() => {
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setBackgroundStars(stars);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!constellationRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const constellationTop = constellationRef.current.offsetTop;
      const constellationHeight = constellationRef.current.offsetHeight;

      const scrollProgress = (scrollY + windowHeight - constellationTop) / constellationHeight;

      const fadeInStart = 0.05;
      const fadeInEnd = 0.25;
      const fadeOutStart = 0.85;
      const fadeOutEnd = 1.0;

      let opacity = 0;
      
      if (scrollProgress >= fadeInStart && scrollProgress < fadeInEnd) {
        opacity = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
      } else if (scrollProgress >= fadeInEnd && scrollProgress < fadeOutStart) {
        opacity = 1;
      } else if (scrollProgress >= fadeOutStart && scrollProgress < fadeOutEnd) {
        opacity = 1 - ((scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart));
      } else if (scrollProgress >= fadeOutEnd) {
        opacity = 0;
      }

      setParticleOpacity(Math.max(0, Math.min(1, opacity)));

      const newActiveStars = [];
      experiences.forEach((exp, index) => {
        const threshold = (index + 1) / (experiences.length + 1);
        if (scrollProgress >= threshold - 0.1) {
          newActiveStars.push(exp.id);
        }
      });

      setActiveStars(newActiveStars);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white bg-black">      
      {/* Header */}
      <header id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-900 to-black">
        {/* Navigation */}
        <nav className="absolute top-8 left-4 md:top-18 md:left-12 flex flex-col gap-4 text-sm z-20">
    {/*       <a href="#about" className="hover:text-purple-300 transition text-lg md:text-xl">about me</a> 
          <a href="#blog" className="hover:text-purple-300 transition text-lg md:text-xl">Blog</a>
          <a href="#contact" className="hover:text-purple-300 transition text-lg md:text-xl">contact</a>  */}
        </nav>

        {/* Background stars */}
        <div className="absolute inset-0">
          {backgroundStars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `twinkle ${2 + Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative z-10 py-8">
          {/* Profile Image */}
          <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-purple-400 shadow-2xl flex-shrink-0">
            <img 
              src="/merlino-honolulu.gif"
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bio */}
          <div className="max-w-xl text-center md:text-left px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">Alessandro</h1>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">Di Fabio</h1>
            <h2 className="text-xl md:text-2xl text-purple-300 mb-4 md:mb-6">Scrum Master | Business Analyst</h2>
            <p className="text-base md:text-lg leading-relaxed text-purple-100">
              Certified Scrum Master (PSM I) with a strong background in delivering complex IT, 
              cloud and data transformation projects. I have experience in international corporate and startup.
              Skilled in data, agile frameworks (Scrum and Kanban), refine requirements gathering, backlog management. 
              I think that good management of work methodologies can increase productivity and create a more sustainable work environment.
            </p>
          </div>
        </div>
      </header>

      {/* Professional Experience */}
      <section 
        ref={constellationRef}
      className="relative py-16 md:py-32 bg-black"
      style={{ minHeight: '150vh'}}
      >
        {/* Particle Canvas */}
        <canvas
          ref={particleCanvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            zIndex: 0,
            transition: 'opacity 0.5s ease'
          }}
        />

    <div className="container mx-auto px-4 md:px-8 relative z-10" style={{ marginBottom: '100%' }}>        
    <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 md:mb-32 sticky top-8">          
          Professional Experience
          </h2>
        </div>

        {/* Constellation */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {experiences.map((exp, index) => {
              if (index === 0 || !activeStars.includes(exp.id) || !activeStars.includes(experiences[index - 1].id)) {
                return null;
              }
              const prev = experiences[index - 1];
              const prevLeft = isMobile ? (prev.leftMobile || prev.left) : prev.left;
              const currLeft = isMobile ? (exp.leftMobile || exp.left) : exp.left;
              
              return (
                <line
                  key={`line-${exp.id}`}
                  x1={`${prevLeft}%`}
                  y1={`${prev.top}%`}
                  x2={`${currLeft}%`}
                  y2={`${exp.top}%`}
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
              );
            })}
          </svg>

          {experiences.map((exp) => {
            const starLeft = isMobile ? (exp.leftMobile || exp.left) : exp.left;
            
            return (
              <div
                key={exp.id}
                className="absolute transition-all duration-1000"
                style={{
                  top: `${exp.top}%`,
                  left: `${starLeft}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-1000 ${
                    activeStars.includes(exp.id)
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  }`}
                  style={{
                    background: 'radial-gradient(circle, #a78bfa 0%, #7c3aed 60%, transparent 100%)',
                    boxShadow: activeStars.includes(exp.id) ? '0 0 30px #a78bfa' : 'none'
                  }}
                />

                <div
                  className={`absolute ${exp.tooltipLeft ? 'right-20 md:left-24' : 'left-20 md:left-24'} top-1/2 -translate-y-1/2 bg-purple-900/90 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-lg border border-purple-400 transition-all duration-1000 w-48 md:w-56 ${
                    activeStars.includes(exp.id)
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${exp.tooltipLeft ? 'translate-x-4 md:-translate-x-4' : '-translate-x-4'}`
                  }`}
                >
                  <div className="text-xs md:text-sm text-purple-300">{exp.period}</div>
                  <div className="font-bold text-base md:text-xl">{exp.title}</div>
                  <div className="text-xs md:text-sm text-purple-200 mt-1">{exp.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-32" style={{ backgroundColor: 'rgb(36, 18, 50)' }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="border-t-4 border-white mb-8 md:mb-12"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16">blog</h2>
          
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            {blogPosts.map((post, index) => (
              <a 
                key={index} 
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-lg hover:bg-white/20 transition block"
              >
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto md:mx-0"
                  style={{ backgroundColor: post.color }}
                >
                  {post.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{post.title}</h3>
                  <div className="text-xs md:text-sm text-purple-300 mb-2">
                    Published {post.date} · {post.read}
                  </div>
                  <p className="text-sm md:text-base text-purple-200">
                    {post.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <a 
              href="https://medium.com/@alessandro-difa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-lg md:text-xl text-purple-300 hover:text-purple-100 transition underline"
            >
              Per altri articoli... clicca qui
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-32" style={{ backgroundColor: 'rgb(36, 18, 50)' }}>
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="border-t-4 border-white mb-8 md:mb-12"></div>
          <h2 className="text-4xl md:text-6xl font-bold mb-12 md:mb-16">contact me</h2>
          
          {/* Social Links and Email */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mb-12">
            <a 
              href="https://www.linkedin.com/in/alessandro-difa/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-200 hover:text-purple-100 transition text-base md:text-lg"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            
            <a 
              href="https://medium.com/@alessandro-difa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-200 hover:text-purple-100 transition text-base md:text-lg"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              Medium
            </a>
            
            <a 
              href="mailto:alessandro.difa93@gmail.com"
              className="flex items-center gap-2 text-purple-200 hover:text-purple-100 transition text-base md:text-lg break-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span className="hidden md:inline">alessandro.difa93@gmail.com</span>
              <span className="md:hidden">Email</span>
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}