/**
 * written by Brian McCarthy
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Loader2, Mail } from 'lucide-react';

// Types
interface Destination {
  name: string;
  description: string;
  imageUrl: string;
}

interface TravelData {
  countries: { id: number; name: string; cities: Destination[] }[];
  temples: Destination[];
  beaches: Destination[];
}

type Page = 'home' | 'about' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [travelData, setTravelData] = useState<TravelData | null>(null);

  useEffect(() => {
    fetch('/travel_data.json')
      .then(res => res.json())
      .then(data => setTravelData(data))
      .catch(err => console.error('Error fetching travel data:', err));
  }, []);

  const handleSearch = () => {
    if (!travelData || !searchQuery.trim()) return;
    
    setLoading(true);
    const query = searchQuery.toLowerCase();
    let foundResults: Destination[] = [];

    if (query.includes('beach')) {
      foundResults = travelData.beaches;
    } else if (query.includes('temple')) {
      foundResults = travelData.temples;
    } else if (query.includes('country') || query.includes('australia') || query.includes('japan') || query.includes('brazil')) {
      if (query.includes('australia')) {
        foundResults = travelData.countries.find(c => c.name.toLowerCase() === 'australia')?.cities || [];
      } else if (query.includes('japan')) {
        foundResults = travelData.countries.find(c => c.name.toLowerCase() === 'japan')?.cities || [];
      } else if (query.includes('brazil')) {
        foundResults = travelData.countries.find(c => c.name.toLowerCase() === 'brazil')?.cities || [];
      } else {
        foundResults = travelData.countries.flatMap(c => c.cities);
      }
    }

    setTimeout(() => {
      setResults(foundResults);
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <MapPin className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-medium tracking-tighter uppercase whitespace-nowrap">TravelBloom</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            <button 
              onClick={() => { setCurrentPage('home'); setResults([]); }}
              className={`hover:text-white transition-colors ${currentPage === 'home' && results.length === 0 ? 'text-white' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentPage('about'); setResults([]); }}
              className={`hover:text-white transition-colors ${currentPage === 'about' && results.length === 0 ? 'text-white' : ''}`}
            >
              About Us
            </button>
            <button 
              onClick={() => { setCurrentPage('contact'); setResults([]); }}
              className={`hover:text-white transition-colors ${currentPage === 'contact' && results.length === 0 ? 'text-white' : ''}`}
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search destinations..."
                className="bg-white/5 border border-white/10 rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-white/30 transition-all w-32 sm:w-40 md:w-48 lg:w-64 text-sm"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
                 <div>
                   <h2 className="text-4xl font-light uppercase tracking-tighter">Recommendations</h2>
                   <p className="text-white/40 text-sm mt-2 font-mono uppercase">Results for "{searchQuery}"</p>
                 </div>
                 <button onClick={handleClear} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Clear All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {results.map((dest, idx) => (
                  <RecommendationCard key={idx} dest={dest} index={idx} />
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentPage === 'home' && <HomePage onSearchClick={() => {}} />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'contact' && <ContactPage />}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6 grayscale brightness-200">
               <span className="text-2xl font-medium tracking-tighter uppercase">TravelBloom</span>
            </div>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              Curated by travel experts since 2026. We provide high-end, off-the-beaten-path recommendations for the discerning traveler.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Explore</h4>
            <div className="flex flex-col gap-4 text-sm text-white/60">
              <button onClick={() => setCurrentPage('home')} className="hover:text-white text-left">Collections</button>
              <button className="hover:text-white text-left">Privacy Policy</button>
              <button className="hover:text-white text-left">Terms of Use</button>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Identity</h4>
            <p className="text-xs text-white/40 italic leading-relaxed">
              Written by Brian McCarthy<br />
              All rights reserved 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RecommendationCard({ dest, index }: { dest: Destination; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-2xl relative mb-6">
        <img 
          src={dest.imageUrl} 
          alt={dest.name} 
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-6 left-6 right-6">
           <h3 className="text-2xl font-light uppercase tracking-tighter text-white">{dest.name}</h3>
        </div>
      </div>
      <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-white/60 transition-colors">{dest.description}</p>
      <button className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20 pb-2 hover:border-white transition-all">
        Explore Journey
      </button>
    </motion.div>
  );
}

function HomePage({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mx-6 rounded-[40px] mt-4">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover grayscale"
        poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-beautiful-emerald-ocean-4366-large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      
      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-8 block">EST. 2026 — TRAVELBLOOM</span>
          <h1 className="text-7xl md:text-[140px] font-light leading-[0.85] tracking-tighter uppercase mb-12">
            The World<br />
            <span className="italic font-serif normal-case tracking-normal">Awaits</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-12 leading-relaxed">
            Discover breathtaking destinations, from serene beaches to ancient spiritual sites. Curated journeys for the modern wanderer.
          </p>
          <div className="flex justify-center gap-6">
            <button className="bg-white text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95">
              Begin Exploration
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
         <div className="flex gap-12 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 invisible md:visible">
            <span>Scroll to Discover</span>
            <span>Est. 2026</span>
         </div>
         <div className="w-px h-24 bg-white/10" />
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="sticky top-40"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">Our Narrative</span>
          <h2 className="text-6xl font-light uppercase tracking-tighter leading-[0.9] mb-12">Building the future of heritage travel.</h2>
          <p className="text-white/50 leading-relaxed text-lg mb-12">
            TravelBloom isn't just a recommendation engine; it's a philosophy. We believe in the power of place—how a specific coordinate on this earth can fundamentally shift a person's perspective.
          </p>
          <div className="h-px w-24 bg-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-32"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-8 italic">01. Legacy & Vision</h3>
            <p className="text-xl text-white font-light leading-relaxed">
              Founded in 2026 by visionaries who saw a gap in the luxury travel market, we aimed to connect the soul with the destination. Every path we chart is verified by our global network of explorers.
            </p>
          </div>

          <div className="p-12 bg-white/5 border border-white/10 rounded-[32px]">
            <h3 className="text-xl font-medium mb-8 uppercase tracking-tight">The Brian McCarthy Code</h3>
            <ul className="space-y-8">
               {[
                 "Preserve the authenticity of the local heritage.",
                 "Prioritize emotional resonance over tourist convenience.",
                 "Never compromise on transparency and traveler safety.",
                 "Excellence is not an option; it is our baseline."
               ].map((item, i) => (
                 <li key={i} className="flex gap-6 items-start">
                   <span className="text-[10px] font-mono text-white/30 mt-1">[{i+1}]</span>
                   <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                 </li>
               ))}
            </ul>
          </div>

          <div>
             <img 
               src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-[600px] object-cover rounded-[32px] grayscale"
               alt="Team Workspace"
             />
             <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 mt-6 text-right">TRAVELBLOOM HQ — RESEARCH & DEVELOPMENT</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-6 py-32 min-h-screen flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8 block">Reach Out</span>
          <h2 className="text-6xl font-light uppercase tracking-tighter leading-[0.9] mb-12">Establish a connection.</h2>
          <p className="text-white/50 leading-relaxed mb-16 lg:max-w-md">
            Whether you're looking for partnership opportunities or personalized travel advice, our team is ready to assist you.
          </p>

          <div className="space-y-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Direct Communication</h4>
              <p className="text-xl font-light">concierge@travelbloom.com</p>
              <p className="text-white/40 text-sm mt-1">+1 (800) BLOOM-X</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Strategic Location</h4>
              <p className="text-xl font-light">123 Wanderlust Lane</p>
              <p className="text-white/40 text-sm mt-1">Discovery Bay, CA 94505</p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="relative"
        >
          {submitted ? (
            <div className="bg-white p-16 rounded-[40px] text-center h-full flex flex-col justify-center items-center">
               <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-8">
                 <X className="text-white w-8 h-8 rotate-45" />
               </div>
               <h3 className="text-3xl font-light text-black uppercase tracking-tighter mb-4">Message Dispatched</h3>
               <p className="text-black/60 max-w-xs mb-8">Your query has been securely transmitted. Expect a response within one business day.</p>
               <button 
                 onClick={() => setSubmitted(false)}
                 className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black/20 pb-1"
               >
                 Send New Inquiry
               </button>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-md"
            >
              <div className="space-y-8">
                <div className="group border-b border-white/10 focus-within:border-white transition-colors pb-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-2">Subject's Name</label>
                  <input required type="text" className="w-full bg-transparent text-xl font-light focus:outline-none" placeholder="Johnathan Doe" />
                </div>
                <div className="group border-b border-white/10 focus-within:border-white transition-colors pb-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-2">Digital Contact</label>
                  <input required type="email" className="w-full bg-transparent text-xl font-light focus:outline-none" placeholder="john@example.com" />
                </div>
                <div className="group border-b border-white/10 focus-within:border-white transition-colors pb-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-2">Inquiry Details</label>
                  <textarea required rows={4} className="w-full bg-transparent text-xl font-light focus:outline-none resize-none" placeholder="Tell us about your next adventure..."></textarea>
                </div>
                <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all">
                  Transmit Request
                </button>
              </div>
            </form>
          )}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  );
}

