import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Github,
  Download,
  Terminal,
  Cpu,
  Clock,
  Layers,
  Database,
  Search,
  CheckCircle2,
  Code2,
  Users
} from "lucide-react";
import { useCreateSubscriber } from "@/hooks/use-subscribers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionWrapper } from "@/components/section-wrapper";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Link } from "wouter";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const createSubscriber = useCreateSubscriber();
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entry animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      createSubscriber.mutate({ email }, {
        onSuccess: () => setEmail("")
      });
    }
  };

  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/20 paper-texture">
      <div className="noise-bg" />

      {/* Navigation */}
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-0 w-full z-50 px-6 py-4 glass-panel border-b-0 border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl">अन्वेषण</span>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="font-sans text-sm tracking-widest uppercase opacity-70">Anveshan</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium opacity-80">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#timeline" className="hover:text-white transition-colors">Process</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 pt-20 relative">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >

              {/* Title - Fog reveal animation */}
              <h1 className="fluid-hero font-serif font-medium mb-8 fog-text-stagger">
                {"The Future of ".split("").map((char, i) => (
                  <span key={i} className="text-white/90">{char === " " ? "\u00A0" : char}</span>
                ))}
                <br />
                {"Identity Verification".split("").map((char, i) => (
                  <span key={i + 20} className="italic font-light text-white/70 transform -skew-x-6 inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </h1>

              {/* Description - Institutional tone */}
              <p className={`fluid-body text-muted-foreground max-w-xl leading-relaxed mb-10 fog-text transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                The invisible, secure standard for global identity verification.
                Powering next-generation authentication infrastructure.
              </p>

              <div className={`flex flex-wrap gap-4 mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <a
                  href="https://github.com/metalheadshubham/Anveshan/archive/refs/heads/v2.0-release.zip"
                  className="no-underline"
                >
                  <Button size="lg" variant="default" className="bg-white/90 text-black hover:bg-gray-200 h-12 px-8 font-serif">
                    <Download className="mr-2 h-4 w-4" />
                    Download Alpha v2.0
                  </Button>
                </a>
                <a
                  href="https://github.com/metalheadshubham/Anveshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 bg-transparent text-white/80 hover:bg-white/5 font-serif">
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </Button>
                </a>
              </div>

              {/* Key Feature Highlight */}
              <div className={`flex items-center gap-3 text-sm text-muted-foreground border-t border-white/10 pt-8 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <Users className="w-5 h-5 text-amber-500/60" />
                <span>Supports <strong className="text-foreground">1:N face detection</strong> — upload an image and search across the entire dataset</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Architecture Map */}
        <SectionWrapper id="architecture" className="bg-[#0f0f0f]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
              <h2 className="text-3xl md:text-4xl font-serif">System Architecture</h2>
              <p className="text-muted-foreground font-mono text-sm mt-4 md:mt-0">TIERED FILTRATION PIPELINE v2.0</p>
            </div>

            {/* New Professional Architecture Diagram */}
            <div className="mb-8">
              <ArchitectureDiagram />
            </div>
          </div>
        </SectionWrapper>



        {/* Performance Metrics with Data Table */}
        <SectionWrapper id="metrics" className="bg-[#0f0f0f]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-serif mb-12">Performance Metrics</h2>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {/* Highlight Card - 10K images in 22 min */}
              <div className="md:col-span-2 p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent rounded-xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-colors">
                  <Clock className="w-12 h-12" />
                </div>
                <div className="h-full flex flex-col justify-end">
                  <div className="text-5xl md:text-6xl font-serif mb-2 text-white/90">10,000</div>
                  <div className="text-lg font-serif text-white/60 mb-2">images in only 22 minutes</div>
                  <p className="text-white/40 text-sm">CPU-only processing on consumer hardware</p>
                </div>
              </div>
            </div>

            {/* Performance Data Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden mb-12">
              <table className="performance-table">
                <thead>
                  <tr className="bg-white/5">
                    <th>Metric</th>
                    <th>CPU (Measured)</th>
                    <th>GPU Conservative (5×)</th>
                    <th>GPU Optimistic (10×)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono text-sm">Throughput</td>
                    <td>3.8-4.5 img/s</td>
                    <td>19-22.5 img/s</td>
                    <td>38-45 img/s</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">Per-Image Latency</td>
                    <td>220-260 ms</td>
                    <td>44-52 ms</td>
                    <td>22-26 ms</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">4,247 Images (LFW)</td>
                    <td>16-20 min</td>
                    <td>3.2-4.0 min</td>
                    <td>1.6-2.0 min</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">100,000 Images</td>
                    <td>6.7 hours</td>
                    <td>1.3 hours</td>
                    <td>40 min</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">1,000,000 Images (UPSC)</td>
                    <td>2.8 days</td>
                    <td>13.4 hours</td>
                    <td>6.7 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lines of Code - Fixed overflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-8 border border-white/10 bg-black/20 rounded-xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-white/20 group-hover:text-white/40 transition-colors">
                  <Code2 className="w-12 h-12" />
                </div>
                <div className="h-full flex flex-col justify-end">
                  <div className="text-5xl md:text-6xl font-serif mb-4 group-hover:translate-x-2 transition-transform duration-500 truncate">12,712</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Lines of Code</div>
                  <p className="text-white/60 mt-4 max-w-md text-sm">Built entirely from scratch by a solo developer, optimizing every pipeline stage for maximum throughput.</p>
                </div>
              </div>

              <div className="p-6 border border-white/10 bg-black/20 rounded-xl flex flex-col justify-between group hover:border-white/20 transition-colors">
                <Terminal className="w-8 h-8 text-white/40 group-hover:text-white/80" />
                <div>
                  <div className="text-3xl font-serif mb-1">90+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Hours Dev Time</div>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Trust Architecture - Validated By */}
        <SectionWrapper id="trust" className="bg-card">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Lumina Labs Branding */}
              <div className="text-center lg:text-left">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-6">Validated By</p>
                {/* Lumina Labs Logo */}
                <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                  <svg className="w-10 h-10 text-white/80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="8" fill="currentColor" fillOpacity="0.3" />
                    <circle cx="20" cy="20" r="3" fill="currentColor" />
                    <path d="M20 2 L20 8 M20 32 L20 38 M2 20 L8 20 M32 20 L38 20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  </svg>
                  <span className="text-2xl font-serif text-white/90">Lumina Labs</span>
                  <span className="text-sm text-white/40 font-light">Singapore</span>
                </div>
                <p className="text-white/50 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
                  Powering secure authentication for next-generation fintech and borderless infrastructure in the APAC region.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-xs font-mono text-white/30">
                  <span className="px-3 py-1 border border-white/10 rounded">ISO 27001</span>
                  <span className="px-3 py-1 border border-white/10 rounded">SOC 2 Type II</span>
                  <span className="px-3 py-1 border border-white/10 rounded">GDPR Compliant</span>
                </div>
              </div>
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </SectionWrapper>



        {/* Developer & Footer - With Stats Moved Here */}
        <SectionWrapper id="about">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Created by</p>
            <h2 className="text-3xl font-serif mb-12">Shubham Kumar</h2>

            <div className="border-t border-white/10 pt-16 pb-8">
              <div className="max-w-lg mx-auto">
                <h3 className="text-xl font-serif mb-2">Join the Stable Alpha V.2</h3>
                <p className="text-muted-foreground text-sm mb-6">Be first to access production-grade identity verification</p>
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-md glass-input font-sans text-white placeholder:text-white/40"
                    required
                  />
                  <Button type="submit" variant="default" className="h-12 px-6 bg-white/90 text-black hover:bg-white/80 font-medium" disabled={createSubscriber.isPending}>
                    {createSubscriber.isPending ? "..." : <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-white/5">
        <p>© 2025 Anveshan Project. Open Source under MIT License.</p>
      </footer>
    </div>
  );
}
