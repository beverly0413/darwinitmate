import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Check, CheckCircle,
  Clock, ForkKnife, Hammer, Heart, MapPin, Minus, Plus, ShieldCheck,
  Sparkle, Star, TrendUp, Wrench,
} from "@phosphor-icons/react";

const demos = {
  "ember-salt": {
    brand: "Ember & Salt",
    type: "RESTAURANT",
    cta: "Reserve a table",
    className: "ember-demo",
  },
  northline: {
    brand: "Northline Handyman",
    type: "TRADES",
    cta: "Get an instant estimate",
    className: "northline-demo",
  },
  "kin-wellness": {
    brand: "Kin Wellness",
    type: "WELLNESS",
    cta: "Book a session",
    className: "kin-demo",
  },
  "territory-advisory": {
    brand: "Territory Advisory",
    type: "ADVISORY",
    cta: "Start assessment",
    className: "advisory-demo",
  },
};

function DemoHeader({ demo, action }) {
  return <header className="demo-header">
    <Link to="/work" className="demo-back"><ArrowLeft /> Darwin IT Mate work</Link>
    <strong className="demo-brand">{demo.brand}</strong>
    <nav><a href="#services">Services</a><a href="#about">About</a><button onClick={action}>{demo.cta}<ArrowUpRight /></button></nav>
  </header>;
}

function DemoNotice() {
  return <div className="demo-notice"><Sparkle /> Interactive concept website by Darwin IT Mate <Link to="/contact">Build yours <ArrowRight /></Link></div>;
}

function SuccessPanel({ title, copy, reset }) {
  return <div className="demo-success"><CheckCircle weight="fill" /><h3>{title}</h3><p>{copy}</p><button onClick={reset}>Start again</button></div>;
}

function RestaurantDemo() {
  const demo = demos["ember-salt"];
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guests, setGuests] = useState(2);
  return <main className={`industry-demo ${demo.className}`}>
    <DemoHeader demo={demo} action={() => setBooking(true)} />
    <section className="restaurant-hero">
      <div><p className="demo-kicker">TOP END PRODUCE · OPEN FIRE</p><h1>Darwin dining,<br /><em>turned up.</em></h1><p>A neighbourhood dining room celebrating the heat, colour and produce of Australia’s tropical north.</p><button onClick={() => setBooking(true)}>Reserve your table <ArrowRight /></button></div>
      <img src="/images/case-restaurant.png" alt="Ember and Salt restaurant dining experience" />
      <aside><span>TONIGHT</span><strong>Chef’s fire menu</strong><small>6 courses · $95 per person</small></aside>
    </section>
    <section className="restaurant-intro" id="about"><p>EMBER / SALT / SMOKE</p><h2>Familiar ingredients.<br />Unexpected fire.</h2><div><p>Our menu moves with the Top End seasons. Native botanicals, coastal seafood and local produce meet flame-led cooking in a relaxed Darwin dining room.</p><button onClick={() => setBooking(true)}>View tonight’s availability <ArrowRight /></button></div></section>
    <section className="restaurant-menu" id="services">
      <article><span>01</span><h3>Saltwater</h3><p>Local barramundi · smoked coconut · finger lime</p><strong>$38</strong></article>
      <article><span>02</span><h3>Open Fire</h3><p>Charred beef · native pepper · burnt onion</p><strong>$44</strong></article>
      <article><span>03</span><h3>Wet Season</h3><p>Mango · macadamia · lemon myrtle</p><strong>$18</strong></article>
    </section>
    {booking && <div className="demo-modal-backdrop" onMouseDown={() => setBooking(false)}><div className="demo-modal" onMouseDown={e => e.stopPropagation()}>
      <button className="demo-modal-close" onClick={() => setBooking(false)}>×</button>
      {!confirmed ? <><p className="demo-kicker">RESERVATIONS</p><h2>Your table awaits.</h2><label>Date<input type="date" defaultValue="2026-08-08" /></label><label>Time<select defaultValue="19:00"><option>17:30</option><option>18:30</option><option>19:00</option><option>20:00</option></select></label><label>Guests<div className="guest-stepper"><button onClick={() => setGuests(Math.max(1, guests - 1))}><Minus /></button><strong>{guests}</strong><button onClick={() => setGuests(Math.min(10, guests + 1))}><Plus /></button></div></label><button className="demo-submit" onClick={() => setConfirmed(true)}>Check availability <ArrowRight /></button></> : <SuccessPanel title="Table held." copy={`A table for ${guests} is ready to be confirmed. This is an interactive demonstration, so no real booking was created.`} reset={() => setConfirmed(false)} />}
    </div></div>}
    <DemoNotice />
  </main>;
}

