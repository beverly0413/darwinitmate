import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle, Clock, Code, Desktop,
  DeviceMobile, GlobeHemisphereEast, List, MapPin, Monitor, ShieldCheck,
  Sparkle, Star, Wrench, X,
} from "@phosphor-icons/react";

const EASE = [0.22, 1, 0.36, 1];
const services = [
  { icon: Desktop, title: "Web design", copy: "A polished, mobile-first website designed to turn local visitors into real enquiries.", href: "/web-design" },
  { icon: Wrench, title: "IT support", copy: "Friendly help for computers, Wi-Fi, email, software, printers and everyday tech.", href: "/it-support" },
  { icon: ShieldCheck, title: "Ongoing care", copy: "Straightforward support after launch, without lock-ins or technical runaround.", href: "/pricing" },
];
const caseStudies = [
  { slug: "ember-salt", industry: "HOSPITALITY — CONCEPT", name: "Ember & Salt", image: "/images/case-restaurant.png", summary: "A cinematic booking-first experience for a modern Darwin restaurant.", result: "Booking-focused UX", accent: "copper" },
  { slug: "northline", industry: "TRADES — CONCEPT", name: "Northline", image: "/images/case-handyman.png", summary: "A confident mobile-first platform built to turn urgent searches into qualified jobs.", result: "Lead-first mobile UX", accent: "blue" },
  { slug: "kin-wellness", industry: "HEALTH — CONCEPT", name: "Kin Wellness", image: "/images/case-wellness.png", summary: "A calm, accessible digital presence with a clearer path to online bookings.", result: "Accessible booking path", accent: "teal" },
  { slug: "territory-advisory", industry: "PROFESSIONAL — CONCEPT", name: "Territory Advisory", image: "/images/case-advisory.png", summary: "A precise, credibility-led website for a growing professional advisory firm.", result: "Credibility-led design", accent: "navy" },
];
const CONTACT_EMAIL = "zzf0413@outlook.com";
const CONTACT_PHONE = "0466658664";
const BUSINESS_ABN = "90 566 093 288";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

async function sendEnquiry({ name = "", email = "", service = "General enquiry", message = "" }) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name,
      email,
      service,
      message,
      _subject: `Darwin IT Mate enquiry — ${service}`,
      _template: "table",
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === "false") {
    throw new Error(result.message || "The enquiry could not be sent.");
  }
  return result;
}

function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canvas || !finePointer.matches || reducedMotion.matches) return undefined;

    const context = canvas.getContext("2d");
    const points = [];
    let frame;
    let lastPoint = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addPoint = event => {
      const now = performance.now();
      if (now - lastPoint < 12) return;
      points.push({ x: event.clientX, y: event.clientY, life: 1, size: 2 + Math.random() * 2 });
      if (points.length > 26) points.shift();
      lastPoint = now;
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      points.forEach((point, index) => {
        point.life -= 0.032;
        if (point.life <= 0) return;
        const previous = points[index - 1];
        if (previous) {
          context.beginPath();
          context.moveTo(previous.x, previous.y);
          context.lineTo(point.x, point.y);
          context.strokeStyle = `rgba(37, 99, 235, ${point.life * .18})`;
          context.lineWidth = Math.max(.5, point.life * 1.4);
          context.stroke();
        }
        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 14);
        glow.addColorStop(0, `rgba(61, 214, 255, ${point.life * .72})`);
        glow.addColorStop(.3, `rgba(37, 99, 235, ${point.life * .3})`);
        glow.addColorStop(1, "rgba(37, 99, 235, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, 14, 0, Math.PI * 2);
        context.fill();
      });
      while (points[0]?.life <= 0) points.shift();
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", addPoint, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", addPoint);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: .72, delay, ease: EASE }}>{children}</motion.div>
  );
}

function Header({ openQuote }) {
  const [open, setOpen] = useState(false);
  const links = [["Web Design", "/web-design"], ["IT Support", "/it-support"], ["Work", "/work"], ["Pricing", "/pricing"], ["About", "/about"]];
  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <img src="/images/darwin-it-mate-logo.png" alt="Darwin IT Mate" />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => <NavLink key={href} to={href}>{label}</NavLink>)}
      </nav>
      <button className="btn btn-primary header-cta" onClick={openQuote}>Start a project <ArrowUpRight /></button>
      <button className="menu-button" aria-label="Open menu" onClick={() => setOpen(!open)}>{open ? <X /> : <List />}</button>
      <AnimatePresence>
        {open && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
          {links.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setOpen(false)}>{label}<ArrowRight /></NavLink>)}
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact <ArrowRight /></NavLink>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}

