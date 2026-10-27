import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import './styles.css';
import InvestmentSection from './InvestmentSection';
import FlightOdyssey from './flight-odyssey/FlightOdyssey';
import CostCalculatorPage from './CostCalculatorPage';

const programs = ['Applied AI', 'Cyber Security'];
const defaultJourney = { name: '', program: '', origin: 'Delhi', destination: 'San Diego', term: 'Spring 2027', classType: 'Admit' };
const images = { hero: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=88', campus: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85', class: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85', studio: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85', students: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=85', sunset: 'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=900&q=85', city: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?auto=format&fit=crop&w=1600&q=85' };

function App() {
  const [journey, setJourney] = useState(defaultJourney); const [stage, setStage] = useState('onboarding'); const [errors, setErrors] = useState({});
  useEffect(() => { const saved = sessionStorage.getItem('usd-journey'); if (saved) setJourney(JSON.parse(saved)); }, []);
  const update = (key, value) => { setJourney((current) => ({ ...current, [key]: value })); setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current)); };
  const takeOff = (event) => { event.preventDefault(); const next = {}; if (!journey.name.trim()) next.name = 'Please enter your name'; if (!journey.program) next.program = 'Choose your program'; setErrors(next); if (Object.keys(next).length) return; sessionStorage.setItem('usd-journey', JSON.stringify(journey)); setStage('flight'); };
  if (stage === 'flight') return <FlightOdyssey onComplete={() => setStage('landing')} />; if (stage === 'landing') return <Landing journey={journey} />; return <Onboarding journey={journey} update={update} errors={errors} takeOff={takeOff} />;
}

function Header({ light = false }) { return <header className={`topbar ${light ? 'topbar--light' : ''}`}><div className="wordmark">INSTINCT <span>/</span> USD</div><nav><a href="#program">PROGRAMS</a><a href="#why">HOW IT WORKS</a><a href="#experience">THE EXPERIENCE</a><a href="#ready">MARK YOUR INTEREST</a><a href="#faq">FAQS</a></nav><a className="nav-cta" href="#program">BROWSE PROGRAMS</a><button className="menu-btn" aria-label="Open navigation">☰</button></header>; }
function SharedNav({ className = '', showLinks = true }) { return <header className={`shared-nav ${className}`}><a href="/" aria-label="University of San Diego home"><img src="/usd-logo-frame.png" alt="University of San Diego" /></a>{showLinks && <><nav><a href="#program">PROGRAMS</a><a href="#why">HOW IT WORKS</a><a href="#life-title">THE EXPERIENCE</a><a href="#investment">MARK YOUR INTEREST</a><a href="#faq">FAQS</a></nav><button className="shared-nav__menu" type="button" aria-label="Open navigation">☰</button></>}</header>; }