const handymanServices = [
  ["Furniture assembly", 90], ["Wall mounting", 120], ["Minor repairs", 140], ["Door & lock fixes", 160],
];

function HandymanDemo() {
  const demo = demos.northline;
  const [selected, setSelected] = useState(handymanServices[0]);
  const [hours, setHours] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const estimate = selected[1] + Math.max(0, hours - 1) * 70;
  const scrollQuote = () => document.getElementById("northline-quote")?.scrollIntoView({ behavior: "smooth" });
  return <main className={`industry-demo ${demo.className}`}>
    <DemoHeader demo={demo} action={scrollQuote} />
    <section className="handyman-hero"><div><p className="demo-kicker">DARWIN’S RELIABLE HANDYMAN</p><h1>Jobs done right.<br /><span>Without the runaround.</span></h1><p>Fast, tidy home and property repairs across Darwin and Palmerston. Clear arrival windows and upfront estimates.</p><div><button onClick={scrollQuote}>Get an estimate <ArrowRight /></button><a href="tel:0400000000">Call 0400 000 000</a></div><ul><li><Check /> Licensed & insured</li><li><Check /> Same-week availability</li><li><Check /> Clear pricing</li></ul></div><img src="/images/case-handyman.png" alt="Northline handyman working on a property" /></section>
    <section className="trade-services" id="services">{[[Hammer,"Repairs"],[Wrench,"Installations"],[ShieldCheck,"Maintenance"]].map(([Icon,title],i)=><article key={title}><span>0{i+1}</span><Icon /><h3>{title}</h3><p>Practical help for the small jobs that keep your property working properly.</p></article>)}</section>
    <section className="quote-builder" id="northline-quote"><div><p className="demo-kicker">INSTANT ESTIMATOR</p><h2>Plan the job<br />before we arrive.</h2><p>Choose the closest service and estimated time for an indicative starting price.</p></div>{!submitted ? <div className="quote-tool"><label>Type of job<select value={selected[0]} onChange={e => setSelected(handymanServices.find(x => x[0] === e.target.value))}>{handymanServices.map(x => <option key={x[0]}>{x[0]}</option>)}</select></label><label>Estimated time<input type="range" min="1" max="6" value={hours} onChange={e => setHours(Number(e.target.value))} /><span>{hours} hour{hours > 1 ? "s" : ""}</span></label><div className="estimate"><small>INDICATIVE ESTIMATE</small><strong>${estimate}</strong><span>Final quote confirmed before work</span></div><button onClick={() => setSubmitted(true)}>Request this job <ArrowRight /></button></div> : <SuccessPanel title="Estimate saved." copy="This interactive concept demonstrates a lead-generation flow. No request was sent." reset={() => setSubmitted(false)} />}</section>
    <DemoNotice />
  </main>;
}

function WellnessDemo() {
  const demo = demos["kin-wellness"];
  const [service, setService] = useState("Remedial massage");
  const [time, setTime] = useState("");
  const [booked, setBooked] = useState(false);
  const scrollBook = () => document.getElementById("kin-book")?.scrollIntoView({ behavior: "smooth" });
  return <main className={`industry-demo ${demo.className}`}>
    <DemoHeader demo={demo} action={scrollBook} />
    <section className="wellness-hero"><div><p className="demo-kicker">MOVE · RECOVER · FEEL BETTER</p><h1>Care that meets<br />you where you are.</h1><p>Evidence-informed massage and movement therapy in a calm, inclusive Darwin studio.</p><button onClick={scrollBook}>Find your session <ArrowRight /></button></div><div className="wellness-orbit"><img src="/images/case-wellness.png" alt="Kin Wellness treatment space" /><span><Heart weight="fill" /> New clients welcome</span></div></section>
    <section className="wellness-services" id="services">{[["Remedial massage","60 min","$110"],["Recovery session","45 min","$85"],["Movement consult","60 min","$120"]].map(x=><button className={service===x[0]?"active":""} key={x[0]} onClick={()=>setService(x[0])}><Heart /><h3>{x[0]}</h3><p>A considered session tailored to how your body feels today.</p><span>{x[1]} · {x[2]}</span></button>)}</section>
    <section className="wellness-book" id="kin-book"><div><p className="demo-kicker">BOOK ONLINE</p><h2>A little time<br />for yourself.</h2><p>{service}</p></div>{!booked?<div className="calendar-tool"><div className="calendar-title"><Calendar /><strong>August 2026</strong></div><div className="date-row">{["Thu 06","Fri 07","Sat 08","Mon 10"].map((x,i)=><button key={x} className={i===1?"active":""}>{x}</button>)}</div><p>Available times</p><div className="time-row">{["9:00 am","11:30 am","2:00 pm","4:30 pm"].map(x=><button key={x} className={time===x?"active":""} onClick={()=>setTime(x)}>{x}</button>)}</div><button className="wellness-submit" disabled={!time} onClick={()=>setBooked(true)}>Continue with {time || "a time"} <ArrowRight /></button></div>:<SuccessPanel title="Session selected." copy={`${service} at ${time}. This is a demonstration and no appointment was created.`} reset={()=>{setBooked(false);setTime("");}} />}</section>
    <DemoNotice />
  </main>;
}