function Footer({ openQuote }) {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <p className="eyebrow light">READY WHEN YOU ARE</p>
          <h2>Let’s get it <em>sorted.</em></h2>
          <p>Clear pricing. Fast response. Local support.</p>
        </div>
        <div className="footer-actions">
          <button className="btn btn-primary" onClick={openQuote}>Start a project <ArrowRight /></button>
          <Link className="btn btn-outline-light" to="/contact">Get IT support <ArrowRight /></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Darwin IT Mate</span>
        <span>ABN {BUSINESS_ABN}</span>
        <span><MapPin /> Serving all of the Northern Territory</span>
        <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
    </footer>
  );
}

function QuoteModal({ open, close }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [sent, setSent] = useState(false);
  const [sendState, setSendState] = useState("idle");
  const [sendError, setSendError] = useState("");
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => { setStep(0); setService(""); setSent(false); setSendState("idle"); setSendError(""); }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);
  const choices = [
    ["A new website", "A clean, professional online presence", GlobeHemisphereEast],
    ["IT support", "Help with a computer, network or software issue", Wrench],
    ["Not sure yet", "Tell us what is happening and we’ll guide you", Sparkle],
  ];
  return <AnimatePresence>{open && (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}>
      <motion.div className="quote-modal" role="dialog" aria-modal="true" aria-label="Start a project"
        initial={{ opacity: 0, y: 30, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        transition={{ duration: .35, ease: EASE }} onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close"><X /></button>
        {!sent ? <>
          <div className="step-line"><span style={{ width: `${(step + 1) * 50}%` }} /></div>
          {step === 0 ? <>
            <p className="eyebrow">QUICK PROJECT BRIEF</p>
            <h3>What can we help with?</h3>
            <p className="modal-intro">Choose the closest option. This takes less than a minute.</p>
            <div className="choice-list">
              {choices.map(([title, copy, Icon]) => <button key={title} className={service === title ? "choice active" : "choice"} onClick={() => setService(title)}>
                <Icon /><span><strong>{title}</strong><small>{copy}</small></span><CheckCircle weight={service === title ? "fill" : "regular"} />
              </button>)}
            </div>
            <button className="btn btn-primary modal-next" disabled={!service} onClick={() => setStep(1)}>Continue <ArrowRight /></button>
          </> : <>
            <p className="eyebrow">ONE LAST STEP</p>
            <h3>Tell us where to reply.</h3>
            <form className="modal-form" onSubmit={async e => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              if (data.get("company_website")) return;
              setSendState("sending");
              setSendError("");
              try {
                await sendEnquiry({ name: data.get("name"), email: data.get("email"), service, message: data.get("message") });
                setSent(true);
                setSendState("sent");
              } catch (error) {
                setSendState("error");
                setSendError(error.message);
              }
            }}>
              <label className="hp-field" aria-hidden="true">Company website<input name="company_website" tabIndex="-1" autoComplete="off" /></label>
              <label>Name<input name="name" required placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
              <label>What do you need?<textarea name="message" required defaultValue={service === "A new website" ? "I’d like to discuss a new website." : service === "IT support" ? "I need help with an IT issue." : ""} /></label>
              {sendError && <p className="form-error" role="alert">{sendError} Please call Joseph on <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>.</p>}
              <p className="form-privacy">Your details are securely forwarded to Joseph through FormSubmit solely to respond to this enquiry.</p>
              <button className="btn btn-primary" disabled={sendState === "sending"}>{sendState === "sending" ? "Sending…" : "Send enquiry"} <ArrowRight /></button>
            </form>
          </>}
        </> : <div className="success-state"><CheckCircle weight="fill" /><p className="eyebrow">ENQUIRY SENT</p><h3>Thanks — it’s on its way.</h3><p>Joseph will reply directly to the email address you provided.</p><button className="btn btn-primary" onClick={close}>Done</button></div>}
      </motion.div>
    </motion.div>
  )}</AnimatePresence>;
}

