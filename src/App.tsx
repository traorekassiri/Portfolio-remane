import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  User, 
  Code, 
  Send,
  Globe,
  Share2,
  Palette,
  BarChart3,
  ClipboardList,
  Quote,
  ExternalLink,
  Search,
  Filter,
  Instagram,
  Settings,
  Save,
  FileText,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';

// --- Context for Configuration ---

const ConfigContext = createContext<any>(null);

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Error loading config:', err));
  }, []);

  if (!config) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-turquoise border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

const useConfig = () => useContext(ConfigContext);

// --- Components ---

const Navbar = () => {
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Accueil', href: '/', icon: User },
    { name: 'Compétences', href: '/competences', icon: Code },
    { 
      name: 'Mes Projets', 
      href: '#', 
      icon: Globe,
      dropdown: [
        {
          label: 'Mes Projets',
          items: [
            { name: 'Mes Réalisations', href: '/projets/realisations' },
            { name: 'Appel à projets (PCTL)', href: '/projets/pctl' },
            { name: 'Plaquette JCBM 2024', href: '/projets/plaquette-jcbm' },
            { name: 'Galerie Photos', href: '/projets/galerie' },
          ]
        }
      ]
    },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isOpen ? 'bg-white py-4' : (scrolled || location.pathname !== '/' ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6')}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold text-gray-900 relative z-[110]">
          Mon Portfolio<span className="text-turquoise">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={link.href} 
                className={`nav-link flex items-center space-x-1 relative ${location.pathname === link.href || (link.dropdown && link.dropdown.some(d => d.items.some(i => location.pathname === i.href))) ? 'text-turquoise' : 'text-gray-900'}`}
                onClick={(e) => link.href === '#' && e.preventDefault()}
              >
                <span>{link.name}</span>
                {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                {(location.pathname === link.href || (link.dropdown && link.dropdown.some(d => d.items.some(i => location.pathname === i.href)))) && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-turquoise rounded-full"
                  />
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-[120]"
                    >
                      {link.dropdown.map((section, idx) => (
                        <div key={idx} className="px-2">
                          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            {section.label}
                          </div>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className={`block px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === item.href ? 'bg-turquoise/10 text-turquoise' : 'text-gray-600 hover:bg-gray-50 hover:text-turquoise'}`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          <div className="flex items-center space-x-5 pl-4 border-l border-gray-100">
            {config.socials.linkedin && (
              <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                <Linkedin size={20} />
              </a>
            )}
            {config.socials.instagram && (
              <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                <Instagram size={20} />
              </a>
            )}
            <a href={`mailto:${config.profile.email}`} className="text-gray-400 hover:text-turquoise transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden relative z-[110] p-2 -mr-2 text-gray-900 focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-end">
            <span 
              className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[9px] w-full' : 'rotate-0 translate-y-0 w-full'}`}
            />
            <span 
              className={`h-0.5 w-2/3 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 translate-x-[10px]' : 'opacity-1 translate-x-0'}`}
            />
            <span 
              className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[9px] w-full' : 'rotate-0 translate-y-0 w-full'}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[105] md:hidden"
          >
            <div className="flex flex-col h-full pt-32 pb-12 px-8">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <div className="flex flex-col space-y-4">
                      <Link
                        to={link.href}
                        className="flex items-center space-x-6 group"
                        onClick={(e) => {
                          if (link.dropdown) {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === link.name ? null : link.name);
                          } else {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${location.pathname === link.href || (link.dropdown && link.dropdown.some(d => d.items.some(i => location.pathname === i.href))) ? 'bg-turquoise text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-turquoise/10 group-hover:text-turquoise'}`}>
                          <link.icon size={24} />
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-4xl font-bold tracking-tighter transition-colors ${location.pathname === link.href || (link.dropdown && link.dropdown.some(d => d.items.some(i => location.pathname === i.href))) ? 'text-turquoise' : 'text-gray-900 group-hover:text-turquoise'}`}>
                            {link.name}
                          </span>
                          {link.dropdown && <ChevronDown size={24} className={`text-gray-300 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                        </div>
                      </Link>

                      {link.dropdown && activeDropdown === link.name && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pl-18 space-y-4"
                        >
                          {link.dropdown.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{section.label}</p>
                              <div className="flex flex-col space-y-3">
                                {section.items.map((item, iIdx) => (
                                  <Link
                                    key={iIdx}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-xl font-bold transition-colors ${location.pathname === item.href ? 'text-turquoise' : 'text-gray-500 hover:text-turquoise'}`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto"
              >
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Me contacter</p>
                  <div className="flex flex-col space-y-4">
                    <a href={`mailto:${config.profile.email}`} className="flex items-center space-x-4 text-gray-600 hover:text-turquoise transition-colors">
                      <Mail size={20} />
                      <span className="font-medium">{config.profile.email}</span>
                    </a>
                    <div className="flex space-x-6 pt-4">
                      {config.socials.linkedin && (
                        <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                          <Linkedin size={24} />
                        </a>
                      )}
                      {config.socials.instagram && (
                        <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                          <Instagram size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MarkdownSection = ({ title, file, icon: Icon, id, className = "", components = {}, imageUrl }: { title: string, file: string, icon: any, id: string, className?: string, components?: any, imageUrl?: string }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/content/${file}`)
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(err => console.error(`Error loading ${file}:`, err));
  }, [file]);

  return (
    <section id={id} className={`section-container ${className}`}>
      {imageUrl && (
        <div className="mb-12 rounded-[2.5rem] overflow-hidden h-[300px] md:h-[500px] relative group">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-12 h-12 rounded-xl bg-turquoise/10 flex items-center justify-center text-turquoise">
          <Icon size={24} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="markdown-body"
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          components={{
            a: ({ href, children }: any) => {
              const isInternal = href?.startsWith('/');
              const isButton = children?.toString().toLowerCase().includes('découvrir');
              
              const baseClass = isButton 
                ? "inline-flex items-center px-8 py-4 bg-turquoise text-white rounded-full font-bold hover:bg-turquoise-dark transition-all shadow-lg shadow-turquoise/20 no-underline"
                : "text-turquoise hover:text-turquoise-dark font-bold underline underline-offset-4";

              if (isInternal) {
                return (
                  <Link to={href} className={baseClass}>
                    {children}
                    {isButton && <ChevronRight className="ml-2" size={20} />}
                  </Link>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>
                  {children}
                  {isButton && <ExternalLink className="ml-2" size={20} />}
                </a>
              );
            },
            p: ({ children, node }: any) => {
              const hasImage = node.children.some((child: any) => child.type === 'element' && child.tagName === 'img');
              return hasImage ? <div className="mb-4">{children}</div> : <p className="mb-4">{children}</p>;
            },
            ...components
          }}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    </section>
  );
};

const Hero = () => {
  const config = useConfig();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('portfolio-content');
    if (!element) {
      console.error('Element #portfolio-content not found');
      window.print();
      return;
    }
    
    setIsGenerating(true);
    
    // 1. Force all animated elements to be visible for capture
    const body = document.body;
    body.classList.add('pdf-export-mode');
    
    // Configuration avancée pour un rendu multi-pages propre
    const opt = {
      margin:       [0.4, 0.4] as [number, number],
      filename:     'Mouniratou_GUIRA_Portfolio.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Supprimer les références aux couleurs oklch qui font planter html2canvas
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            // Si une couleur contient oklch, on la remplace par une valeur sûre
            if (style.color.includes('oklch')) el.style.color = '#111827';
            if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'transparent';
            if (style.borderColor.includes('oklch')) el.style.borderColor = '#e5e7eb';
          }
        }
      },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      // Attendre un court instant pour que les styles s'appliquent
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert("La génération directe a échoué. Utilisation de l'impression système.");
      window.print();
    } finally {
      body.classList.remove('pdf-export-mode');
      setIsGenerating(false);
    }
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Main Intro (Optional, but keeping some structure) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 flex-1 order-2 md:order-1"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-turquoise/10 text-turquoise font-medium text-xs mb-8 tracking-widest uppercase">
            {config.sections.hero.tagline}
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-[0.9] tracking-tighter">
            {config.sections.hero.mainTitle.split(' ')[0]} <br />
            <span className="text-turquoise">{config.sections.hero.mainTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <div className="h-1 bg-turquoise mb-8 w-24" />
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light max-w-xl mb-10">
            {config.profile.bio}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              href={config.profile.cvUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-turquoise transition-all group w-full sm:w-auto justify-center"
            >
              <span className="font-medium">Télécharger mon CV</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className={`inline-flex items-center space-x-3 border-2 border-gray-200 text-gray-600 px-8 py-4 rounded-full hover:border-turquoise hover:text-turquoise transition-all group w-full justify-center no-print ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download size={20} className={isGenerating ? 'animate-bounce' : 'group-hover:translate-y-0.5 transition-transform'} />
                <span className="font-medium">{isGenerating ? 'Génération...' : 'Version PDF'}</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center no-print italic">
                Si le téléchargement ne démarre pas, utilisez le lien "Shared App URL" en haut.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 sm:ml-4">
              {config.socials.linkedin && (
                <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                  <Linkedin size={28} />
                </a>
              )}
              {config.socials.instagram && (
                <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                  <Instagram size={28} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Immersive Image with Overlay Text */}
        <div className="relative flex-1 w-full h-[60vh] md:h-[85vh] order-1 md:order-2 group">
          {/* Image Container with Faded Edges */}
          <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Gradient Overlays for "Fading" effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent z-10 hidden md:block" />
            
            <img 
              src={config.profile.avatarUrl} 
              alt={config.profile.name} 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="eager"
            />

            {/* Text Overlay on the Photo */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 hero-overlay">
              <div className="max-w-md">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  {config.profile.name}
                </h2>
                <p className="text-turquoise font-semibold text-lg mb-4 leading-tight">
                  Chargée de Communication Junior | <br />
                  <span className="text-white/90">Stratégie Digitale & Corporate</span>
                </p>
                <div className="w-12 h-0.5 bg-turquoise mb-6" />
                <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  Proposition de stage de fin d'études (mai 2026) ou d'alternance (septembre 2026) ? <br />
                  <span className="text-white font-bold mt-2 block italic">Voici mon CV et mon mail !</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-turquoise/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-turquoise/10 rounded-full blur-2xl -z-10" />
        </div>
      </div>
      
      {/* Decorative vertical text or line */}
      <div className="absolute bottom-12 left-6 z-20 hidden lg:block">
        <div className="flex items-center space-x-4 text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black">
          <div className="w-12 h-[1px] bg-gray-300" />
          <span>{config.sections.hero.tagline}</span>
        </div>
      </div>
    </section>
  );
};

const ProjectHero = ({ title, subtitle, tagline, heroImageUrl }: { title?: string, subtitle?: string, tagline?: string, heroImageUrl?: string }) => {
  const config = useConfig();
  const displayTitle = title || config.sections.projects.title.split(' ')[0];
  const displaySubtitle = subtitle || config.sections.projects.title.split(' ').slice(1).join(' ');
  const displayTagline = tagline || "Réalisations & Projets";
  const displayHeroImage = heroImageUrl || config.sections.projects.heroImageUrl;

  return (
    <section className="relative min-h-[70vh] flex items-center bg-white overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-20 order-2 md:order-1"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-turquoise/10 text-turquoise font-medium text-xs mb-8 tracking-widest uppercase">
            {displayTagline}
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gray-900 mb-8 leading-[0.9] tracking-tighter">
            {displayTitle} <br />
            <span className="text-turquoise">{displaySubtitle}</span>
          </h1>
          
          <div className="h-1 bg-turquoise mb-8 w-24" />
          
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light max-w-xl">
            {config.sections.projects.description}
          </p>
        </motion.div>

        {/* Image Content - Split and Faded */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[40vh] md:h-[60vh] w-full order-1 md:order-2"
        >
          {/* Gradients to blend the image into the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10" />
          
          <div className="w-full h-full rounded-[2rem] overflow-hidden">
            <img 
              src={displayHeroImage} 
              alt="Mouniratou GUIRA - Projets" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-turquoise/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const SkillsHero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-white overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-20 order-2 md:order-1"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-turquoise/10 text-turquoise font-medium text-xs mb-8 tracking-widest uppercase">
            Expertise & Savoir-faire
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gray-900 mb-8 leading-[0.9] tracking-tighter">
            Mes <br />
            <span className="text-turquoise">Compétences</span>
          </h1>
          
          <div className="h-1 bg-turquoise mb-8 w-24" />
          
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light max-w-xl">
            Un profil polyvalent alliant communication éditoriale, création visuelle et gestion de projet.
          </p>
        </motion.div>

        {/* Image Content - Split and Faded */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[40vh] md:h-[60vh] w-full order-1 md:order-2"
        >
          {/* Gradients to blend the image into the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10" />
          
          <div className="w-full h-full rounded-[2rem] overflow-hidden">
            <img 
              src="https://i.imgur.com/YT4M9GQ.jpeg" 
              alt="Mouniratou GUIRA - Compétences" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-turquoise/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const config = useConfig();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <Link to="/" className="text-2xl font-display font-bold">
            Mon Portfolio<span className="text-turquoise">.</span>
          </Link>
          <p className="text-gray-400 mt-2">{config.profile.name} © {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <a 
            href={config.profile.cvUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-turquoise text-white px-6 py-2 rounded-full transition-all text-sm font-medium border border-white/20"
          >
            Télécharger mon CV
          </a>
          <div className="flex space-x-6">
            {config.socials.linkedin && (
              <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                <Linkedin size={24} />
              </a>
            )}
            {config.socials.instagram && (
              <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-turquoise transition-colors">
                <Instagram size={24} />
              </a>
            )}
            <a href={`mailto:${config.profile.email}`} className="text-gray-400 hover:text-turquoise transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Custom Markdown Components ---

const ExperienceList = ({ children }: any) => (
  <div className="grid gap-8">
    {children}
  </div>
);

const ExperienceItem = ({ children }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card group"
    >
      {children}
    </motion.div>
  );
};

const SkillList = ({ children }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {children}
  </div>
);

const SkillItem = ({ children }: any) => {
  const getText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getText).join(' ');
    if (React.isValidElement(node)) return getText((node as any).props.children);
    return '';
  };

  const fullText = getText(children);
  const [title, description] = fullText.split(' : ');
  const contentText = fullText.toLowerCase();

  let Icon = Code;
  if (contentText.includes('communication') || contentText.includes('rédaction') || contentText.includes('social')) Icon = Share2;
  else if (contentText.includes('visuelle') || contentText.includes('canva') || contentText.includes('adobe') || contentText.includes('graphique')) Icon = Palette;
  else if (contentText.includes('analyse') || contentText.includes('stratégie') || contentText.includes('audit') || contentText.includes('étude')) Icon = BarChart3;
  else if (contentText.includes('gestion') || contentText.includes('projet') || contentText.includes('organisation') || contentText.includes('équipe')) Icon = ClipboardList;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-turquoise/20 transition-all duration-500 flex flex-col group overflow-hidden"
    >
      {/* Hover background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-turquoise/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-turquoise group-hover:text-white flex items-center justify-center mb-6 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-turquoise/30">
          <Icon size={28} />
        </div>
        
        <h4 className="text-gray-900 text-xl font-bold mb-3 group-hover:text-turquoise transition-colors duration-300">
          {title}
        </h4>
        
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {description}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-1 bg-turquoise w-0 group-hover:w-full transition-all duration-500 ease-in-out" />
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Tuteur de Stage",
      role: "RTB Bobo-Dioulasso",
      content: "Mouniratou a fait preuve d'une grande curiosité et d'une capacité d'adaptation remarquable lors de sa mission à la RTB.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    {
      name: "Responsable Communication",
      role: "KIBI GROUP",
      content: "Une collaboration fructueuse. Son sens de l'organisation et sa créativité sur Canva ont été de réels atouts pour l'équipe.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    }
  ];

  return (
    <section className="section-container bg-gray-50 rounded-[3rem] my-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Témoignages</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Ce que disent mes collaborateurs et tuteurs de mes expériences passées.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative"
          >
            <Quote className="absolute top-6 right-8 text-turquoise/10" size={48} />
            <p className="text-gray-700 italic mb-8 relative z-10">"{t.content}"</p>
            <div className="flex items-center space-x-4">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-gray-100" />
              <div>
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const BlogSection = () => {
  const config = useConfig();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const posts = [
    {
      title: "L'évolution des médias au Burkina Faso",
      date: "Mars 2024",
      excerpt: "Analyse des transformations numériques dans le paysage médiatique burkinabè.",
      category: "Analyse",
      image: "https://i.imgur.com/1JhdYcX.jpeg",
      content: `
        Le paysage médiatique burkinabè a connu une mutation profonde ces dernières années, passant d'une domination de la presse écrite et de la radio traditionnelle à une explosion du numérique.

        Historiquement, la libéralisation des ondes dans les années 90 a permis l'émergence d'une multitude de radios privées et communautaires, brisant le monopole d'État. Cependant, c'est l'arrivée de l'internet mobile qui a véritablement révolutionné la donne. Aujourd'hui, les réseaux sociaux sont devenus la source d'information primaire pour une grande partie de la population, notamment les jeunes.

        Cette évolution apporte son lot de défis. La désinformation et les "fake news" circulent à une vitesse fulgurante, rendant le travail de fact-checking plus crucial que jamais. Les médias traditionnels, comme la RTB, ont dû s'adapter en développant des plateformes web dynamiques pour rester pertinents.

        En conclusion, l'avenir des médias au Burkina Faso réside dans l'hybridation des supports. La professionnalisation des acteurs du web et le renforcement de l'éthique journalistique sont les clés pour garantir une information de qualité dans ce nouvel écosystème numérique.
      `
    },
    {
      title: "La communication institutionnelle en temps de crise",
      date: "Janvier 2024",
      excerpt: "Comment les organisations adaptent leur discours face aux enjeux contemporains.",
      category: "Stratégie",
      image: "https://i.imgur.com/TXAobyp.jpeg",
      content: `
        En période d'incertitude ou de crise, la communication des institutions devient un pilier fondamental de la stabilité sociale et de la confiance publique.

        La réactivité et la transparence sont les principes directeurs d'une communication de crise réussie. Une institution qui tarde à s'exprimer laisse le champ libre aux rumeurs et aux interprétations erronées. Il est essentiel de choisir des canaux de diffusion adaptés pour toucher toutes les strates de la population, des centres urbains aux zones rurales.

        La gestion de la rumeur nécessite une veille constante et une capacité de contre-communication rapide et factuelle. Au-delà des faits, l'empathie et la clarté du message sont cruciales pour rassurer l'opinion publique. Une communication froide et purement administrative peut être perçue comme un manque de considération.

        En conclusion, une crise bien gérée sur le plan communicationnel peut paradoxalement renforcer la confiance envers l'institution. Elle démontre sa capacité à faire face à l'adversité tout en restant proche de ses administrés.
      `
    }
  ];

  return (
    <section className="section-container my-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Veille & Réflexions</h2>
          <p className="text-gray-600">Partage de mes analyses sur le monde de la communication.</p>
        </div>
        <button className="hidden md:flex items-center text-turquoise font-bold hover:underline">
          Voir tout <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="bg-gray-100 aspect-video rounded-3xl mb-6 overflow-hidden relative">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-turquoise z-10">
                {post.category}
              </div>
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-turquoise transition-colors">{post.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center text-sm text-gray-400 font-medium">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>5 min de lecture</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-full text-gray-900 hover:bg-turquoise hover:text-white transition-all z-20"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto">
                <div className="h-64 md:h-96 w-full relative">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                
                <div className="p-8 md:p-12 -mt-20 relative bg-white rounded-t-[2.5rem]">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="px-4 py-1 rounded-full bg-turquoise/10 text-turquoise font-bold text-xs uppercase tracking-widest">
                      {selectedPost.category}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">{selectedPost.date}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    {selectedPost.title}
                  </h2>
                  
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-turquoise/10 flex items-center justify-center text-turquoise">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{config.profile.name}</p>
                        <p className="text-sm text-gray-500">{config.profile.title}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="btn-primary"
                    >
                      Fermer la lecture
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const FormationList = ({ children }: any) => (
  <div className="relative pl-8 border-l-2 border-gray-100 space-y-12">
    {children}
  </div>
);

const FormationItem = ({ children }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-turquoise border-4 border-white shadow-sm" />
    {children}
  </motion.div>
);

const CertificatesSection = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const certificates = [
    {
      title: "Attestation de Stage - RTB",
      image: "https://i.imgur.com/An3J8qL.jpeg",
      description: "Stage pratique à la Radio Télévision du Burkina (RTB) Bobo-Dioulasso."
    },
    {
      title: "Attestation de Stage - KIBI GROUP",
      image: "https://i.imgur.com/FEaVBQt.jpeg",
      description: "Stage au sein de KIBI GROUP, agence de communication."
    }
  ];

  return (
    <section id="certificats" className="section-container my-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Certificats & Attestations</h2>
          <p className="text-gray-600">Preuves de mes engagements et de mes compétences acquises.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {certificates.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedCert(cert.image)}
          >
            <div className="bg-gray-100 aspect-[4/3] rounded-[2.5rem] overflow-hidden relative border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <img 
                src={cert.image} 
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <ImageIcon size={24} />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-turquoise transition-colors">{cert.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{cert.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-gray-900/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 max-w-5xl w-full max-h-full flex items-center justify-center"
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute -top-12 right-0 md:-right-12 p-2 text-white hover:text-turquoise transition-colors"
              >
                <X size={32} />
              </button>
              <img 
                src={selectedCert} 
                alt="Certificat" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <div className="card bg-turquoise/5 border-turquoise/20 text-center py-12">
        <div className="w-16 h-16 bg-turquoise text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Send size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
        <p className="text-gray-600 mb-8">Merci pour votre message. Je reviendrai vers vous très prochainement.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-turquoise font-bold hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      className="card space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <input required type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all" placeholder="Votre nom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input required type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all" placeholder="votre@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea required rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all" placeholder="Votre message..."></textarea>
      </div>
      <button 
        type="submit" 
        disabled={status === 'sending'}
        className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
      >
        {status === 'sending' ? 'Envoi en cours...' : 'Envoyer'} <Send size={18} className="ml-2" />
      </button>
    </form>
  );
};

// --- Pages ---

const HomePage = () => {
  const config = useConfig();
  return (
    <div id="portfolio-content" className="bg-white">
      <Hero />
      <MarkdownSection id="profil" title="Profil Professionnel" file="profil.md" icon={User} />
      <MarkdownSection 
        id="experiences" 
        title="Expériences" 
        file="experiences.md" 
        icon={Briefcase}
        imageUrl="https://i.imgur.com/YT4M9GQ.jpeg"
        components={{
          ul: ExperienceList,
          li: ExperienceItem
        }}
      />
      <MarkdownSection 
        id="formation" 
        title="Formation" 
        file="formation.md" 
        icon={GraduationCap}
        components={{
          ul: FormationList,
          li: FormationItem
        }}
      />
      <CertificatesSection />
      <Testimonials />
      <BlogSection />
      <section id="contact" className="section-container">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Me contacter</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              N'hésitez pas à me contacter pour toute opportunité de stage, de collaboration ou simplement pour échanger sur la communication et les médias.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-turquoise/10 text-turquoise flex items-center justify-center"><Mail size={20} /></div>
                <span className="text-gray-700">{config.profile.email}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-turquoise/10 text-turquoise flex items-center justify-center"><MapPin size={20} /></div>
                <span className="text-gray-700">{config.profile.location}</span>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                {config.socials.linkedin && (
                  <a href={config.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-turquoise transition-all shadow-lg hover:shadow-turquoise/20">
                    <Linkedin size={20} />
                  </a>
                )}
                {config.socials.instagram && (
                  <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-turquoise transition-all shadow-lg hover:shadow-turquoise/20">
                    <Instagram size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
};

const SkillsPage = () => (
  <div className="pb-24">
    <SkillsHero />
    <MarkdownSection 
      id="competences" 
      title="Détails des Compétences" 
      file="competences.md" 
      icon={Code}
      components={{
        h3: ({ children }: any) => (
          <h3 className="text-2xl font-bold text-gray-900 mt-16 mb-8 flex items-center space-x-4">
            <span className="w-8 h-1 bg-turquoise rounded-full" />
            <span>{children}</span>
          </h3>
        ),
        ul: SkillList,
        li: SkillItem
      }}
    />
  </div>
);

const AdminPage = () => {
  const config = useConfig();
  const [formData, setFormData] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (path: string, value: string) => {
    const newConfig = { ...formData };
    const keys = path.split('.');
    let current = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage('Configuration enregistrée ! Rechargez la page pour voir les changements.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('Erreur lors de l\'enregistrement.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-32 pb-24 max-w-4xl mx-auto px-6"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
            <Settings size={24} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Administration</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-turquoise text-white px-8 py-3 rounded-full font-bold hover:bg-turquoise/80 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={20} />
          <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl font-medium text-center border border-emerald-100 overflow-hidden"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {/* Profile Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <User size={20} className="text-turquoise" />
            <span>Profil Personnel</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Nom Complet</label>
              <input 
                type="text" 
                value={formData.profile.name}
                onChange={(e) => handleChange('profile.name', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Titre Professionnel</label>
              <input 
                type="text" 
                value={formData.profile.title}
                onChange={(e) => handleChange('profile.title', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Bio / Présentation</label>
              <textarea 
                rows={4}
                value={formData.profile.bio}
                onChange={(e) => handleChange('profile.bio', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                value={formData.profile.email}
                onChange={(e) => handleChange('profile.email', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Localisation</label>
              <input 
                type="text" 
                value={formData.profile.location}
                onChange={(e) => handleChange('profile.location', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Lien du CV (Google Drive, etc.)</label>
              <input 
                type="text" 
                value={formData.profile.cvUrl}
                onChange={(e) => handleChange('profile.cvUrl', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
          </div>
        </section>

        {/* Socials Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Share2 size={20} className="text-turquoise" />
            <span>Réseaux Sociaux</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">LinkedIn URL</label>
              <input 
                type="text" 
                value={formData.socials.linkedin}
                onChange={(e) => handleChange('socials.linkedin', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Instagram URL</label>
              <input 
                type="text" 
                value={formData.socials.instagram}
                onChange={(e) => handleChange('socials.instagram', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Palette size={20} className="text-turquoise" />
            <span>Design & Textes Hero</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tagline (Petit texte)</label>
              <input 
                type="text" 
                value={formData.sections.hero.tagline}
                onChange={(e) => handleChange('sections.hero.tagline', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Titre Principal (Nom Prénom)</label>
              <input 
                type="text" 
                value={formData.sections.hero.mainTitle}
                onChange={(e) => handleChange('sections.hero.mainTitle', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">URL de la Photo de Profil</label>
              <input 
                type="text" 
                value={formData.profile.avatarUrl}
                onChange={(e) => handleChange('profile.avatarUrl', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-turquoise transition-all"
              />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const ProjectsOverviewPage = () => {
  const config = useConfig();
  return (
    <div className="pb-24">
      <ProjectHero title="Mes" subtitle="Projets" tagline="Portfolio" />
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-turquoise/10 text-turquoise rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Globe size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Explorez mes réalisations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            Retrouvez l'ensemble de mes projets dans le menu "Mes Projets" ci-dessus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Mes Réalisations', href: '/projets/realisations', icon: ClipboardList },
              { name: 'Appel à projets (PCTL)', href: '/projets/pctl', icon: FileText },
              { name: 'Plaquette JCBM 2024', href: '/projets/plaquette-jcbm', icon: Palette },
              { name: 'Galerie Photos', href: '/projets/galerie', icon: ImageIcon },
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.href}
                className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-turquoise/5 hover:text-turquoise transition-all group border border-transparent hover:border-turquoise/20"
              >
                <item.icon size={24} className="mb-3 text-gray-400 group-hover:text-turquoise transition-colors" />
                <span className="text-sm font-bold text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const RealisationsPage = () => (
  <div className="pb-24">
    <ProjectHero title="Mes" subtitle="Réalisations" tagline="Expériences" heroImageUrl="https://i.imgur.com/YT4M9GQ.jpeg" />
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <Link to="/projets" className="inline-flex items-center text-gray-500 hover:text-turquoise transition-colors font-medium">
        <ChevronRight className="rotate-180 mr-2" size={20} />
        Retour aux projets
      </Link>
    </div>
    <MarkdownSection 
      id="projets" 
      title="Mes Réalisations" 
      file="projets.md" 
      icon={Globe}
      components={{
        h3: ({ children }: any) => (
          <div className="mt-20 mb-10 pb-4 border-b-2 border-turquoise/20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-4">{children}</span>
            </h3>
          </div>
        ),
        h4: ({ children }: any) => (
          <h4 className="text-xl font-bold text-turquoise mt-12 mb-6">{children}</h4>
        ),
        img: ({ src, alt }: { src: string, alt: string }) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-8 overflow-hidden rounded-3xl shadow-xl border border-gray-100 group"
          >
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        ),
        hr: () => <div className="my-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />,
        table: ({ children }: any) => (
          <div className="my-12 overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }: any) => (
          <thead className="bg-gray-50/50 border-b border-gray-100">
            {children}
          </thead>
        ),
        th: ({ children }: any) => (
          <th className="px-8 py-5 text-sm font-bold text-gray-900 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }: any) => (
          <td className="px-8 py-5 text-sm text-gray-600 border-b border-gray-50 last:border-0">
            {children}
          </td>
        )
      }}
    />
  </div>
);

const PCTLPage = () => (
  <div className="pb-24">
    <ProjectHero title="Appel à projets" subtitle="PCTL" tagline="Projet Transfrontalier" heroImageUrl="https://i.imgur.com/MkyRrEv.jpeg" />
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <Link to="/projets" className="inline-flex items-center text-gray-500 hover:text-turquoise transition-colors font-medium">
        <ChevronRight className="rotate-180 mr-2" size={20} />
        Retour aux projets
      </Link>
    </div>
    <MarkdownSection 
      id="pctl" 
      title="Dossier PCTL" 
      file="pctl.md" 
      icon={FileText}
      components={{
        h2: ({ children }: any) => (
          <h2 className="text-3xl font-bold text-gray-900 mt-20 mb-10 pb-4 border-b-2 border-turquoise/20">{children}</h2>
        ),
        h3: ({ children }: any) => (
          <h3 className="text-xl font-bold text-turquoise mt-12 mb-6">{children}</h3>
        ),
        table: ({ children }: any) => (
          <div className="my-12 overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }: any) => (
          <thead className="bg-gray-50/50 border-b border-gray-100">
            {children}
          </thead>
        ),
        th: ({ children }: any) => (
          <th className="px-8 py-5 text-sm font-bold text-gray-900 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }: any) => (
          <td className="px-8 py-5 text-sm text-gray-600 border-b border-gray-50 last:border-0">
            {children}
          </td>
        ),
        hr: () => <div className="my-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      }}
    />
    <div className="max-w-4xl mx-auto px-6 mt-12 text-center">
      <a 
        href="https://docs.google.com/document/d/1Tpi1BMxeAXSc-sHAgRJLFnEARnEj9jIX/edit?usp=drivesdk&ouid=103736493214921929526&rtpof=true&sd=true" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-turquoise transition-all duration-300 shadow-lg hover:shadow-turquoise/20 group"
      >
        <Download className="mr-3 group-hover:animate-bounce" size={20} />
        Télécharger le projet complet (PCTL)
      </a>
    </div>
  </div>
);

const PlaquetteJCBMPage = () => (
  <div className="pb-24">
    <ProjectHero title="Plaquette" subtitle="JCBM 2024" tagline="Visuels Officiels" />
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <Link to="/projets" className="inline-flex items-center text-gray-500 hover:text-turquoise transition-colors font-medium">
        <ChevronRight className="rotate-180 mr-2" size={20} />
        Retour aux projets
      </Link>
    </div>
    <MarkdownSection 
      id="plaquette-jcbm" 
      title="Plaquette JCBM 2024" 
      file="plaquette_jcbm.md" 
      icon={Palette}
      components={{
        img: ({ src, alt }: { src: string, alt: string }) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-8 overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100 group"
          >
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        )
      }}
    />
    <div className="max-w-4xl mx-auto px-6 mt-12 text-center">
      <a 
        href="https://drive.google.com/file/d/1VfEaQQ2qOPkcwCJPeddZiOPRv00Q1Zrr/view?usp=drivesdk" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-8 py-4 bg-turquoise text-white rounded-2xl font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-gray-900/20 group"
      >
        <Download className="mr-3 group-hover:animate-bounce" size={20} />
        Télécharger la plaquette complète
      </a>
    </div>
  </div>
);

const GaleriePage = () => (
  <div className="pb-24">
    <ProjectHero title="Galerie" subtitle="Photos" tagline="Moments en Images" heroImageUrl="https://i.imgur.com/yHkn7Ia.jpeg" />
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <Link to="/projets" className="inline-flex items-center text-gray-500 hover:text-turquoise transition-colors font-medium">
        <ChevronRight className="rotate-180 mr-2" size={20} />
        Retour aux projets
      </Link>
    </div>
    <MarkdownSection 
      id="galerie" 
      title="Galerie Photos" 
      file="galerie.md" 
      icon={ImageIcon}
      components={{
        img: ({ src, alt }: { src: string, alt: string }) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-8 overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100 group"
          >
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        )
      }}
    />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="overflow-x-hidden flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/competences" element={<SkillsPage />} />
              <Route path="/projets" element={<ProjectsOverviewPage />} />
              <Route path="/projets/realisations" element={<RealisationsPage />} />
              <Route path="/projets/pctl" element={<PCTLPage />} />
              <Route path="/projets/plaquette-jcbm" element={<PlaquetteJCBMPage />} />
              <Route path="/projets/galerie" element={<GaleriePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}