function BoardingPass({ journey, update, errors, takeOff, compact = false }) { return <form className={`boarding-pass ${compact ? 'boarding-pass--compact' : ''}`} onSubmit={takeOff} noValidate><div className="ticket-main"><div className="ticket-brand"><span>UNIVERSITY OF SAN DIEGO</span><strong>USD</strong><small>TORERO ADMIT · 2027</small></div><div className="ticket-passenger-label">PASSENGER NAME</div><div className="ticket-passenger-name">{journey.name || 'FUTURE TORERO'}</div><div className="ticket-route"><div><span>FROM:</span><strong>IND</strong><small>INDIA</small></div><div className="route-line"><i /><span>✈</span><i /></div><div className="align-right"><span>TO:</span><strong>SAN</strong><small>SAN DIEGO</small></div></div><div className="passenger-block"><label>PASSENGER NAME <input value={journey.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" aria-invalid={Boolean(errors.name)} />{errors.name && <small className="error">{errors.name}</small>}</label><label>PROGRAM <select value={journey.program} onChange={(e) => update('program', e.target.value)} aria-invalid={Boolean(errors.program)}><option value="">Select your program</option>{programs.map((program) => <option key={program}>{program}</option>)}</select>{errors.program && <small className="error">{errors.program}</small>}</label></div><div className="ticket-details"><div><span>FLIGHT</span><strong>USD 2027</strong></div><div><span>SEAT</span><strong>1A</strong></div><div><span>GATE</span><strong>A1</strong></div><div><span>CLASS</span><strong>ADMIT</strong></div><div><span>TERM</span><strong>SPRING 2027</strong></div></div><div className="ticket-action"><button type="submit">LET’S TAKE OFF <span>✈</span></button><p className="ticket-foot">YOUR SEAT TO SAN DIEGO · KEEP THIS PASS CLOSE</p></div></div><aside className="ticket-stub"><div className="stub-brand">UNIVERSITY OF SAN DIEGO</div><div className="stub-route"><strong>IND</strong><span>✈</span><strong>SAN</strong></div><div className="stub-cities"><span>INDIA</span><span>SAN DIEGO</span></div><div className="stub-details"><div><span>FLIGHT</span><strong>USD 2027</strong></div><div><span>SEAT</span><strong>1A</strong></div><div><span>GATE</span><strong>A1</strong></div><div><span>TERM</span><strong>SPRING 2027</strong></div></div><div className="stub-qr" aria-label="Boarding pass scan area" /><div className="stub-scan">SCAN TO TAKE OFF</div></aside></form>; }

function Onboarding({ journey, update, errors, takeOff }) {
  return <main className="welcome">
    <SharedNav className="shared-nav--welcome" showLinks={false} />
    <div className="welcome-content">
      <section className="welcome-copy">
        <h1>GUESS WHO’S GOING TO USD? YOU.</h1>
        <p className="welcome-congrats">Congratulations on your admit!</p>
        <p>San Diego is calling, and you’ve got a whole new chapter waiting for you. Curious about the people you’ll meet, the careers you’ll explore, and what your next two years could look like?<br />Let’s give you a sneak peek.</p>
      </section>
      <WelcomePass journey={journey} update={update} errors={errors} takeOff={takeOff} />
    </div>
  </main>;
}

function WelcomeProgramPicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapper = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const choose = (program) => {
    onChange(program);
    setOpen(false);
    trigger.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setActive(Math.max(0, programs.indexOf(value)));
        setOpen(true);
      } else {
        setActive((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + programs.length) % programs.length);
      }
    }
    if (open && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      choose(programs[active]);
    }
  };

  return <div className="welcome-pass__program" ref={wrapper}>
    <button
      ref={trigger}
      type="button"
      className={`welcome-pass__program-trigger${value ? '' : ' is-placeholder'}`}
      aria-label="Program"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="welcome-program-options"
      aria-activedescendant={open ? `welcome-program-option-${active}` : undefined}
      aria-invalid={Boolean(error)}
      onClick={() => { setActive(Math.max(0, programs.indexOf(value))); setOpen((current) => !current); }}
      onKeyDown={onKeyDown}
      onBlur={(event) => { if (!wrapper.current?.contains(event.relatedTarget)) setOpen(false); }}
    >{value ? value.toUpperCase() : 'SELECT PROGRAM'}</button>
    {open && <div className="welcome-pass__program-list" id="welcome-program-options" role="listbox" aria-label="Program">
      {programs.map((program, index) => <button key={program} id={`welcome-program-option-${index}`} type="button" role="option" tabIndex={-1} aria-selected={value === program} className={`welcome-pass__program-option${active === index ? ' is-active' : ''}`} onClick={() => choose(program)}>{program.toUpperCase()}</button>)}
    </div>}
    <input type="hidden" name="program" value={value} />
    {error && <small className="welcome-pass__error">{error}</small>}
  </div>;
}

function WelcomePass({ journey, update, errors, takeOff }) {
  const details = [['FLIGHT', 'USD 2027'], ['SEAT', '1A'], ['GATE', 'A1'], ['CLASS', 'ADMIT'], ['TERM', journey.term.toUpperCase()]];
  return <form className="welcome-pass" onSubmit={takeOff} noValidate>
    <span className="welcome-pass__logo" role="img" aria-label="University of San Diego" />
    <div className="welcome-pass__route">
      <div><span>FROM:</span><strong>IND</strong><small>INDIA</small></div>
      <div className="welcome-pass__line" aria-hidden="true"><i /><svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg><i /></div>
      <div><span>TO:</span><strong>SAN</strong><small>SAN DIEGO</small></div>
    </div>
    <div className="welcome-pass__fields">
      <p>YOUR BOARDING PASS TO SAN DIEGO</p>
      <label><span className="sr-only">Full name</span><input value={journey.name} onChange={(e) => update('name', e.target.value)} placeholder="ENTER FULL NAME" autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small className="welcome-pass__error">{errors.name}</small>}</label>
      <WelcomeProgramPicker value={journey.program} onChange={(program) => update('program', program)} error={errors.program} />
    </div>
    <dl className="welcome-pass__details">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <button type="submit">Let’s Take Off <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" /></svg></button>
  </form>;
}