function TrustBar() {
  return <div className="trust-bar">
    {[[MapPin, "Darwin local", "Proudly Territorian"], [Clock, "Fast response", "Usually same day"], [CheckCircle, "Clear pricing", "No surprises"], [ShieldCheck, "Great support", "Real people, real help"]].map(([Icon, a, b]) =>
      <div key={a}><Icon /><span><strong>{a}</strong><small>{b}</small></span></div>)}
  </div>;
}

function Home({ openQuote }) {
  return <main>
    <section className="hero">
      <motion.div className="hero-copy" initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, ease: EASE }}>
        <p className="eyebrow">DARWIN’S LOCAL DIGITAL PARTNER</p>
        <h1>Smart websites.<br />Reliable IT.<br /><em>Right here in Darwin.</em></h1>
        <p className="price-line">Websites from <strong>$150</strong></p>
        <p className="hero-lede">Professional websites for small businesses — and fast, friendly IT support when things go wrong.</p>
        <div className="button-row">
          <button className="btn btn-primary" onClick={openQuote}>Start a project <ArrowRight /></button>
          <Link className="btn btn-secondary" to="/it-support">Get IT support <ArrowRight /></Link>
        </div>
      </motion.div>
      <motion.div className="hero-media" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE }}>
        <img src="/images/hero-consultation.png" alt="IT consultant working with a Darwin small business owner" />
        <div className="availability"><span /><strong>Open every day</strong><small>7:00 am — 8:00 pm</small></div>
      </motion.div>
    </section>
    <TrustBar />

    <section className="intro-section">
      <Reveal><p className="eyebrow">WHAT WE DO</p><h2>Technology that works<br /><em>for your business.</em></h2></Reveal>
      <Reveal className="intro-copy" delay={.1}><p>From your first website to the IT behind it, we make the technical side feel straightforward.</p><Link to="/about" className="text-link">Why work with us <ArrowRight /></Link></Reveal>
    </section>

    <section className="split-service">
      <Reveal className="service-image"><img src="/images/web-design-showcase.png" alt="Premium small business website shown on a laptop" /></Reveal>
      <Reveal className="service-copy" delay={.1}>
        <p className="eyebrow accent">01 / WEB DESIGN</p><h2>Web design</h2>
        <p>Professional websites that look sharp, work smoothly and help your business grow.</p>
        <ul className="check-list">{["Custom, mobile-friendly design", "Built for speed and search", "Contact forms and maps", "Easy updates and handover"].map(x => <li key={x}><Check />{x}</li>)}</ul>
        <p className="mini-price">Websites from <strong>$150</strong></p>
        <Link to="/web-design" className="text-link">Explore web design <ArrowRight /></Link>
      </Reveal>
    </section>
    <section className="split-service reverse">
      <Reveal className="service-copy">
        <p className="eyebrow accent">02 / IT SUPPORT</p><h2>IT support</h2>
        <p>Fast resolution for the everyday tech issues that slow you down.</p>
        <ul className="check-list">{["Computers, Wi-Fi and networks", "Software, email and Microsoft 365", "Printers and peripherals", "Backup, recovery and setup"].map(x => <li key={x}><Check />{x}</li>)}</ul>
        <div className="button-row"><Link className="btn btn-primary" to="/contact">Get IT support <ArrowRight /></Link><Link className="text-link" to="/it-support">View support options <ArrowRight /></Link></div>
      </Reveal>
      <Reveal className="service-image" delay={.1}><img src="/images/it-support.png" alt="Local consultant providing IT support" /></Reveal>
    </section>

    <section className="process-section">
      <Reveal><p className="eyebrow centered">A BETTER WAY TO GET HELP</p><h2>Simple from the start</h2></Reveal>
      <div className="steps">{[
        ["01", "Get in touch", "Tell us what you need."], ["02", "We’ll assess", "We confirm the best approach."],
        ["03", "We get to work", "Clear communication throughout."], ["04", "You’re sorted", "Reliable results and support."]
      ].map((s, i) => <Reveal key={s[0]} className="step" delay={i * .08}><span>{s[0]}</span><div /><strong>{s[1]}</strong><p>{s[2]}</p></Reveal>)}</div>
    </section>

    <section className="selected-work">
      <Reveal className="work-heading"><div><p className="eyebrow">SELECTED WORK</p><h2>Built for real<br />local businesses.</h2></div><Link to="/work" className="text-link">View all case studies <ArrowRight /></Link></Reveal>
      <div className="work-grid">
        {caseStudies.slice(0, 2).map((item, i) => <Reveal className="work-card" delay={i * .1} key={item.slug}>
          <Link to="/work" className="work-image"><img src={item.image} alt={`${item.name} website case study`} /><span>View project <ArrowUpRight /></span></Link>
          <div className="work-meta"><div><p className="eyebrow">{item.industry}</p><h3>{item.name}</h3><p>{item.summary}</p></div><strong>{item.result}</strong></div>
        </Reveal>)}
      </div>
    </section>

    <section className="testimonial">
      <Reveal className="quote-mark">“</Reveal>
      <Reveal className="quote-copy" delay={.1}><blockquote>Friendly, straightforward technology help for homes and small businesses across the Northern Territory.</blockquote><p>— Joseph <span>Darwin IT Mate</span></p></Reveal>
      <Reveal className="rating" delay={.2}><div><Star weight="fill" /><Star weight="fill" /><Star weight="fill" /><Star weight="fill" /><Star weight="fill" /></div><strong>5.0</strong><small>LOCAL CUSTOMER RATING</small></Reveal>
    </section>
  </main>;
}

