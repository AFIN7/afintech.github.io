import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BOOT_LINES = [
  { cmd: 'whois afin.qd.je', out: 'Domain located. Owner: AFIN 7 — Kochi, IN', outClass: 'out-dim' },
  { cmd: 'dig afin.qd.je +short', out: '76.76.21.21  →  vercel-dns', outClass: 'out-dim' },
  { cmd: 'nmap -sV afin.qd.je', out: '443/tcp open  https   verified', outClass: 'out-green' },
  { cmd: 'whoami', out: 'AFIN — builder / breaker', outClass: 'out-green' },
];

function useReveal(ref, opts = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        ...opts,
      }
    );
  }, [ref, opts]);
}

function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

function Terminal({ onDone }) {
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | output | done

  useEffect(() => {
    if (lineIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => onDone && onDone(), 300);
      return () => clearTimeout(t);
    }
    const target = BOOT_LINES[lineIdx].cmd;
    if (phase === 'typing') {
      if (typing.length < target.length) {
        const t = setTimeout(() => setTyping(target.slice(0, typing.length + 1)), 26 + Math.random() * 30);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('output'), 200);
        return () => clearTimeout(t);
      }
    } else if (phase === 'output') {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, BOOT_LINES[lineIdx]]);
        setTyping('');
        setLineIdx((i) => i + 1);
        setPhase('typing');
      }, 260);
      return () => clearTimeout(t);
    }
  }, [typing, phase, lineIdx, onDone]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="r" /><span className="y" /><span className="g" />
        <span className="terminal-title">afin 7: ~/recon</span>
      </div>
      <div className="terminal-body">
        {lines.map((l, i) => (
          <div className="terminal-line" key={i}>
            <span className="prompt-user">afin 7</span>
            <span className="prompt-path">:~$ </span>
            <span className="cmd-text">{l.cmd}</span>
            <br />
            <span className={l.outClass}>{l.out}</span>
          </div>
        ))}
        {lineIdx < BOOT_LINES.length && (
          <div className="terminal-line">
            <span className="prompt-user">afin 7</span>
            <span className="prompt-path">:~$ </span>
            <span className="cmd-text">{typing}</span>
            <span className="cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

function ScrambleTitle({ text, start }) {
  const [display, setDisplay] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#01';
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const totalFrames = 22;
    const iv = setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { out += ' '; continue; }
        if (i < revealCount) out += text[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(out);
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(iv);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [start, text]);
  return <span className="glitch">{display || text.replace(/[^\s]/g, ' ')}</span>;
}

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.12;
      try {
        await audio.play();
        setSoundOn(true);
      } catch (error) {
        console.error('Ambient audio could not play:', error);
        setSoundOn(false);
      }
    } else {
      audio.pause();
      setSoundOn(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/ambient.mp3"
        loop
        preload="auto"
        onPlay={() => setSoundOn(true)}
        onPause={() => setSoundOn(false)}
      />

      <nav className="nav">
        <div className="nav-mark"><span className="dot" />AFIN 7.</div>
        <div className="nav-links">
          <a href="#approach">Approach</a>
          <a href="#skills">Skills</a>
          <a href="#notes">Field Notes</a>
          <a href="#work">Work</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
          <button className="sound-toggle" onClick={toggleSound} aria-label="Toggle ambient sound" type="button">
            {soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <Terminal onDone={() => setBootDone(true)} />
          <h1 className="hero-title">
            <ScrambleTitle text="AFIN 7." start={bootDone} />
          </h1>
          <p className="hero-tagline">
            <span className="accent">Building</span> full-stack software by day, <span className="accent">breaking</span> into offensive security by night. Kochi, India — self-taught, self-directed.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#work">Explore Work →</a>
            <a className="btn btn-ghost" href="#contact">Get In Touch</a>
          </div>
        </div>
      </section>

      <section className="section" id="approach">
        <div className="container">
          <Reveal>
            <div className="eyebrow">The Approach</div>
            <h2 className="section-title">I build systems, then try to break them.</h2>
            <p className="section-lede">
              Most developers stop at "it works." I keep going until I've asked how it fails — what a malicious request looks like, where a secret might leak, what an attacker sees that I don't. That loop between building and probing is the whole method.
            </p>
          </Reveal>
          <div className="approach-grid">
            <Reveal delay={0.1} className="approach-card build">
              <div className="tag">01 · Build</div>
              <h3>Ship real, working software</h3>
              <p>React, Node.js, Python, TypeScript. I care about interfaces that feel considered and backends that don't fall over — learned by shipping projects end to end, not just tutorials.</p>
            </Reveal>
            <Reveal delay={0.2} className="approach-card break">
              <div className="tag">02 · Break</div>
              <h3>Think like an attacker</h3>
              <p>Kali Linux, OSINT tooling, TryHackMe rooms, and recon sessions run against my own infrastructure. Every project I ship, I also try to take apart.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Toolkit</div>
            <h2 className="section-title">Two stacks, one habit of mind.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="skills-grid">
              <div className="skill-col build">
                <h4>Build</h4>
                <div className="skill-list">
                  {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Expo / React Native', 'Supabase', 'REST APIs'].map((s) => (
                    <span className="skill-chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="skill-col break">
                <h4>Break</h4>
                <div className="skill-list">
                  {['Kali Linux', 'OSINT Recon', 'theHarvester', 'Amass / Sublist3r', 'dnsenum / dnsrecon', 'crt.sh', 'TryHackMe', 'Ethical Hacking Fundamentals'].map((s) => (
                    <span className="skill-chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="notes">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Field Notes</div>
            <h2 className="section-title">Recon session: my own domain, under my own microscope.</h2>
            <p className="section-lede">
              Proof of practice, not just a skills list. I ran a full OSINT pass against this portfolio's own infrastructure to see it the way an outsider would.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="note-block">
            <div className="note-header">
              <h3>Network OSINT on afin.qd.je</h3>
              <span className="status">● Completed</span>
            </div>
            <div className="note-body">
              <p>
                Worked through DNS enumeration, subdomain discovery, and historical archive lookups end to end — cross-checking every tool's output rather than trusting a single source.
              </p>
              <div className="tool-row">
                {['whois', 'dig', 'theHarvester', 'sublist3r', 'amass', 'dnsenum', 'dnsrecon', 'crt.sh', 'Wayback CDX API'].map((t) => (
                  <span className="tool-pill" key={t}>{t}</span>
                ))}
              </div>
              <div className="note-finding">
                <strong>Key lesson —</strong> theHarvester returned false positives that looked plausible at a glance. Validating every hit against <code>dig</code> directly caught the noise before it became a wrong conclusion.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="work">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Featured Work</div>
            <h2 className="section-title">Things I've shipped and am still shipping.</h2>
          </Reveal>
          <div className="work-list">
            {[
              {
                n: '01',
                title: 'Jarvis — Local AI Voice Assistant',
                desc: 'A fully local voice assistant built in Python using Ollama (llama3.2), speech recognition, and text-to-speech — no paid APIs. Solved real WASAPI microphone and engine-reuse bugs along the way.',
                stack: ['Python', 'Ollama', 'pyttsx3', 'SpeechRecognition'],
                status: 'Live', statusClass: 'live',
              },
              {
                n: '02',
                title: 'This Portfolio',
                desc: 'Cyberpunk-themed portfolio with a Supabase-backed resume gate, lead capture, and a custom admin dashboard with CSV export — built, deployed, then OSINT-tested against itself.',
                stack: ['HTML/CSS/JS', 'Supabase', 'GitHub Pages'],
                status: 'Live', statusClass: 'live',
              },
              {
                n: '03',
                title: 'Ride Tracker',
                desc: 'A motorcycle ride-tracking app with GPS auto-tracking, route replay maps, and a dark UI — built for the R15 community, headed for the Play Store.',
                stack: ['Expo', 'React Native', 'Supabase'],
                status: 'In Progress', statusClass: 'progress',
              },
            ].map((w) => (
              <Reveal as="div" key={w.n} className="work-item">
                <div className="work-index">{w.n}</div>
                <div className="work-main">
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <div className="work-stack">
                    {w.stack.map((s) => <span key={s}>{s}</span>)}
                  </div>
                </div>
                <div className={`work-status ${w.statusClass}`}>{w.status}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="journey">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Journey</div>
            <h2 className="section-title">Self-taught, self-directed.</h2>
          </Reveal>
          <div className="journey">
            {[
              { d: 'Start', t: 'Full-Stack Roadmap', p: 'Began a structured five-month path — React, Node/Express, PostgreSQL, React Native — with freeCodeCamp\'s Responsive Web Design cert as the first milestone.' },
              { d: 'Build', t: 'Jarvis AI Assistant', p: 'Built a fully local voice assistant from scratch, working through real hardware and PATH issues instead of shortcuts.' },
              { d: 'Break', t: 'First OSINT Session', p: 'Ran a hands-on network reconnaissance session on Kali Linux against my own infrastructure — the first time security stopped being theory.' },
              { d: 'Now', t: 'Portfolio Relaunch', p: 'Repositioned this site from "Full-Stack Developer" to "Cybersecurity Enthusiast" — SEO, structured data, and a rebuilt skills layout to match where I\'m headed.' },
            ].map((j) => (
              <Reveal as="div" key={j.t} className="journey-item">
                <div className="journey-date">{j.d}</div>
                <h4>{j.t}</h4>
                <p>{j.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Get In Touch</div>
            <h2 className="section-title">Open to opportunities, collaborations, and interesting problems.</h2>
          </Reveal>
          <div className="contact-grid">
            <Reveal delay={0.1} className="contact-info">
              <div className="row"><span>Email</span><a href="mailto:mohammedafinm@gmail.com">mohammedafinm@gmail.com</a></div>
              <div className="row"><span>Location</span><span className="val">Kochi, India</span></div>
              <div className="row"><span>GitHub</span><a href="https://github.com/AFIN7" target="_blank" rel="noreferrer">github.com/AFIN7</a></div>
              <div className="row"><span>Instagram</span><a href="https://instagram.com/4fin.7" target="_blank" rel="noreferrer">@4fin.7</a></div>
            </Reveal>
            <Reveal delay={0.2} as="form" className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your name" />
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" />
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={4} placeholder="What's on your mind?" />
              <button className="btn btn-primary" type="submit" style={{ marginTop: 6 }}>Send Message</button>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="container">
        <span>© 2026 AFIN 7. — Built &amp; secured by hand.</span>
        <div className="socials">
          <a href="https://github.com/AFIN7" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://instagram.com/4fin.7" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:mohammedafinm@gmail.com">Email</a>
        </div>
      </footer>
    </>
  );
}