function Flight({ journey, onComplete }) { const plane = useRef(null); const cloudA = useRef(null); const cloudB = useRef(null); useEffect(() => { const ctx = gsap.context(() => { const tl = gsap.timeline({ onComplete }); tl.fromTo('.flight-kicker', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }).fromTo('.flight-title', { opacity: 0, scale: .9, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.25').fromTo('.runway', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, '-=.2').to(plane.current, { x: '15vw', y: -25, rotation: -4, duration: 1, ease: 'power1.in' }).to(plane.current, { x: '50vw', y: -155, rotation: -10, duration: 2.1, ease: 'power2.inOut' }).to(plane.current, { x: '84vw', y: -42, rotation: 8, duration: 2.5, ease: 'power2.out' }).to('.arrival-pulse', { scale: 1.4, opacity: 0, duration: 1.1, ease: 'power2.out' }, '-=.8'); gsap.to(cloudA.current, { x: '-15vw', duration: 7, ease: 'none', repeat: -1 }); gsap.to(cloudB.current, { x: '12vw', duration: 10, ease: 'none', repeat: -1 }); }, document.querySelector('.flight-screen')); return () => ctx.revert(); }, []); return <main className="flight-screen"><Header light /><div className="flight-cloud cloud-a" ref={cloudA} /><div className="flight-cloud cloud-b" ref={cloudB} /><div className="flight-center"><p className="eyebrow flight-kicker">PREPARING FOR DEPARTURE · FLIGHT USD 2027</p><h2 className="flight-title">{journey.name}, YOUR JOURNEY<br /><em>STARTS NOW.</em></h2><div className="flight-stage"><div className="airport airport--del">DELHI<span>INDIA · GATE A1</span></div><div className="airport airport--san">SAN DIEGO<span>USA · WELCOME HOME</span></div><div className="runway" /><div className="route-glow" /><img ref={plane} className="hero-plane" src="/airplane.png" alt="Animated airplane" /><div className="arrival-pulse" /></div><div className="flight-status"><span>BOARDING</span><strong>{journey.program.toUpperCase()}</strong><span>NONSTOP · SPRING 2027</span></div></div></main>; }

const reasons = ['Professors who know your name', 'Aligned to the federal RACE framework', 'Thoughtful people who do the work', 'Finish with what you can show', 'Mentors who have been there', 'Help from the first day']; const outcomes = ['AI Product Manager', 'Cybersecurity Architect', 'Applied AI Strategist', 'Data Science Lead', 'Technology Consultant', 'Innovation Director']; const alumni = [['Matthew Demczyk, Class of 2005', 'Founder, global tech and innovation leader'], ['Jony Gens, Class of 2012', 'Designing the future of intelligent systems'], ['Jim Phelan, MBA 2001', 'Building teams that make a difference'], ['Huda B., Class of 2019', 'From USD to a career without limits'], ['Yee Hernandez, 2010', 'Making change in every room']];

const rankingCards = [
  ['#1', 'Most Beautiful Campus', 'The Princeton Review, 2027 Edition'],
  ['#11', 'Best Career Services', 'The Princeton Review, 2027 Edition'],
  ['#45', 'Best Value Schools', 'U.S. News & World Report'],
  ['#47', 'Best Colleges in the U.S.', 'The Wall Street Journal 2025'],
];

const usdReasons = [
  'Join 87,000+ USD alumni across all 50 states and 100 countries – a global community that opens doors long after graduation.',
  'Curriculum written by the people hiring you. Learn from courses shaped by leaders from Meta, Microsoft, Netflix, Qualcomm and Cisco - where Agentic AI and LLM Engineering are core courses, not electives.',
  'Professors who know your name. Study in an average class of 23 with a 13:1 student-faculty ratio - personalized attention, mentorship and support from day one.',
  "A career office with real connections. Step into 40,000+ employers on USD's job portal - guided by 3,300+ alumni mentors and Torero Treks that take you inside real companies.",
];
const usdReasonImages = ['/landing/updated/cta-1.png', '/landing/updated/cta-2.png', '/landing/updated/cta-3.png', '/landing/hero-campus.png'];

const landingAlumni = [
  ['Prashant Khare', 'Director, Data Science', 'Morgan Stanley', 'Principal Data Scientist, Agentic AI Lead'],
  ['Vikrant Tiwari', 'AVP, Digital Transformation', 'AXA XL', 'Head, AI & Intelligent Automation'],
  ['Richa Jha', 'System Simulation Lead Engineer', 'Intel Habana', 'Technical Leader, Data Center & AI Group'],
  ['Puneet Chopra', 'Head of Technology, Data Science', 'RADCOM', 'Principal Advisor, AI & Networks'],
];

const cseAlumni = [
  ['Aditya Kumar', 'Manager, Information Security', 'First American', 'CISO, Head of Cyber Security'],
  ['Akhil Bharani', 'Principal Engineer', 'Dell', 'Threat Response Analyst III'],
  ['Subhamoy Guha', 'Associate Consultant, Cyber Security', 'EY', 'Security Engineer II'],
  ['Gulab Jain J K', 'Analyst I, Infrastructure Services', 'DXC', 'Provisioning Engineer'],
];

const alumniCompanyLogos = {
  'Morgan Stanley': '/landing/logos/morgan-stanley-alumni.svg',
  'AXA XL': '/landing/logos/axa-xl-alumni.svg',
  'Intel Habana': '/landing/logos/intel-habana-alumni.svg',
  RADCOM: '/landing/logos/radcom-alumni.svg',
  Dell: '/landing/logos/alumni/dell.svg',
  EY: '/landing/logos/alumni/ey.svg',
  DXC: '/landing/logos/alumni/dxc.svg',
};

const landingFaculty = [
  ['Dr. Ebrahim Tarshizi', 'Academic Director, Applied AI & Data Science', 'Former senior technical advisor at CDC/NIOSH. Pioneers generative architectures & large agentic networks.'],
  ['Vitor Carvalho, PhD', 'Principal Applied Science Manager, Microsoft', 'Works on Copilot, LLMs, and multimodal AI. Former Principal Data Scientist at Intuit.'],
  ['Eric Colson', 'DS & ML Advisor', 'Led data science and algorithmic platforms at Netflix and Stitch Fix.'],
  ['Dr. Chell Roberts', 'Founding Dean', 'Recognized by the National Academy of Engineering for innovations in engineering education.'],
];

const cseFaculty = [
  { name: 'Dr. Haydar Majeed', role: 'Academic Director, Cybersecurity Engineering', description: 'Award-winning military intelligence professional with 15+ years of experience. Former CISO at Privatyze.', image: '/landing/faculty/verified/cse-haydar-majeed.jpeg' },
  { name: 'Wendi Whitmore', role: 'Chief Security Intelligence Officer, Palo Alto Networks', description: 'Led Unit 42 through major global cyber incidents. Former Global Lead at IBM X-Force.', image: '/landing/faculty/verified/cse-wendi-whitmore.jpg' },
  { name: 'Nahid Farhady, PhD', role: 'Adjunct Professor', description: 'Built AI-powered security review automation at scale during her time at Google.', image: '/landing/faculty/verified/cse-nahid-farhady.jpg' },
  { name: 'Alec Henning', role: 'Adjunct Professor', description: 'Supports U.S. Navy cybersecurity and high-assurance systems. Formerly at NIWC Pacific.', image: '/landing/faculty/verified/cse-alec-henning.jpg' },
];
const alumniPhotos = {
  'MS in Applied AI (AAI)': ['/landing/faculty/aai/faculty-02.png', '/landing/faculty/aai/faculty-03.png', '/landing/faculty/aai/faculty-04.png', '/landing/faculty/aai/faculty-01.png'],
  'Cybersecurity (CSE)': ['/landing/faculty/cse/faculty-02.png', '/landing/faculty/cse/faculty-03.png', '/landing/faculty/cse/faculty-04.png', '/landing/faculty/cse/faculty-01.png'],
};
const facultyTestimonials = [
  { name: 'Dr. Ebrahim Tarshizi', role: 'Academic Director, Applied AI & Applied Data Science', description: 'Former senior technical advisor at CDC/NIOSH.', image: '/landing/faculty/verified/aai-ebrahim-tarshizi.jpg' },
  { name: 'Vitor Carvalho, PhD', role: 'Principal Applied Science Manager, Microsoft', description: 'Works on Copilot, LLMs, and multimodal AI. Former Principal Data Scientist at Intuit.', image: '/landing/faculty/verified/aai-vitor-carvalho.jpg' },
  { name: 'Eric Colson', role: 'DS & ML Advisor', description: 'Led data science at Netflix and Stitch Fix.', image: '/landing/faculty/verified/aai-eric-colson.jpg' },
  { name: 'Dr. Chell Roberts', role: 'Founding Dean', description: 'Recognized by the National Academy of Engineering.', image: '/landing/faculty/verified/aai-chell-roberts.jpg' },
];

const employerBrands = {
  amazon: ['/landing/logos/amazon-wordmark.svg'],
  Google: ['/landing/logos/google-wordmark.svg'],
  NVIDIA: ['/landing/logos/nvidia-wordmark.svg'],
  CISCO: ['/landing/logos/cisco-wordmark.svg'],
  Apple: ['/landing/logos/apple.svg', true],
  ORACLE: ['/landing/logos/oracle-wordmark.svg'],
  'Capital One': ['/landing/logos/capitalone-wordmark.svg'],
  Fidelity: ['/landing/logos/fidelity-wordmark.svg'],
  'WELLS FARGO': ['/landing/logos/wellsfargo.svg', true],
  'T-Mobile': ['/landing/logos/tmobile-wordmark.svg'],
  PEPSICO: ['/landing/logos/pepsico-wordmark.svg'],
  DELTA: ['/landing/logos/delta-wordmark.svg', true],
  Microsoft: ['/landing/logos/microsoft-wordmark.svg'],
  Meta: ['/landing/logos/meta.svg', true],
  Netflix: ['/landing/logos/netflix-wordmark.svg'],
  Qualcomm: ['/landing/logos/qualcomm-wordmark.svg'],
  Deloitte: ['/landing/logos/deloitte-wordmark.svg'],
  accenture: ['/landing/logos/accenture-wordmark.svg'],
  DocuSign: ['/landing/logos/docusign-logo.svg'],
  RSI: ['/landing/logos/rsi-security.png'],
  'U.S. Marine Corps': ['/landing/logos/us-marine-corps.png'],
  SPAWAR: ['/landing/logos/spawar.gif'],
};

const primaryEmployers = ['amazon', 'Google', 'NVIDIA', 'CISCO', 'Apple', 'ORACLE', 'Capital One', 'Fidelity', 'WELLS FARGO', 'T-Mobile', 'PEPSICO', 'DELTA'];
const featuredEmployers = ['Google', 'amazon', 'NVIDIA', 'Apple', 'Microsoft', 'ORACLE'];
const widerNetwork = ['Meta', 'Netflix', 'Qualcomm', 'CISCO', 'Deloitte', 'accenture'];

const programContent = {
  'MS in Applied AI (AAI)': {
    short: 'MS-AAI',
    salary: '$129,000',
    careerIntro: 'Consistently ranked among the top private universities in the United States for campus experience, high-impact career services, and graduate ROI.',
    degree: 'MS in Applied Artificial Intelligence',
    headline: 'Learn from people who build AI for a living.',
    capstoneTitle: 'Your capstone is an AI solution to a real-world problem.',
    capstoneCopy: 'Bring your AI skills together to solve an enterprise challenge. Work you can put directly in front of an employer, not just a transcript.',
    jobs: [['AI Engineer', '$164,769'], ['AI Programmer', '$126,472'], ['ML Applied Researcher', '$139,795'], ['Applied ML Specialist', '$121,299']],
    networkLabel: 'MS-AAI graduates work at',
    employers: ['amazon', 'Google', 'NVIDIA', 'CISCO', 'Apple', 'Microsoft', 'PEPSICO', 'DELTA'],
    network: ['DocuSign', 'U.S. Navy', 'Meta', 'Netflix', 'Qualcomm', 'Deloitte'],
    facultyLabel: 'Learn from people who build AI for a living.',
  },
  'Cybersecurity (CSE)': {
    short: 'CSE',
    salary: '$102,000',
    careerIntro: '59% of cybersecurity teams report critical or significant skills gaps. Explore the career paths, earning potential, and people who can prepare you for what is next.',
    degree: 'MS in Cybersecurity Engineering',
    headline: 'Build the systems that keep the world moving.',
    capstoneTitle: 'Your capstone is a security solution to a real-world problem.',
    capstoneCopy: 'Apply security engineering, threat intelligence, and secure systems thinking to an enterprise challenge. Graduate with work you can show an employer.',
    jobs: [['CISO', '$223,000'], ['Cybersecurity Architect', '$136,000'], ['Cybersecurity Engineer', '$120,000+'], ['Information Security Analyst', '$103,590']],
    networkLabel: 'CSE graduates work at',
    employers: ['Microsoft', 'RSI', 'U.S. Marine Corps', 'SPAWAR', 'Google', 'NVIDIA', 'CISCO', 'Apple', 'amazon', 'Deloitte'],
    network: ['Intel', 'accenture', 'Morgan Stanley', 'CISCO', 'Deloitte'],
    facultyLabel: 'Learn from people who protect critical systems.',
  },
};

function BrandLogo({ name }) {
  const [src, iconOnly = false] = employerBrands[name] || [];
  if (!src) return <span className="fl-brand-logo fl-brand-logo--text" title={name}>{name}</span>;
  return <span className={`fl-brand-logo${iconOnly ? ' fl-brand-logo--icon' : ''}`} title={name}>
    <img src={src} alt={`${name} logo`} />
    {iconOnly && <span>{name}</span>}
  </span>;
}

function EmployerTicker({ names }) {
  return <div className="fl-logo-ticker">
    <div className="fl-logo-ticker__track">
      {[0, 1].map((copy) => <div className="fl-logo-ticker__set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>{names.map((name, index) => <BrandLogo key={`${name}-${index}`} name={name} />)}</div>)}
    </div>
  </div>;
}

function FigmaLandingPass({ name }) {
  return <div className="fl-pass" aria-label={`Boarding pass for ${name}`}>
    <img src="/USD_Boarding Pass front.png" alt="University of San Diego boarding pass from India to San Diego" />
    <span className="fl-pass-label">PASSENGER NAME</span>
    <div className="fl-pass-name">{(name || 'Future Torero').toUpperCase()}</div>
  </div>;
}

function ArrowButton({ direction, label, onClick, disabled = false }) {
  return <button className="fl-circle-button" type="button" aria-label={label} onClick={onClick} disabled={disabled}>
    <img src={`/landing/chevron-${direction}.svg`} alt="" />
  </button>;
}

function PeopleCarousel({ className, title, description, previousLabel, nextLabel, children }) {
  const rowRef = useRef(null);
  const [scrollState, setScrollState] = useState({ previous: false, next: false });
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => setScrollState({ previous: row.scrollLeft > 2, next: row.scrollLeft + row.clientWidth < row.scrollWidth - 2 });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    window.addEventListener('resize', update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [children]);
  const move = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.firstElementChild;
    const gap = Number.parseFloat(window.getComputedStyle(row).columnGap) || 0;
    row.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || row.clientWidth) + gap), behavior: 'smooth' });
  };
  return <article className={`fl-people-panel ${className}`}>
    <div className="fl-panel-heading"><div><h3>{title}</h3>{description && <p>{description}</p>}</div><div className="fl-carousel-buttons"><ArrowButton direction="left" label={previousLabel} onClick={() => move(-1)} disabled={!scrollState.previous} /><ArrowButton direction="right" label={nextLabel} onClick={() => move(1)} disabled={!scrollState.next} /></div></div>
    <div ref={rowRef} className={`fl-person-grid ${className === 'fl-faculty-panel' ? 'fl-testimonial-grid' : ''}`} onScroll={() => { const row = rowRef.current; if (row) setScrollState({ previous: row.scrollLeft > 2, next: row.scrollLeft + row.clientWidth < row.scrollWidth - 2 }); }} tabIndex={0} aria-label={title}>{children}</div>
  </article>;
}

function LandingFooter() {
  const social = [
    ['facebook', 'Facebook', '#'], ['x', 'X', '#'], ['instagram', 'Instagram', '#'],
    ['linkedin-in', 'LinkedIn', '#'], ['vimeo', 'Vimeo', '#'], ['youtube', 'YouTube', '#'],
  ];
  return <footer className="fl-footer">
    <div className="fl-footer__grid">
      <div className="fl-footer__brand">
        <img className="fl-footer__logo" src="/landing/usd-footer-logo.png" alt="University of San Diego" />
        <p className="fl-footer__ranking">Ranked in the Top 50<br />Best Colleges in the US</p>
        <small>(Wall Street Journal Annual Ranking 2025)</small>
        <div className="fl-footer__accreditation"><span>Accredited by</span><img className="fl-wasc-logo" src="/landing/wasc-footer-logo.png" alt="WASC Accrediting Commission for Schools" /></div>
      </div>
      <nav className="fl-footer__links" aria-label="Footer links"><h3>LINKS</h3><a href="#privacy">Privacy</a><a href="#terms">Terms and Conditions</a><a href="#campus">Main Campus Site</a></nav>
    <div className="fl-footer__contact"><h3>CONTACT</h3><a href="https://maps.google.com/?q=5998+Alcalá+Park,+San+Diego,+CA+92110" target="_blank" rel="noreferrer"><span className="fl-footer__pin">⌖</span>5998 Alcalá Park, San Diego, CA 92110</a><a href="tel:+917428144436"><img src="/landing/phone.svg" alt="" />+91 7428144436</a><a href="mailto:indiaadmission@sandiego.edu"><img src="/landing/mail.svg" alt="" />indiaadmission@sandiego.edu</a></div>
    </div>
    <div className="fl-footer__bottom"><div className="fl-footer__socials">{social.map(([icon, label, href]) => <a key={icon} href={href} aria-label={label}><img src={`/landing/social/${icon}.svg`} alt="" /></a>)}</div><span>Copyright © 2026</span></div>
  </footer>;
}

function LandingFaq() {
  const [open, setOpen] = useState(0);
  const items = [
    ['Is it still a sensible decision to study in the US given geopolitical uncertainty?', "A fair question, and we won't wave it away. Your offer, tuition and scholarship are confirmed in writing, and USD's support systems are built for uncertainty. What we won't do is promise world events won't touch your plans - no honest university will. For current official guidance, see travel.state.gov."],
    ['Can my scholarship be reconsidered?', 'Scholarships are awarded with your offer. If your circumstances have changed, the admissions team can tell you what a review looks like - ask before you decide, not after.'],
    ['Will I get a visa?', 'No university can promise a visa - the decision rests with the US consulate. What works in your favour: a confirmed admit and I-20 from an accredited US university, documented funding, and clear, honest answers at your interview. What you control: start early, keep your documents consistent, and prepare well - the team will walk you through typical interview questions and review your documents before you submit.'],
    ['What support will I receive before travelling and after arriving in San Diego?', 'Before: document checklists, I-20 guidance and financial document review on the India line. After: mandatory international orientation, the Office of International Students and Scholars for anything visa-related, career support from day one, and on-campus housing below city prices.'],
    ['How does the visa process work?', "Both programs are full-time and on-campus, which supports the standard F-1 student visa. Accept your offer, pay the enrollment deposit and claim your USDOne account - that unlocks your I-20 request. From there: submit financial documents (your scholarship counts toward the total), pay the SEVIS fee, complete the DS-160 and book your interview. You can enter the US up to 30 days before classes start, and work on campus up to 20 hours a week once you're here. Bringing family? A spouse and children under 21 can apply for F-2 visas - just mention it when you request your I-20. The team guides you through each step and can review your documents before you submit."],
  ];
  return <section className="fl-faq" id="faq">
    <div className="fl-faq__top fl-shell">
      <div className="fl-faq__intro"><h2>Your concerns, <span>answered</span></h2><p>These are the questions students asked most during the last intake. Straight answers from USD's own guidance - and a direct line to the team when you need more.</p></div>
      <div className="fl-faq__list">{items.map(([question, answer], index) => <button className={open === index ? 'is-open' : ''} type="button" key={question} onClick={() => setOpen(open === index ? -1 : index)}><span className="fl-faq__question">{question}</span><span className="fl-faq__toggle">{open === index ? '−' : '+'}</span>{open === index && <p>{answer}</p>}</button>)}</div>
    </div>
  </section>;
}

function LandingDean() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  useEffect(() => {
    if (!isVideoOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setIsVideoOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isVideoOpen]);
  return <section className="fl-dean-section"><div className="fl-dean fl-shell"><button className="fl-dean__video" type="button" onClick={() => setIsVideoOpen(true)} aria-label="Play Dean Chell Roberts video"><img src="/landing/updated/dean.png" alt="Dean Chell Roberts" /><span aria-hidden="true">▶</span><small>DEAN'S ADDRESS</small></button><div className="fl-dean__copy"><h3>A word from Dean Chell Roberts before you decide</h3><p>“We built this program for students who don’t just want a degree — they want mentors who know their name, research they can point to, and a direct runway into the California tech economy.”</p><small>Dean, Shiley-Marcos School of Engineering<br />University of San Diego</small></div></div>{isVideoOpen && <div className="fl-video-modal" role="dialog" aria-modal="true" aria-label="Dean Chell Roberts video" onClick={() => setIsVideoOpen(false)}><div className="fl-video-modal__content" onClick={(event) => event.stopPropagation()}><button className="fl-video-modal__close" type="button" onClick={() => setIsVideoOpen(false)} aria-label="Close video">×</button><iframe src="https://www.youtube.com/embed/-tDvrf5BfPk?autoplay=1&rel=0" title="Dean Chell Roberts message" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></div>}</section>;
}

function LandingFinalCta({ name }) {
  return <section className="fl-final-cta"><div className="fl-final-cta__inner"><div className="fl-final-cta__copy"><h2>A year from now, you’ll be glad you started today.</h2><div className="fl-final-cta__body"><p>Applications close <b>November 1, 2026.</b></p><p>Take the next step toward USD. We’ll help you navigate what comes next.</p></div><a className="fl-button fl-button-blue" href="#investment">Confirm Your Seat <img src="/landing/arrow-right.svg" alt="" /></a></div><div className="fl-final-cta__collage" aria-hidden="true"><figure className="fl-final-cta__photo fl-final-cta__photo--one"><img src="/landing/updated/cta-figma-1.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--two"><img src="/landing/updated/cta-figma-8.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--three"><img src="/landing/updated/cta-figma-7.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--four"><img src="/landing/updated/cta-figma-2.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--five"><img src="/landing/updated/cta-figma-12.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--six"><img src="/landing/updated/cta-figma-10.png" alt="" /></figure><figure className="fl-final-cta__photo fl-final-cta__photo--seven"><img src="/landing/updated/cta-figma-11.png" alt="" /></figure></div></div></section>;
}

function LifeAtUsdSection() {
  const moments = [
    ['01', 'MONTHS 0–1', '/landing/life/arrival-figma.png', 'Arrive, connect and find your feet.', 'Get to know the campus, meet your classmates and access the resources that help you settle into graduate school.'],
    ['02', 'MONTHS 1–4', '/landing/life/bazaar-figma.png', 'Experience the Torero spirit.', 'Join Weeks of Welcome, the Alcalá Bazaar and a range of clubs, cultural groups and student events.'],
    ['03', 'MONTHS 4–12', '/landing/life/career-fair-figma.png', 'Connect with industry.', 'Attend career fairs, industry talks and professional development events to build your network and explore what’s next.'],
    ['04', 'MONTHS 12–15', '/landing/life/campus-community-figma.png', 'Make campus your community.', 'Join student events, clubs and campus traditions, and find opportunities to explore your interests and meet people.'],
    ['05', 'FINAL MONTH', '/landing/life/graduate-overlay-figma.png', 'Bring it all together and take the next step.', 'Apply what you’ve learned through advanced coursework and real-world projects, and join a global community of 87,000+ USD alumni.'],
  ];
  return <section className="fl-life" aria-labelledby="life-title"><div className="fl-shell"><div className="fl-life__intro"><h2 id="life-title">See what life at USD has in <span>store for you.</span></h2><p>From your first welcome to the projects you take on and the people you meet, your time at USD is filled with experiences that can shape your future, inside and outside the classroom.</p></div><div className="fl-life__grid">{moments.map(([number, label, image, title, copy]) => <article key={number} className="fl-life-card"><div className="fl-life-card__meta"><b>{number}</b><span>{label}</span></div><img src={image} alt="" /><h3>{title}</h3><p>{copy}</p></article>)}</div><div className="fl-life__cta"><div><h3>Take a virtual tour of the campus in the city</h3><p>Walk under the arches, step inside the labs, and look out over Mission Bay - the whole campus is open to you, right from where you're sitting.</p><a className="fl-button fl-button-white" href="#investment">Explore Virtual campus tour</a></div><img src="/landing/capstone-campus.png" alt="University of San Diego campus" /></div></div></section>;
}

function Landing({ journey }) {
  const [program, setProgram] = useState(journey.program === 'Cyber Security' ? 'Cybersecurity (CSE)' : 'MS in Applied AI (AAI)');
  const [careerPage, setCareerPage] = useState(0);
  const studentName = journey.name.trim() || 'Aarav Sharma';
  const content = programContent[program];
  const enrollmentUrl = 'https://india.sandiego.edu/usd-enrollment-commitment-form/';
  const brochureUrl = 'https://drive.google.com/file/d/1D1nvlOijiGqCmVAjzRUOIb60_sWvGwLi/view?usp=drive_link';

  return <main className="figma-landing">
    <section className="fl-hero">
      <SharedNav className="shared-nav--landing" />
      <div className="fl-hero-copy">
        <h1>Welcome to USD, {studentName}!</h1>
        <p>Everything you need to know before you make your decision.</p>
        <div className="fl-actions">
          <a className="fl-button fl-button-blue" href={enrollmentUrl} target="_blank" rel="noreferrer">Confirm your seat</a>
          <a className="fl-button fl-button-white" href={brochureUrl} target="_blank" rel="noreferrer">Download Brochure <img src="/landing/download.svg" alt="" /></a>
        </div>
      </div>
      <FigmaLandingPass name={studentName} />
    </section>

    <section className="fl-rankings" id="why">
      <div className="fl-shell">
        <div className="fl-section-heading">
          <h2>One of America’s best and it <span>shows from day one</span></h2>
          <p>Consistently ranked among the top private universities in the United States for campus experience, high-impact career services, and graduate ROI.</p>
        </div>
        <div className="fl-ranking-grid">
          {rankingCards.map(([rank, title, source]) => <article key={rank + title}><strong>{rank}</strong><h3>{title}</h3><p>{source}</p></article>)}
        </div>
        <div className="fl-reason-grid">
          {usdReasons.map((reason, index) => <article key={reason}><img src={usdReasonImages[index]} alt="" /><div className="fl-reason-card__shade" /><p>{reason}</p><span>0{index + 1}</span></article>)}
        </div>
      </div>
    </section>

    <section className="fl-careers" id="program">
      <div className="fl-shell fl-careers-shell">
        <div className="fl-career-heading">
          <div className="fl-section-heading"><h2>Built to get you <span>hired</span></h2><p>{content.careerIntro}</p></div>
          <div className="fl-tabs" role="tablist" aria-label="Program outcomes">
            {['MS in Applied AI (AAI)', 'Cybersecurity (CSE)'].map((item) => <button key={item} type="button" className={program === item ? 'active' : ''} onClick={() => { setProgram(item); setCareerPage(0); }}>{item}</button>)}
          </div>
        </div>

        <article className="fl-outcomes-card">
          <div className="fl-salary"><span>GRADUATE OUTCOMES</span><div className="fl-salary__figures"><strong>{content.salary}</strong><p>Average salary reported by graduates of USD’s <b>{content.degree}.</b></p></div><small>Source: USD program page</small></div>
          <div className="fl-career-card__jobs"><div className="fl-career-card__jobs-head"><h3>Where could your skills take you?</h3><div className="fl-carousel-buttons"><ArrowButton direction="left" label="Previous career outcomes" onClick={() => setCareerPage(0)} disabled={careerPage === 0} /><ArrowButton direction="right" label="Next career outcomes" onClick={() => setCareerPage(1)} disabled={careerPage === 1} /></div></div><div aria-live="polite">{content.jobs.slice(careerPage * 2, careerPage * 2 + 2).map(([role, salary]) => <div className="fl-job" key={role}><span>{role}</span><b>{salary}</b></div>)}</div><small>U.S. salary benchmarks from the Career Outcomes Brochure.</small></div>
        </article>

        <article className="fl-employer-strip"><h3>Where Our Alumni &amp; Students Work</h3><EmployerTicker names={content.employers} /></article>

        <PeopleCarousel key={program} className="fl-alumni-panel" title="Meet the Indian alumni in your network." description="Graduates from USD’s on-campus, online and part-time programs — people who stood where you’re standing." previousLabel="Previous alumni" nextLabel="Next alumni">
          {(program === 'Cybersecurity (CSE)' ? cseAlumni : landingAlumni).map(([name, before, company, now], index) => <div className="fl-alumni-card" key={name}><div className="fl-person-head"><img className="fl-alumni-portrait" src={alumniPhotos[program][index]} alt={name} /><div><h4>{name}</h4><p>{before}</p></div></div><div className="fl-company">{alumniCompanyLogos[company] ? <img src={alumniCompanyLogos[company]} alt={company} /> : <strong>{company}</strong>}</div><div className="fl-down" aria-hidden="true">↓</div><div className="fl-now"><span>NOW</span><p>{now}</p></div></div>)}
        </PeopleCarousel>

        <PeopleCarousel className="fl-faculty-panel" title={content.facultyLabel} previousLabel="Previous faculty" nextLabel="Next faculty">
          {(program === 'Cybersecurity (CSE)' ? cseFaculty : facultyTestimonials).map(({ name, role, description, image }) => <div className="fl-testimonial-card" key={name}><div className="fl-testimonial-card__person"><img className="fl-faculty-portrait" src={image} alt={name} /><div><h4>{name}</h4><small>{role}</small></div></div><p>{description}</p></div>)}
        </PeopleCarousel>

        <article className="fl-capstone">
          <div><h3>{content.capstoneTitle}</h3><p>{content.capstoneCopy}</p><a className="fl-button fl-button-white" href={brochureUrl} target="_blank" rel="noreferrer">Download Brochure <img src="/landing/download.svg" alt="" /></a></div>
          <img src="/landing/capstone-campus.png" alt="University of San Diego campus" />
        </article>
      </div>
    </section>

    <InvestmentSection key={program} selectedProgram={program} studentName={studentName} />
    <LifeAtUsdSection />
    <LandingDean />
    <LandingFinalCta name={studentName} />
    <LandingFaq />
    <LandingFooter />
  </main>;
}

createRoot(document.getElementById('root')).render(window.location.pathname === '/cost-calculator' ? <CostCalculatorPage /> : <App />);