function PageHero({ eyebrow, title, italic, copy, action, children }) {
  return <section className="page-hero"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: EASE }}>
    <p className="eyebrow">{eyebrow}</p><h1>{title}<br /><em>{italic}</em></h1><p>{copy}</p>{action}
  </motion.div>{children}</section>;
}

function WebDesign({ openQuote }) {
  const navigate = useNavigate();
  return <main>
    <PageHero eyebrow="PROFESSIONAL WEBSITE / $150 AUD" title="The complete professional build." italic="Without the $300 price tag."
      copy="The same core deliverables businesses commonly expect from a $300 website package — strategic structure, custom styling, responsive development, SEO foundations and a direct enquiry system."
      action={<button className="btn btn-primary" onClick={openQuote}>Build my website <ArrowRight /></button>}>
      <img src="/images/web-design-showcase.png" alt="Website design presented on a laptop" />
    </PageHero>
    <section className="feature-grid">
      <Reveal className="feature-lead"><p className="eyebrow">BUILT TO DO A JOB</p><h2>More than a good-looking homepage.</h2><p>Every page is structured around what your customer needs to know, feel and do next.</p></Reveal>
      {[[DeviceMobile, "Responsive by default", "Designed to feel considered on mobile, tablet and desktop."], [Sparkle, "Distinctive design", "A clear visual system tailored to your business, not a recycled theme."], [Code, "Fast and dependable", "Clean, efficient technology with no unnecessary weight."], [GlobeHemisphereEast, "Ready to be found", "Search-friendly structure, metadata and local SEO foundations."]].map(([Icon, t, c], i) =>
        <Reveal className="feature-item" delay={i * .07} key={t}><Icon /><h3>{t}</h3><p>{c}</p></Reveal>)}
    </section>
    <section className="package-section">
      <Reveal><p className="eyebrow">PROFESSIONAL LAUNCH PACKAGE</p><h2>$300-level essentials.<br />Darwin price: $150.</h2><p className="big-price">$150 <small>AUD · ONE-OFF</small></p><p className="package-value">No cut-down template. No hidden design fee. A complete, professionally finished business website.</p></Reveal>
      <Reveal className="package-card" delay={.1}>
        <span className="package-badge">FULL PROFESSIONAL PACKAGE</span>
        {["Custom-designed, conversion-focused landing page", "Responsive across mobile, tablet and desktop", "Direct-to-email enquiry form and Google Map", "On-page SEO, metadata and local search foundations", "Speed, image and performance optimisation", "Social links, click-to-call and clear customer actions", "Domain connection, launch and personal handover", "Two rounds of design refinements"].map(x => <div key={x}><CheckCircle weight="fill" />{x}</div>)}
        <button className="btn btn-primary" onClick={openQuote}>Claim the $150 professional build <ArrowRight /></button>
        <p>Need more pages, booking, e-commerce or custom functionality? We’ll quote it clearly before we begin.</p>
      </Reveal>
    </section>
    <section className="work-preview"><Reveal><p className="eyebrow light">MORE AMBITION?</p><h2>More pages. More capability.<br /><em>Built around your business.</em></h2><button className="btn btn-light" onClick={() => navigate("/pricing")}>View all packages <ArrowRight /></button></Reveal></section>
  </main>;
}