function AdvisoryDemo() {
  const demo = demos["territory-advisory"];
  const [answers, setAnswers] = useState([2, 2, 2]);
  const score = useMemo(() => Math.round(answers.reduce((a,b)=>a+b,0) / 9 * 100), [answers]);
  const update = (index, value) => setAnswers(current => current.map((x,i)=>i===index?value:x));
  const scrollAssessment = () => document.getElementById("advisory-assessment")?.scrollIntoView({ behavior: "smooth" });
  return <main className={`industry-demo ${demo.className}`}>
    <DemoHeader demo={demo} action={scrollAssessment} />
    <section className="advisory-hero"><div><p className="demo-kicker">STRATEGY FOR TERRITORY BUSINESS</p><h1>Clear decisions.<br />Confident growth.</h1><p>Commercial advice for Northern Territory businesses navigating growth, investment and operational change.</p><button onClick={scrollAssessment}>Assess your readiness <ArrowRight /></button></div><aside><TrendUp /><span>GROWTH BRIEF / 2026</span><strong>Opportunity is useful.<br />Clarity makes it valuable.</strong><div><small>MARKET</small><b>NT + AU</b></div><div><small>FOCUS</small><b>Practical growth</b></div></aside></section>
    <section className="advisory-pillars" id="services">{[["01","Strategy","Turn ambition into an executable commercial plan."],["02","Finance","Understand the numbers behind the next decision."],["03","Operations","Build systems that can support sustainable growth."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><ArrowUpRight /></article>)}</section>
    <section className="assessment" id="advisory-assessment"><div><p className="demo-kicker">2-MINUTE BUSINESS CHECK</p><h2>How ready are you<br />for the next stage?</h2><p>Move the sliders to get an indicative readiness score.</p></div><div className="assessment-tool">{[["Your growth plan is documented",0],["Cash-flow forecasting is current",1],["Your operating systems can scale",2]].map(([label,index])=><label key={label}>{label}<input type="range" min="1" max="3" value={answers[index]} onChange={e=>update(index,Number(e.target.value))}/><span><small>Not yet</small><small>In progress</small><small>Ready</small></span></label>)}<div className="score"><span style={{"--score":`${score}%`}}><strong>{score}</strong><small>/ 100</small></span><div><b>{score>75?"Ready to accelerate":score>50?"Good foundations":"Build the foundations"}</b><p>Your next step is a focused 30-minute growth conversation.</p></div></div><Link to="/contact">Discuss the result <ArrowRight /></Link></div></section>
    <DemoNotice />
  </main>;
}

export function CasePreview({ slug }) {
  if (slug === "ember-salt") return <div className="live-preview preview-ember"><div className="preview-nav"><b>EMBER & SALT</b><span>MENU · RESERVE</span></div><div><small>TOP END PRODUCE</small><strong>Darwin dining,<br />turned up.</strong><button>Reserve a table</button></div><i>LIVE DEMO</i></div>;
  if (slug === "northline") return <div className="live-preview preview-northline"><div className="preview-nav"><b>NORTHLINE</b><span>0400 000 000</span></div><div><small>RELIABLE HANDYMAN</small><strong>Jobs done right.</strong><p>Repairs · Installations · Maintenance</p><button>Get an estimate</button></div><i>LIVE DEMO</i></div>;
  if (slug === "kin-wellness") return <div className="live-preview preview-kin"><div className="preview-nav"><b>KIN</b><span>BOOK ONLINE</span></div><div><small>MOVE · RECOVER</small><strong>Care that meets<br />you where you are.</strong><button>Find a session</button></div><i>LIVE DEMO</i></div>;
  return <div className="live-preview preview-advisory"><div className="preview-nav"><b>TERRITORY / ADVISORY</b><span>2026</span></div><div><small>STRATEGY FOR NT BUSINESS</small><strong>Clear decisions.<br />Confident growth.</strong><button>Start assessment</button></div><i>LIVE DEMO</i></div>;
}

export function CaseStudyDemo({ slug }) {
  if (slug === "ember-salt") return <RestaurantDemo />;
  if (slug === "northline") return <HandymanDemo />;
  if (slug === "kin-wellness") return <WellnessDemo />;
  return <AdvisoryDemo />;
}
