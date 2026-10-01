"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Menu,
  Pause,
  Play,
  Plus,
  X,
  Zap,
} from "lucide-react";
import { compoundScenario, possibilities, sources } from "@/lib/content";
import ParticleSculpture from "./particle-sculpture";
import {
  Blocks,
  CostChart,
  Crystal,
  Helix,
  Orbital,
  ProteinCloud,
} from "./visuals";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#top"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Don’t Stop home"
    >
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        DON’T STOP<span className="brand-period">.</span>
      </span>
    </a>
  );
}

function SectionLabel({
  number,
  children,
  dark = false,
}: {
  number: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`section-label mono ${dark ? "label-dark" : ""}`}>
      <span className="section-number">{number}</span>
      <span>{children}</span>
    </div>
  );
}

function Reveal({
  children,
  className = "",
  enabled,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  enabled: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={enabled ? { opacity: 0, y: 32 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  value,
  enabled,
  decimals = 0,
}: {
  value: number;
  enabled: boolean;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  useEffect(() => {
    if (!inView) return;
    const control = animate(count, value, {
      duration: enabled ? 1.7 : 0,
      ease: [0.16, 1, 0.3, 1],
    });
    return control.stop;
  }, [inView, enabled, count, value]);
  return (
    <span className="counter" ref={ref}>
      <span className="sr-only">{value.toFixed(decimals)}</span>
      <motion.span aria-hidden="true">{rounded}</motion.span>
    </span>
  );
}

function Possibilities({ enabled }: { enabled: boolean }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  useMotionValueEvent(scrollYProgress, "change", (latest) =>
    setActive(Math.min(3, Math.round(latest * 3))),
  );
  useEffect(() => {
    const node = viewport.current;
    const inner = track.current;
    if (!node || !inner) return;
    const observer = new ResizeObserver(() => {
      const rightInset = Number.parseFloat(getComputedStyle(node).paddingRight);
      setDistance(
        Math.max(0, inner.scrollWidth - node.clientWidth + rightInset),
      );
    });
    observer.observe(node);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);
  const artworks = {
    helix: Helix,
    orbital: Orbital,
    blocks: Blocks,
    crystal: Crystal,
  };
  return (
    <section
      id="possibilities"
      ref={section}
      className={`possibilities-section ${enabled ? "is-animated" : "is-static"}`}
      aria-labelledby="possibilities-heading"
    >
      <div className="possibilities-sticky">
        <div className="section-heading wrap">
          <div>
            <SectionLabel number="02">THE POSSIBILITY SPACE</SectionLabel>
            <h2 id="possibilities-heading">
              Not just smarter machines.
              <br />
              <span className="muted">Better human lives.</span>
            </h2>
          </div>
          <p className="section-intro">
            This is what we’re building toward.
            <br />
            More capability. More people with a chance.
          </p>
        </div>
        <div ref={viewport} className="gallery-viewport">
          <motion.div
            ref={track}
            className="possibility-track"
            style={enabled ? { x } : undefined}
          >
            {possibilities.map((item) => {
              const Art = artworks[item.type];
              return (
                <article
                  className={`possibility-card possibility-${item.color}`}
                  key={item.id}
                >
                  <div className="possibility-card-top mono">
                    <span>{item.label}</span>
                    <span>{item.number} / 04</span>
                  </div>
                  <div className="art-window">
                    <Art />
                    <span
                      className="art-cross art-cross-one"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span
                      className="art-cross art-cross-two"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </div>
                  <div className="possibility-card-copy">
                    <h3>
                      {item.title.split("\n").map((line, i) => (
                        <span key={line}>
                          {line}
                          {i === 0 && <br />}
                        </span>
                      ))}
                    </h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="possibility-card-bottom mono">
                    <span>{item.signal}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
        <div className="gallery-footer wrap mono">
          <span>POSSIBILITIES, NOT PROMISED TIMELINES.</span>
          <div className="gallery-pagination" aria-hidden="true">
            {possibilities.map((item, i) => (
              <span key={item.id} className={active === i ? "active" : ""} />
            ))}
            <span className="gallery-count">
              0{active + 1} <span>/ 04</span>
            </span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Compounding({ enabled }: { enabled: boolean }) {
  const [rate, setRate] = useState(20);
  const [delay, setDelay] = useState(3);
  const result = compoundScenario(rate, delay);
  const path = (paused: boolean) =>
    Array.from({ length: 61 }, (_, i) => {
      const year = (i / 60) * 10;
      const progress = Math.pow(
        1 + rate / 100,
        paused ? Math.max(0, year - delay) : year,
      );
      // Keep server and browser path strings identical across JS engines.
      return `${i === 0 ? "M" : "L"}${(45 + year * 58).toFixed(3)},${(263 - (progress / result.now) * 215).toFixed(3)}`;
    }).join(" ");
  return (
    <section
      id="compounding"
      className="compound-section"
      aria-labelledby="compound-heading"
    >
      <div className="wrap">
        <Reveal enabled={enabled} className="compound-heading">
          <SectionLabel number="03" dark>
            THE COMPOUNDING EFFECT
          </SectionLabel>
          <h2 id="compound-heading">
            Time doesn’t
            <br />
            wait for us<span>.</span>
          </h2>
          <p>
            Small gains stack up.
            <br />
            So does the cost of starting later.
          </p>
        </Reveal>
        <div className="compound-grid">
          <Reveal enabled={enabled} className="compound-controls">
            <div className="scenario-badge mono">
              <span className="status-dot" /> INTERACTIVE THOUGHT EXPERIMENT
            </div>
            <h3>What does a pause cost?</h3>
            <p>
              Start with a progress index of 1. Let it compound for ten years.
              Then try delaying the start.
            </p>
            <div className="rate-label">
              <label htmlFor="growth-rate" className="mono">
                ASSUMED ANNUAL GAIN
              </label>
              <output htmlFor="growth-rate">{rate}%</output>
            </div>
            <input
              id="growth-rate"
              type="range"
              min="5"
              max="40"
              step="1"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              style={
                {
                  "--range-progress": `${((rate - 5) / 35) * 100}%`,
                } as React.CSSProperties
              }
            />
            <div className="range-endpoints mono">
              <span>5%</span>
              <span>40%</span>
            </div>
            <fieldset className="delay-field">
              <legend className="mono">DELAY BEFORE STARTING</legend>
              <div className="delay-options">
                {[0, 1, 3, 5].map((year) => (
                  <button
                    type="button"
                    key={year}
                    aria-pressed={delay === year}
                    className={delay === year ? "selected" : ""}
                    onClick={() => setDelay(year)}
                  >
                    {year === 0
                      ? "No pause"
                      : `${year} ${year === 1 ? "year" : "years"}`}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="scenario-note">
              An illustration of exponential growth, not a forecast of AI,
              economic output, or medical outcomes. The rate is your assumption.
            </p>
          </Reveal>
          <Reveal
            enabled={enabled}
            delay={0.1}
            className="compound-chart-panel"
          >
            <div className="compound-chart-heading">
              <div>
                <span className="mono">PROGRESS AFTER 10 YEARS</span>
                <div className="compound-result" aria-live="polite">
                  <span>
                    {result.now.toFixed(2)}
                    <small>×</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </div>
              <div className="gap-result">
                <strong>{result.gap.toFixed(0)}%</strong>
                <span>
                  less progress
                  <br />
                  with a {delay}-year delay
                </span>
              </div>
            </div>
            <svg
              className="compound-chart"
              viewBox="0 0 660 310"
              role="img"
              aria-label={`Starting now reaches a progress index of ${result.now.toFixed(2)}. Starting after ${delay} years reaches ${result.paused.toFixed(2)} at year ten.`}
            >
              <g stroke="currentColor" opacity=".15">
                <path d="M45 48H625M45 119H625M45 191H625M45 263H625" />
              </g>
              <path d={`${path(false)}L625 263H45Z`} fill="url(#growth-fill)" />
              <motion.path
                d={path(false)}
                stroke="#171815"
                strokeWidth="3"
                fill="none"
                initial={false}
                animate={{ d: path(false) }}
                transition={{ duration: enabled ? 0.4 : 0 }}
              />
              <motion.path
                d={path(true)}
                stroke="#fff8ec"
                strokeWidth="3"
                strokeDasharray="6 5"
                fill="none"
                initial={false}
                animate={{ d: path(true) }}
                transition={{ duration: enabled ? 0.4 : 0 }}
              />
              <circle cx="625" cy="48" r="5" fill="#171815" />
              <circle
                cx="625"
                cy={(263 - (result.paused / result.now) * 215).toFixed(3)}
                r="5"
                fill="#fff8ec"
              />
              <g fill="currentColor" fontSize="11" fontFamily="monospace">
                <text x="45" y="292">
                  YEAR 0
                </text>
                <text x="335" y="292" textAnchor="middle">
                  YEAR 5
                </text>
                <text x="625" y="292" textAnchor="end">
                  YEAR 10
                </text>
                <text x="10" y="52">
                  {result.now.toFixed(1)}
                </text>
                <text x="15" y="267">
                  0
                </text>
              </g>
              <defs>
                <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#171815" stopOpacity=".18" />
                  <stop offset="1" stopColor="#171815" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="chart-legend mono">
              <span>
                <i className="legend-now" /> START NOW: {result.now.toFixed(2)}×
              </span>
              <span>
                <i className="legend-pause" /> START LATER:{" "}
                {result.paused.toFixed(2)}×
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Manifesto({
  enabled,
  onShare,
}: {
  enabled: boolean;
  onShare: () => void;
}) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 70%", "end 60%"],
  });
  const words =
    "Progress is a choice. A cure found sooner. A lesson finally understood. An idea brought to life. The future is worth building.".split(
      " ",
    );
  return (
    <section
      id="manifesto"
      className="manifesto-section"
      ref={section}
      aria-labelledby="manifesto-heading"
    >
      <div className="wrap manifesto-grid">
        <div>
          <SectionLabel number="04">THE HUMAN CASE</SectionLabel>
          <span className="manifesto-mini mono">
            OPTIMISM IS
            <br />A PRACTICE.
          </span>
          <div className="manifesto-star" aria-hidden="true">
            ✳
          </div>
        </div>
        <div>
          <h2 className="manifesto-statement" id="manifesto-heading">
            {words.map((word, i) => (
              <ManifestoWord
                key={`${word}-${i}`}
                progress={scrollYProgress}
                index={i}
                total={words.length}
                enabled={enabled}
              >
                {word}
              </ManifestoWord>
            ))}
          </h2>
          <Reveal enabled={enabled} className="manifesto-closing">
            <p>
              Build boldly. Test rigorously. Make the benefits accessible.
              Address the risks as we advance. Acceleration should mean more
              people getting a better shot at life.
            </p>
            <button type="button" className="text-link" onClick={onShare}>
              Pass the optimism on <ArrowUpRight size={22} aria-hidden="true" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ManifestoWord({
  children,
  progress,
  index,
  total,
  enabled,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  index: number;
  total: number;
  enabled: boolean;
}) {
  const opacity = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0.18, 1],
  );
  return (
    <motion.span style={enabled ? { opacity } : undefined}>
      {children}{" "}
    </motion.span>
  );
}

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const enabled = !paused && !prefersReducedMotion;
  const [menuOpen, setMenuOpen] = useState(false);
  const [accelerating, setAccelerating] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("top");
  const sourceDialog = useRef<HTMLDialogElement>(null);
  const sourceOpener = useRef<HTMLElement | null>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, 95]);
  const heroArtY = useTransform(heroProgress, [0, 1], [0, -70]);
  const heroArtRotate = useTransform(heroProgress, [0, 1], [0, 12]);
  const boost = useMotionValue(0);
  const velocity = useTransform(
    () => 1 + scrollYProgress.get() * 3 + boost.get() * 8,
  );
  const speed = useSpring(velocity, { stiffness: 75, damping: 23 });
  const speedLabel = useTransform(speed, (value) => `${value.toFixed(1)}×`);
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    boost.set(accelerating && enabled ? 1 : 0);
  }, [accelerating, boost, enabled]);

  useEffect(() => {
    const release = () => setAccelerating(false);
    const visibility = () => {
      if (document.hidden) release();
    };
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const dialog = sourceDialog.current;
    if (!dialog?.open) return;
    const selected = dialog.querySelector(".source-selected");
    if (selected)
      selected.scrollIntoView({ block: "center", behavior: "instant" });
    else dialog.scrollTop = 0;
  }, [selectedSource]);

  const openSources = (id?: string) => {
    sourceOpener.current = menuOpen
      ? menuToggle.current
      : (document.activeElement as HTMLElement);
    setSelectedSource(id ?? null);
    sourceDialog.current?.showModal();
    if (!id && sourceDialog.current) sourceDialog.current.scrollTop = 0;
    setMenuOpen(false);
  };
  const share = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({
          title: "DON’T STOP. — The case for AI acceleration",
          text: "The future is worth building. Explore the case for AI acceleration.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setToast("Link copied. Pass the optimism on.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setToast(
        "Your browser couldn’t share the link. Copy the address from the address bar.",
      );
    }
  };

  return (
    <MotionConfig reducedMotion={enabled ? "user" : "always"}>
      <div
        className={`experience ${accelerating && enabled ? "is-accelerating" : ""}`}
        data-motion={enabled ? "on" : "off"}
      >
        <a href="#evidence" className="skip-link">
          Skip to the evidence
        </a>
        <motion.div
          className="page-progress"
          style={{ scaleX: enabled ? progress : scrollYProgress }}
          aria-hidden="true"
        />
        <header className="site-header">
          <div className="header-inner">
            <Brand />
            <nav
              id="main-navigation"
              aria-label="Main navigation"
              className={menuOpen ? "main-nav is-open" : "main-nav"}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setMenuOpen(false);
                  menuToggle.current?.focus();
                }
              }}
            >
              {[
                ["evidence", "The evidence"],
                ["possibilities", "What’s possible"],
                ["manifesto", "The manifesto"],
              ].map(([id, label]) => (
                <a
                  href={`#${id}`}
                  key={id}
                  onClick={() => setMenuOpen(false)}
                  className={activeSection === id ? "nav-active" : ""}
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                className="mobile-source"
                onClick={() => openSources()}
              >
                Read the sources <ArrowUpRight size={15} />
              </button>
            </nav>
            <div className="header-actions">
              <button
                type="button"
                className="source-link mono"
                onClick={() => openSources()}
              >
                OPEN THE RECEIPTS <ArrowUpRight size={15} aria-hidden="true" />
              </button>
              <button
                ref={menuToggle}
                type="button"
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="main-navigation"
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              >
                {menuOpen ? <X size={23} /> : <Menu size={23} />}
              </button>
            </div>
          </div>
        </header>
        <main>
          <section
            id="top"
            ref={hero}
            className="hero"
            aria-labelledby="hero-heading"
          >
            <div className="hero-topline wrap mono">
              <span>
                <span className="status-dot" /> THE CASE FOR AI ACCELERATION
              </span>
              <span className="hero-edition">
                AN OPTIMISTIC VIEW OF WHAT’S NEXT ↗
              </span>
            </div>
            <div className="hero-stage wrap">
              <motion.div
                className="hero-copy"
                style={enabled ? { y: heroCopyY } : undefined}
              >
                <motion.h1
                  id="hero-heading"
                  initial={enabled ? { opacity: 0, y: 40 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: enabled ? 1.1 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span>DON’T</span>
                  <span>
                    STOP<span className="hero-period">.</span>
                  </span>
                </motion.h1>
                <div className="hero-description">
                  <div className="hero-small-mark" aria-hidden="true">
                    ↳
                  </div>
                  <div>
                    <h2>The future is worth building.</h2>
                    <p>
                      More discovery. Less waiting.
                      <br />A case for moving humanity forward.
                    </p>
                    <a href="#evidence" className="hero-cta">
                      Explore the case{" "}
                      <ArrowDown size={18} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="hero-art"
                style={
                  enabled ? { y: heroArtY, rotate: heroArtRotate } : undefined
                }
              >
                <div className="art-corner art-corner-tl" />
                <div className="art-corner art-corner-tr" />
                <div className="art-corner art-corner-bl" />
                <div className="art-corner art-corner-br" />
                <div className="art-top mono">
                  <span>FIG. 001 — POTENTIAL, IN MOTION</span>
                  <span className="art-live">
                    <span className="status-dot" />
                    {enabled ? "LIVE" : "STILL"}
                  </span>
                </div>
                <ParticleSculpture enabled={enabled} speed={speed} />
                <div className="art-center-label mono" aria-hidden="true">
                  ∞<span>POSSIBILITY</span>
                </div>
                <div className="art-bottom mono">
                  <span>HUMAN AMBITION × MACHINE INTELLIGENCE</span>
                  <span>↗</span>
                </div>
              </motion.div>
            </div>
            <div className="hero-bottom wrap">
              <a href="#evidence" className="scroll-cue mono">
                <span className="scroll-icon">
                  <ArrowDown size={17} />
                </span>
                <span>
                  SCROLL TO
                  <br />
                  LOOK FORWARD
                </span>
              </a>
              <div className="hero-proof">
                <span className="mono proof-label">ALREADY IN MOTION</span>
                <div>
                  <strong>
                    200M<span>+</span>
                  </strong>
                  <span>protein structures predicted</span>
                </div>
                <div>
                  <strong>
                    280<span>×</span>
                  </strong>
                  <span>lower inference cost*</span>
                </div>
                <div>
                  <strong>
                    15<span>%</span>
                  </strong>
                  <span>productivity lift in one study</span>
                </div>
              </div>
            </div>
          </section>
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i}>
                  MORE DISCOVERY <Plus /> LESS WAITING <Plus /> MORE POSSIBILITY{" "}
                  <Plus /> FULL SPEED AHEAD <ArrowUpRight />
                </span>
              ))}
            </div>
          </div>
          <section
            id="evidence"
            className="evidence-section"
            aria-labelledby="evidence-heading"
          >
            <div className="wrap">
              <Reveal
                enabled={enabled}
                className="section-heading evidence-heading"
              >
                <div>
                  <SectionLabel number="01">
                    THE EVIDENCE IS ALREADY HERE
                  </SectionLabel>
                  <h2 id="evidence-heading">
                    This isn’t science fiction.
                    <br />
                    <span className="muted">It’s the starting line.</span>
                  </h2>
                </div>
                <p className="section-intro">
                  The best argument for the future?
                  <br />
                  What’s already happening.
                </p>
              </Reveal>
              <div className="evidence-grid">
                <Reveal enabled={enabled} className="evidence-card cost-card">
                  <div className="card-eyebrow mono">
                    <span>INTELLIGENCE, MORE ACCESSIBLE</span>
                    <span>01 ↗</span>
                  </div>
                  <div className="stat-value">
                    <Counter value={280} enabled={enabled} />
                    <span>×</span>
                    <span className="stat-direction">↘</span>
                  </div>
                  <h3>Less cost. More access.</h3>
                  <p>
                    The cost of reaching GPT-3.5-level performance fell more
                    than 280-fold in two years.*
                  </p>
                  <CostChart enabled={enabled} />
                  <button
                    type="button"
                    className="stat-source mono"
                    onClick={() => openSources("cost")}
                  >
                    STANFORD HAI · 2025 AI INDEX <ArrowUpRight size={16} />
                  </button>
                </Reveal>
                <Reveal
                  enabled={enabled}
                  delay={0.1}
                  className="evidence-card protein-card"
                >
                  <div className="card-eyebrow mono">
                    <span>BIOLOGY, OPENED UP</span>
                    <span>02 ↗</span>
                  </div>
                  <div className="stat-value">
                    <Counter value={200} enabled={enabled} />
                    <span>M+</span>
                  </div>
                  <h3>A new map of life.</h3>
                  <p>
                    Protein structures predicted by AlphaFold and made available
                    for researchers to explore.
                  </p>
                  <ProteinCloud />
                  <button
                    type="button"
                    className="stat-source mono"
                    onClick={() => openSources("alphafold")}
                  >
                    GOOGLE DEEPMIND · ALPHAFOLD <ArrowUpRight size={16} />
                  </button>
                </Reveal>
                <Reveal
                  enabled={enabled}
                  className="evidence-card productivity-card"
                >
                  <div className="card-eyebrow mono">
                    <span>PEOPLE, MORE CAPABLE</span>
                    <span>03 ↗</span>
                  </div>
                  <div className="stat-value">
                    <span className="stat-plus">+</span>
                    <Counter value={15} enabled={enabled} />
                    <span>%</span>
                  </div>
                  <div className="productivity-content">
                    <div>
                      <h3>A measurable helping hand.</h3>
                      <p>
                        More issues resolved per hour by customer-support agents
                        using an AI assistant, in a published workplace study.
                      </p>
                    </div>
                    <div className="productivity-bars" aria-hidden="true">
                      <span className="mono">WITHOUT ASSISTANT</span>
                      <div className="productivity-bar">
                        <i />
                      </div>
                      <span className="mono">
                        WITH AI ASSISTANT <b>+15%</b>
                      </span>
                      <div className="productivity-bar highlighted">
                        <motion.i
                          initial={enabled ? { scaleX: 0 } : false}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="stat-source mono"
                    onClick={() => openSources("productivity")}
                  >
                    BRYNJOLFSSON, LI & RAYMOND · QJE, 2025{" "}
                    <ArrowUpRight size={16} />
                  </button>
                </Reveal>
              </div>
              <div className="evidence-footnote mono">
                <span>
                  *FIXED MMLU PERFORMANCE THRESHOLD · NOV 2022–OCT 2024. RESULTS
                  HAVE SPECIFIC SCOPES.
                </span>
                <button type="button" onClick={() => openSources()}>
                  READ ALL FOUR SOURCES <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </section>
          <Possibilities enabled={enabled} />
          <Compounding enabled={enabled} />
          <Manifesto enabled={enabled} onShare={share} />
          <section
            id="forward"
            className="final-section"
            aria-labelledby="final-heading"
          >
            <div className="wrap">
              <div className="final-topline mono">
                <span>
                  <span className="status-dot" /> HUMANITY IS A WORK IN
                  PROGRESS.
                </span>
                <span>LET’S KEEP GOING. ↗</span>
              </div>
              <Reveal enabled={enabled}>
                <h2 id="final-heading">
                  FULL SPEED
                  <br />
                  <span>AHEAD.</span>
                  <ArrowUpRight className="final-arrow" aria-hidden="true" />
                </h2>
              </Reveal>
              <div className="final-actions">
                <p>
                  Not because the future is guaranteed.
                  <br />
                  Because it’s ours to build.
                </p>
                <button type="button" className="share-button" onClick={share}>
                  Share the case <Copy size={19} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer wrap">
          <Brand />
          <span className="mono">AN INDEPENDENT CASE FOR AI ACCELERATION.</span>
          <button
            type="button"
            className="footer-sources"
            onClick={() => openSources()}
          >
            Evidence & sources <ArrowUpRight size={15} />
          </button>
          <a href="#top" className="back-top mono">
            BACK TO TOP ↑
          </a>
        </footer>
        <div className="engine-dock">
          <div className="engine-readout mono">
            <span className="engine-bars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} style={{ animationDelay: `${i * 0.13}s` }} />
              ))}
            </span>
            <div>
              <span className="engine-label">VISUAL ENGINE</span>
              <motion.span className="engine-speed" aria-hidden="true">
                {enabled ? speedLabel : "PAUSED"}
              </motion.span>
            </div>
          </div>
          <button
            type="button"
            className="accelerate-button"
            disabled={!enabled}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setAccelerating(true);
            }}
            onPointerUp={() => setAccelerating(false)}
            onPointerCancel={() => setAccelerating(false)}
            onLostPointerCapture={() => setAccelerating(false)}
            onBlur={() => setAccelerating(false)}
            onContextMenu={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                setAccelerating(true);
              }
            }}
            onKeyUp={(event) => {
              if (event.key === " " || event.key === "Enter")
                setAccelerating(false);
            }}
          >
            <Zap
              size={16}
              fill={accelerating ? "currentColor" : "none"}
              aria-hidden="true"
            />
            <span>
              {accelerating && enabled ? "ACCELERATING" : "HOLD TO ACCELERATE"}
            </span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="motion-toggle"
            onClick={() => {
              setPaused(!paused);
              setAccelerating(false);
            }}
            aria-label={paused ? "Resume animations" : "Pause animations"}
            aria-pressed={paused}
            disabled={Boolean(prefersReducedMotion)}
            title={
              prefersReducedMotion
                ? "Reduced motion follows your device preference"
                : paused
                  ? "Resume animations"
                  : "Pause animations"
            }
          >
            {enabled ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <Check size={17} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
        <dialog
          ref={sourceDialog}
          className="sources-dialog"
          aria-labelledby="sources-heading"
          onClick={(event) => {
            if (event.target === event.currentTarget)
              sourceDialog.current?.close();
          }}
          onClose={() => {
            setSelectedSource(null);
            sourceOpener.current?.focus();
          }}
        >
          <div className="sources-dialog-inner">
            <div className="dialog-top">
              <span className="mono">THE EVIDENCE / OPEN RECEIPTS</span>
              <button
                type="button"
                onClick={() => sourceDialog.current?.close()}
                aria-label="Close sources"
              >
                <X size={24} />
              </button>
            </div>
            <h2 id="sources-heading">
              Big claims.
              <br />
              Real sources.
            </h2>
            <p className="dialog-intro">
              Historical milestones and measured results. The details matter.
            </p>
            <div className="source-list">
              {sources.map((source) => (
                <article
                  className={`source-entry ${selectedSource === source.id ? "source-selected" : ""}`}
                  key={source.id}
                >
                  <div className="source-entry-number mono">
                    {source.number}
                  </div>
                  <div>
                    <span className="source-publisher mono">
                      {source.publisher}
                    </span>
                    <h3>{source.title}</h3>
                    <p>{source.detail}</p>
                    <div className="source-entry-footer">
                      <span className="mono">{source.year}</span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read original source{" "}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="dialog-note mono">
              THE COMPOUNDING CALCULATOR IS AN ILLUSTRATION, NOT A FORECAST.
              <br />
              THE POSSIBILITY GALLERY DESCRIBES ASPIRATIONS, NOT COMPLETION
              ESTIMATES.
            </div>
          </div>
        </dialog>
      </div>
    </MotionConfig>
  );
}