function ITSupport() {
  const issues = ["Slow computers", "Wi-Fi and internet", "Email and Microsoft 365", "Printers and devices", "Software and updates", "Backup and recovery"];
  const [active, setActive] = useState(issues[0]);
  return <main>
    <PageHero eyebrow="LOCAL IT SUPPORT" title="Practical help." italic="No technical runaround."
      copy="Responsive IT support for homes and small businesses across the Northern Territory — explained clearly and solved properly."
      action={<Link className="btn btn-primary" to="/contact">Request support <ArrowRight /></Link>}>
      <img src="/images/it-support.png" alt="Friendly local IT support in Darwin" />
    </PageHero>
    <section className="issue-finder">
      <Reveal><p className="eyebrow">ISSUE FINDER</p><h2>What’s slowing you down?</h2><p>Choose an issue to see how we can help.</p></Reveal>
      <Reveal className="issue-panel" delay={.1}>
        <div className="issue-tabs">{issues.map(i => <button className={active === i ? "active" : ""} key={i} onClick={() => setActive(i)}>{i}<ArrowRight /></button>)}</div>
        <AnimatePresence mode="wait"><motion.div key={active} className="issue-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Monitor /><p className="eyebrow">WE CAN HELP WITH</p><h3>{active}</h3><p>We’ll assess the cause, explain the options in plain English and get you back to work with as little disruption as possible.</p><Link className="text-link" to="/contact">Get help now <ArrowRight /></Link></motion.div></AnimatePresence>
      </Reveal>
    </section>
    <section className="support-modes">
      <Reveal><p className="eyebrow">FLEXIBLE SUPPORT</p><h2>Help where you need it.</h2></Reveal>
      <div>{[["Remote", "For software, email and setup issues, Joseph can help securely without a visit."], ["On-site", "Hands-on support across the Northern Territory by arrangement, with travel confirmed before booking."], ["Ongoing", "Affordable monthly support from $69 for homes and micro businesses that need regular help."]].map((x, i) => <Reveal className="mode" delay={i * .08} key={x[0]}><span>0{i + 1}</span><h3>{x[0]}</h3><p>{x[1]}</p></Reveal>)}</div>
    </section>
  </main>;
}

function Pricing({ openQuote }) {
  const plans = [
    { name: "Professional Launch", price: "$150", tag: "A complete professional website package with the core value commonly found in $300 offers", premium: true, badge: "BEST VALUE", items: ["Custom conversion-led design", "Responsive development", "Direct enquiry form + map", "SEO and performance setup", "Two refinement rounds", "Domain connection and launch"] },
    { name: "Business", price: "Custom", tag: "For businesses ready to grow", featured: true, items: ["Up to 5 tailored pages", "Custom page sections", "Advanced enquiry forms", "Local SEO setup", "Analytics and handover"] },
    { name: "IT Care", price: "$69/mo", tag: "Affordable ongoing help for homes and micro businesses", items: ["Remote help and guidance", "Remote computer setup $150", "On-site computer setup $220", "NT-wide service by arrangement", "Clear quote before work"] },
  ];
  return <main>
    <PageHero eyebrow="CLEAR PRICING" title="Start simple." italic="Scale when you need to." copy="No vague agency retainers or surprise add-ons. We confirm the scope and price before the work begins." />
    <section className="pricing-grid">{plans.map((p, i) => <Reveal key={p.name} className={`price-card ${p.featured ? "featured" : ""} ${p.premium ? "premium" : ""}`} delay={i * .08}>
      {(p.featured || p.premium) && <span className="popular">{p.badge || "MOST POPULAR"}</span>}<p className="eyebrow">{p.name}</p><h2>{p.price}</h2><p>{p.tag}</p><div>{p.items.map(x => <span key={x}><Check />{x}</span>)}</div><button className={`btn ${p.featured || p.premium ? "btn-primary" : "btn-secondary"}`} onClick={openQuote}>Choose {p.name} <ArrowRight /></button>
    </Reveal>)}</section>
    <p className="pricing-note">All prices are confirmed before work begins. Travel or accommodation charges may apply outside Darwin and will always be quoted first.</p>
    <Faq />
  </main>;
}

function Work({ openQuote }) {
  return <main>
    <PageHero eyebrow="SELECTED CLIENT WORK" title="Different industries." italic="One clear standard."
      copy="Strategic websites designed around how each business wins trust, attracts customers and turns attention into action."
      action={<button className="btn btn-primary" onClick={openQuote}>Discuss your project <ArrowRight /></button>} />
    <section className="portfolio-intro">
      <Reveal><p className="eyebrow">BUILT WITH PURPOSE</p><h2>Design that understands<br />the business behind it.</h2></Reveal>
      <Reveal delay={.1}><p>Every industry has a different customer, buying decision and moment of trust. These concepts show how the same high standard can flex from hospitality to trades, health and professional services.</p></Reveal>
    </section>
    <section className="portfolio-list">
      {caseStudies.map((item, i) => <Reveal className={`portfolio-case ${i % 2 ? "case-reverse" : ""}`} key={item.slug}>
        <div className="case-visual"><img src={item.image} alt={`${item.name} responsive website project`} /><span className={`case-index ${item.accent}`}>0{i + 1}</span></div>
        <div className="case-details">
          <p className="eyebrow">{item.industry}</p><h2>{item.name}</h2><p>{item.summary}</p>
          <dl><div><dt>FOCUS</dt><dd>{i === 0 ? "Brand, menu & bookings" : i === 1 ? "Local SEO & lead generation" : i === 2 ? "Accessibility & online booking" : "Credibility & consultation leads"}</dd></div><div><dt>OUTCOME</dt><dd>{item.result}</dd></div></dl>
          <button className="text-link case-link" onClick={openQuote}>Build something like this <ArrowRight /></button>
        </div>
      </Reveal>)}
    </section>
    <section className="case-cta"><Reveal><p className="eyebrow light">YOUR INDUSTRY, YOUR ADVANTAGE</p><h2>Ready to become<br />the obvious choice?</h2><button className="btn btn-light" onClick={openQuote}>Start your project <ArrowRight /></button></Reveal></section>
  </main>;
}

function Faq() {
  const qs = [
    ["What does the $150 website include?", "A complete professional one-page business website: custom styling, responsive development, a direct enquiry form, Google Map, click-to-call actions, on-page SEO, performance optimisation, domain connection, two refinement rounds and launch support."],
    ["How quickly can you build it?", "Most starter websites can be designed and launched within 5–7 business days once content and feedback are ready."],
    ["Do you offer on-site IT support?", "Yes. We provide on-site support across Darwin and remote support when the issue can be solved faster online."],
    ["Can you look after the website after launch?", "Absolutely. We can arrange updates, improvements and general support as your business grows."],
  ];
  const [open, setOpen] = useState(0);
  return <section className="faq"><Reveal><p className="eyebrow">COMMON QUESTIONS</p><h2>Good to know.</h2></Reveal><div>
    {qs.map(([q, a], i) => <div className="faq-item" key={q}><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{q}</span><span>{open === i ? "−" : "+"}</span></button><AnimatePresence>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{a}</motion.p>}</AnimatePresence></div>)}
  </div></section>;
}

function About({ openQuote }) {
  return <main>
    <PageHero eyebrow="ABOUT DARWIN IT MATE" title="Big-agency care." italic="Local-business simplicity."
      copy="Joseph provides practical, affordable technology support to homes and small businesses throughout the Northern Territory."
      action={<button className="btn btn-primary" onClick={openQuote}>Work with us <ArrowRight /></button>}>
      <img src="/images/hero-consultation.png" alt="Darwin IT Mate working with a local business" />
    </PageHero>
    <section className="manifesto"><Reveal><p className="eyebrow">OUR APPROACH</p><h2>Listen carefully.<br />Explain clearly.<br /><em>Do the work properly.</em></h2></Reveal><Reveal delay={.1}><p>There is enough jargon in technology already. We focus on practical outcomes, honest communication and thoughtful work that gives small businesses confidence.</p><p>That means a website designed around your customers, not a template checklist. It means troubleshooting the real issue, not selling you something you do not need.</p></Reveal></section>
    <section className="values">{[["01", "Local by design", "Darwin is not an afterthought. We understand the pace, people and practical needs of Top End businesses."], ["02", "Clear from day one", "You will always know what we are doing, why it matters and what it will cost."], ["03", "Made to last", "Good work should keep working. We build carefully and stay available when you need us."]].map((x, i) => <Reveal className="value" delay={i * .08} key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></Reveal>)}</section>
  </main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [sendState, setSendState] = useState("idle");
  const [sendError, setSendError] = useState("");
  return <main className="contact-page">
    <section className="contact-intro"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}><p className="eyebrow">GET IN TOUCH</p><h1>Tell us what<br /><em>you need.</em></h1><p>Website project, frustrating IT issue or something in between — send a few details and we’ll point you in the right direction.</p></motion.div>
      <div className="contact-details"><div><small>CONTACT</small><span>Joseph</span></div><div><small>PHONE</small><a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a></div><div><small>EMAIL</small><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div><div><small>ABN</small><span>{BUSINESS_ABN}</span></div><div><small>HOURS</small><span>Every day, 7:00 am — 8:00 pm</span></div><div><small>SERVICE AREA</small><span>All of the Northern Territory</span></div></div>
    </section>
    <section className="contact-form-wrap">
      {!sent ? <form onSubmit={async e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (data.get("company_website")) return;
        setSendState("sending");
        setSendError("");
        try {
          await sendEnquiry({ name: data.get("name"), email: data.get("email"), service: data.get("service"), message: data.get("message") });
          setSent(true);
          setSendState("sent");
        } catch (error) {
          setSendState("error");
          setSendError(error.message);
        }
      }}>
        <label className="hp-field" aria-hidden="true">Company website<input name="company_website" tabIndex="-1" autoComplete="off" /></label>
        <div className="form-grid"><label>Your name<input name="name" required placeholder="Jane Smith" /></label><label>Email address<input name="email" type="email" required placeholder="jane@business.com.au" /></label></div>
        <label>What can we help with?<select name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Website design</option><option>IT support</option><option>Both</option><option>Something else</option></select></label>
        <label>Tell us a little more<textarea name="message" required placeholder="A few details about your project or IT issue..." /></label>
        {sendError && <p className="form-error" role="alert">{sendError} Please call Joseph on <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>.</p>}
        <p className="form-privacy">Your details are securely forwarded to Joseph through FormSubmit solely to respond to this enquiry.</p>
        <button className="btn btn-primary" disabled={sendState === "sending"}>{sendState === "sending" ? "Sending…" : "Send enquiry"} <ArrowRight /></button>
      </form> : <motion.div className="form-success" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><CheckCircle weight="fill" /><p className="eyebrow">ENQUIRY SENT</p><h2>Thanks — it’s on its way.</h2><p>Joseph will reply directly to the email address you provided.</p></motion.div>}
    </section>
  </main>;
}

function Shell() {
  const [quote, setQuote] = useState(false);
  return <><CursorTrail /><ScrollTop /><Header openQuote={() => setQuote(true)} /><Routes>
    <Route path="/" element={<Home openQuote={() => setQuote(true)} />} />
    <Route path="/web-design" element={<WebDesign openQuote={() => setQuote(true)} />} />
    <Route path="/it-support" element={<ITSupport />} />
    <Route path="/pricing" element={<Pricing openQuote={() => setQuote(true)} />} />
    <Route path="/work" element={<Work openQuote={() => setQuote(true)} />} />
    <Route path="/about" element={<About openQuote={() => setQuote(true)} />} />
    <Route path="/contact" element={<Contact />} />
  </Routes><Footer openQuote={() => setQuote(true)} /><QuoteModal open={quote} close={() => setQuote(false)} /></>;
}

export function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}
