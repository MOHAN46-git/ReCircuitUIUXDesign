import { useState, type ReactNode } from "react";

type Role = "seller" | "buyer";

type IconName =
  | "home"
  | "scan"
  | "spark"
  | "market"
  | "projects"
  | "impact"
  | "user"
  | "bell"
  | "arrow"
  | "check"
  | "close"
  | "search"
  | "box"
  | "scale"
  | "wrench"
  | "wallet"
  | "leaf"
  | "camera"
  | "info"
  | "cart";

const photo =
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><path d="M8 12h8M12 8v8" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z" /></>,
    market: <><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6" /><path d="M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0" /></>,
    projects: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" /><path d="M17 14v6M14 17h6" /></>,
    impact: <><path d="M20 4C11 4 5 8 5 14c0 3 2 5 5 5 6 0 9-6 10-15Z" /><path d="M4 21c2-6 7-10 13-13" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /><path d="M12 11v10" /></>,
    scale: <><path d="M6 20h12M12 4v16M5 7h14" /><path d="m5 7-3 6h6L5 7ZM19 7l-3 6h6l-3-6Z" /></>,
    wrench: <path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-4-4 3-3Z" />,
    wallet: <><path d="M3 6h16v14H3z" /><path d="M3 9h18v7h-6a3 3 0 0 1 0-6h6" /></>,
    leaf: <><path d="M20 4C11 4 6 8 6 14c0 3 2 5 5 5 6 0 8-7 9-15Z" /><path d="M4 21c3-6 7-10 13-13" /></>,
    camera: <><path d="M4 7h4l2-3h4l2 3h4v12H4z" /><circle cx="12" cy="13" r="4" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    cart: <><path d="M3 4h2l2 11h10l3-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
  };
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`button ${variant === "primary" ? "button-primary" : variant === "secondary" ? "button-secondary" : "button-ghost"} ${className}`}
    >
      {children}
    </button>
  );
}

const projects = [
  { title: "Smart Plant Guardian", description: "Monitor soil moisture and keep houseplants thriving.", level: "Beginner", parts: 8, matched: 6, score: 86, mass: "184 g", accent: "plant" },
  { title: "Desk Air Monitor", description: "Track temperature and air quality from your workspace.", level: "Intermediate", parts: 11, matched: 7, score: 72, mass: "260 g", accent: "air" },
  { title: "Solar USB Charger", description: "Give your old power modules a bright second life.", level: "Intermediate", parts: 9, matched: 5, score: 64, mass: "310 g", accent: "solar" },
];

function Logo() {
  return (
    <div className="logo-wrap">
      <span className="logo-mark"><Icon name="leaf" className="size-5" /></span>
      <span className="logo-text">Re<span>Circuit</span></span>
    </div>
  );
}

function Sidebar({ view, go, role, signOut }: { view: string; go: (view: string) => void; role: Role; signOut: () => void }) {
  const items: [string, IconName, string][] = [
    ["home", "home", "Dashboard"],
    ["marketplace", "market", "Marketplace"],
    ["projects", "projects", "Projects"],
    ["assistant", "spark", "AI Assistant"],
    ["impact", "impact", "Impact"],
  ];
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav" aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        {items.map(([key, icon, label]) => (
          <button key={key} onClick={() => go(key)} className={`nav-item ${view === key ? "active" : ""}`}>
            <Icon name={icon} /><span>{label}</span>{key === "assistant" && <small>Beta</small>}
          </button>
        ))}
        <p className="nav-label nav-label-spaced">Manage</p>
        <button className="nav-item"><Icon name="box" /><span>{role === "seller" ? "My listings" : "My components"}</span><b>12</b></button>
        <button className="nav-item"><Icon name="cart" /><span>Orders</span></button>
        {role === "seller" && <button className="nav-item"><Icon name="wallet" /><span>Revenue</span></button>}
      </nav>
      <div className="sidebar-foot">
        <button className="profile-row" onClick={signOut} title="Sign out"><span className="avatar">AM</span><span><strong>Alex Morgan</strong><small>{role === "seller" ? "Seller account" : "Buyer account"} · Sign out</small></span><Icon name="arrow" className="size-4" /></button>
      </div>
    </aside>
  );
}

function Topbar({ openScan, role }: { openScan: () => void; role: Role }) {
  return (
    <header className="topbar">
      <div className="mobile-logo"><Logo /></div>
      <label className="searchbox">
        <Icon name="search" />
        <input aria-label="Search components and projects" placeholder="Search parts or try “RC drone”" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="top-actions">
        <button className="icon-button" aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></button>
        <Button onClick={openScan} className="top-scan"><Icon name="scan" />{role === "seller" ? "Add listing" : "Scan component"}</Button>
      </div>
    </header>
  );
}

function ProjectVisual({ type, large = false }: { type: string; large?: boolean }) {
  return (
    <div className={`project-visual ${type} ${large ? "large" : ""}`}>
      <span className="board"><i /><i /><i /><i /><b /></span>
      {type === "plant" && <span className="plant-stem"><i /><i /><i /></span>}
      {type === "air" && <span className="air-lines"><i /><i /><i /></span>}
      {type === "solar" && <span className="solar-panel"><i /><i /><i /></span>}
    </div>
  );
}

function ProjectCard({ project, open }: { project: typeof projects[number]; open: () => void }) {
  return (
    <article className="project-card">
      <ProjectVisual type={project.accent} />
      <div className="project-body">
        <div className="card-topline"><span className="difficulty">{project.level}</span><button aria-label={`Save ${project.title}`} className="save-button">♡</button></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="match-row"><span><Icon name="box" className="size-4" />{project.matched} of {project.parts} parts matched</span><strong>{project.score}%</strong></div>
        <div className="progress"><span style={{ width: `${project.score}%` }} /></div>
        <div className="project-foot"><span><Icon name="scale" className="size-4" />~{project.mass} reused</span><button onClick={open}>View project <Icon name="arrow" className="size-4" /></button></div>
      </div>
    </article>
  );
}

function Dashboard({ openScan, goProjects, openProject, role }: { openScan: () => void; goProjects: () => void; openProject: () => void; role: Role }) {
  const isSeller = role === "seller";
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="role-chip">{isSeller ? "Seller workspace" : "Buyer workspace"}</span>
          <span className="eyebrow"><Icon name="spark" className="size-4" /> {isSeller ? "Put spare parts back to work" : "Make something useful today"}</span>
          <h1>{isSeller ? <>List a component.<br /><em>Enable a new build.</em></> : <>Give every component<br /><em>another circuit.</em></>}</h1>
          <p>{isSeller ? "Identify, list, and hand over spare electronics with confidence. We’ll connect each part to makers who can use it." : "Turn spare electronics into useful builds. Scan what you have, find what it can become, and source only what’s missing."}</p>
          <div className="hero-actions">
            <Button onClick={openScan}><Icon name="scan" />{isSeller ? "Scan / Add Listing" : "Scan / Add Component"}</Button>
            <Button onClick={goProjects} variant="secondary">{isSeller ? "See project demand" : "Find a Project"} <Icon name="arrow" /></Button>
          </div>
          <span className="microcopy"><Icon name="leaf" className="size-4" /> {isSeller ? "Every accurate listing helps another maker reuse." : "Reuse first. Buy only what you need."}</span>
        </div>
        <div className="hero-image">
          <img src={photo} alt="Circuit boards and electronic components on a maker workbench" />
          <div className="scan-frame"><i /><i /><i /><i /></div>
          <div className="identified-chip"><span><Icon name="check" className="size-4" /></span><div><small>Component identified</small><strong>Arduino Uno R3</strong></div><b>High match</b></div>
          <span className="photo-credit">Photo by Robin Glauser · Unsplash</span>
        </div>
      </section>

      <section aria-labelledby="impact-heading" className="section-block">
        <div className="section-heading compact"><div><span className="overline">{isSeller ? "Your seller overview" : "Your circular impact"}</span><h2 id="impact-heading">{isSeller ? "Your components are in demand." : "Small parts. Real progress."}</h2></div><button>{isSeller ? "View seller report" : "View impact report"} <Icon name="arrow" className="size-4" /></button></div>
        <div className="stats-grid">
          {(isSeller ? [
            ["box", "Active listings", "12", "3 viewed today", "mint"],
            ["scale", "Waste diverted", "3.26 kg", "Estimated by item mass", "yellow"],
            ["cart", "Orders & rentals", "7", "2 awaiting handover", "blue"],
            ["wallet", "Revenue earned", "$248", "+$62 this month", "peach"],
          ] : [
            ["box", "Components reused", "12", "+3 this month", "mint"],
            ["scale", "Waste diverted", "1.84 kg", "Estimated by item mass", "yellow"],
            ["wrench", "Projects enabled", "4", "2 in progress", "blue"],
            ["wallet", "Saved by reuse", "$86", "vs. typical new prices", "peach"],
          ]).map(([icon, label, value, note, color]) => (
            <article className="stat-card" key={label}><span className={`stat-icon ${color}`}><Icon name={icon as IconName} /></span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>
          ))}
        </div>
      </section>

      <section aria-labelledby="matches-heading" className="section-block">
        <div className="section-heading"><div><span className="overline">{isSeller ? "Demand for your listings" : "Based on your components"}</span><h2 id="matches-heading">{isSeller ? "Projects your parts can enable" : "Ready-to-build matches"}</h2><p>{isSeller ? "See where listed components fit and which parts makers are searching for." : "Feasibility considers parts you own, required tools, and build complexity."}</p></div><button onClick={goProjects}>Browse all projects <Icon name="arrow" className="size-4" /></button></div>
        <div className="project-grid">{projects.map((project) => <ProjectCard key={project.title} project={project} open={openProject} />)}</div>
      </section>

      <section className="workbench-banner">
        <span className="banner-icon"><Icon name="camera" /></span>
        <div><span className="overline">{isSeller ? "Grow your circular shop" : "Your workbench is waiting"}</span><h2>{isSeller ? "Have another part to pass on?" : "Found a loose component?"}</h2><p>{isSeller ? "Scan it, confirm its condition, and publish it for sale, rental, or donation." : "Scan it in seconds. We’ll identify it, explain the result, and show what you can build."}</p></div>
        <Button onClick={openScan}>{isSeller ? "Create a listing" : "Scan your first part"} <Icon name="arrow" /></Button>
      </section>
    </>
  );
}

function AuthPage({ onContinue }: { onContinue: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [profileFile, setProfileFile] = useState("");
  const [idFile, setIdFile] = useState("");
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Logo />
        <div className="auth-story-copy">
          <span className="eyebrow light"><Icon name="leaf" className="size-4" /> Circular electronics, made practical</span>
          <h1>Every spare part has a <em>next project.</em></h1>
          <p>Join makers and sellers keeping useful electronics in circulation—and out of the waste stream.</p>
          <div className="auth-proof">
            <span><Icon name="scan" /><strong>Identify</strong><small>Scan loose components</small></span>
            <span><Icon name="projects" /><strong>Match</strong><small>Discover useful builds</small></span>
            <span><Icon name="impact" /><strong>Reuse</strong><small>Track diverted mass</small></span>
          </div>
        </div>
        <p className="auth-quote">“Build with what exists before buying what’s new.”</p>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-mobile-logo"><Logo /></div>
        <form className="auth-card" onSubmit={(event) => { event.preventDefault(); onContinue(); }}>
          <span className="auth-kicker">{mode === "signup" ? "New to ReCircuit" : "Welcome back"}</span>
          <h2>{mode === "signup" ? "Create your profile" : "Log in to ReCircuit"}</h2>
          <p>{mode === "signup" ? "Tell us a little about you before choosing your marketplace role." : "Enter your registered email and password to continue."}</p>
          <div className="auth-tabs" role="tablist" aria-label="Authentication method">
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign up</button>
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Log in</button>
          </div>
          {mode === "signup" ? (
            <>
              <div className="profile-upload-row">
                <label className="avatar-upload">
                  <input type="file" accept="image/*" capture="user" onChange={(event) => setProfileFile(event.target.files?.[0]?.name ?? "")} />
                  <span>{profileFile ? <Icon name="check" /> : <Icon name="camera" />}</span>
                  <strong>{profileFile ? "Photo added" : "Add profile photo"}</strong>
                  <small>{profileFile || "Capture or upload"}</small>
                </label>
                <div className="upload-guidance"><strong>Your maker profile</strong><p>A clear photo helps build trust during local handovers.</p><span>JPG or PNG · Testing profile only</span></div>
              </div>
              <div className="form-grid">
                <label className="field-label full-field">Full name<input required placeholder="Alex Morgan" autoComplete="name" /></label>
                <label className="field-label">Date of birth<input required type="date" autoComplete="bday" /></label>
                <label className="field-label">Gender<select required defaultValue=""><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
                <label className="field-label">Profession<input required placeholder="Electronics engineer" autoComplete="organization-title" /></label>
                <label className="field-label">Organization<input required placeholder="Organization or independent" autoComplete="organization" /></label>
                <label className="field-label">Mobile number<input required type="tel" placeholder="+1 555 012 3456" autoComplete="tel" /></label>
                <label className="field-label">Email address<input required type="email" placeholder="alex@example.com" autoComplete="email" /></label>
                <label className="field-label full-field">Password<input required type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" /></label>
                <label className="field-label full-field">Address<textarea required placeholder="Street, city, state, postal code" autoComplete="street-address" /></label>
              </div>
              <label className={`id-upload ${idFile ? "uploaded" : ""}`}>
                <input type="file" accept="image/*,.pdf" onChange={(event) => setIdFile(event.target.files?.[0]?.name ?? "")} />
                <span><Icon name={idFile ? "check" : "box"} /></span>
                <div><strong>{idFile ? "Test ID proof attached" : "Upload ID proof"}</strong><small>{idFile || "Demo verification only · Use a fake document for testing"}</small></div>
                <em>{idFile ? "Replace" : "Choose file"}</em>
              </label>
              <div className="test-data-note"><Icon name="info" /><span><strong>Prototype notice:</strong> Do not upload a real identity document. This field is for fake testing data only.</span></div>
            </>
          ) : (
            <div className="login-fields">
              <button type="button" className="social-button"><span>G</span>Continue with Google</button>
              <div className="auth-divider"><span>or use email</span></div>
              <label className="field-label">Email address<input required type="email" placeholder="alex@example.com" autoComplete="email" /></label>
              <label className="field-label">Password<input required type="password" placeholder="Enter your password" minLength={8} autoComplete="current-password" /></label>
              <button type="button" className="forgot-button">Forgot password?</button>
            </div>
          )}
          <Button className="full-button">{mode === "signup" ? "Create profile & choose role" : "Log in"}<Icon name="arrow" /></Button>
          <p className="auth-switch">{mode === "signup" ? "Already registered?" : "Need a ReCircuit profile?"}<button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Log in" : "Sign up"}</button></p>
          <small className="legal-copy">By continuing, you agree to ReCircuit’s Terms and Privacy Policy.</small>
        </form>
      </section>
    </main>
  );
}

function RolePage({ selectRole, back }: { selectRole: (role: Role) => void; back: () => void }) {
  const [selected, setSelected] = useState<Role | null>(null);
  return (
    <main className="role-page">
      <header className="role-header"><Logo /><button onClick={back}>Sign out</button></header>
      <section className="role-content">
        <span className="step-count">Step 2 of 2</span>
        <h1>How will you use ReCircuit?</h1>
        <p>Choose a starting workspace. You can switch roles later from your profile.</p>
        <div className="role-grid">
          <button className={`role-card buyer-card ${selected === "buyer" ? "selected" : ""}`} onClick={() => setSelected("buyer")}>
            <span className="role-visual"><Icon name="wrench" className="size-8" /><i><Icon name="search" /></i></span>
            <span className="role-copy"><small>Build & source</small><strong>I’m a buyer / maker</strong><em>Find projects for parts you own, then source only what’s missing.</em></span>
            <span className="role-check"><Icon name="check" className="size-4" /></span>
            <ul><li><Icon name="check" />Match components to projects</li><li><Icon name="check" />Buy, rent, or claim parts</li><li><Icon name="check" />Track reuse savings</li></ul>
          </button>
          <button className={`role-card seller-card ${selected === "seller" ? "selected" : ""}`} onClick={() => setSelected("seller")}>
            <span className="role-visual"><Icon name="box" className="size-8" /><i><Icon name="market" /></i></span>
            <span className="role-copy"><small>List & circulate</small><strong>I’m a seller</strong><em>Give spare components a second life through sales, rentals, or donations.</em></span>
            <span className="role-check"><Icon name="check" className="size-4" /></span>
            <ul><li><Icon name="check" />AI-assisted component listings</li><li><Icon name="check" />Manage orders and handovers</li><li><Icon name="check" />Track revenue and impact</li></ul>
          </button>
        </div>
        <Button onClick={() => selected && selectRole(selected)} className={`role-continue ${selected ? "" : "disabled-button"}`}>Continue to my workspace <Icon name="arrow" /></Button>
        <span className="role-hint"><Icon name="info" className="size-4" />Not sure? Choose buyer if you primarily want to build projects.</span>
      </section>
    </main>
  );
}

function Projects({ openProject }: { openProject: () => void }) {
  return (
    <section className="page-section">
      <div className="page-intro"><div><span className="eyebrow"><Icon name="projects" className="size-4" /> Project library</span><h1>Build more with what you have.</h1><p>Every match is scored from your available parts, tool needs, and project difficulty.</p></div><Button variant="secondary"><Icon name="box" />My parts: 12</Button></div>
      <div className="filter-row"><label><Icon name="search" /><input aria-label="Search projects" placeholder="What do you want to build?" /></label><button className="filter active">Best matches</button><button className="filter">Beginner</button><button className="filter">Under 1 hour</button></div>
      <div className="project-grid library-grid">{projects.concat([{ ...projects[0], title: "Motion Night Light", score: 58, matched: 4, accent: "air" }]).map((project) => <ProjectCard key={project.title} project={project} open={openProject} />)}</div>
    </section>
  );
}

function ProjectDetail({ back }: { back: () => void }) {
  const bom = [
    ["Arduino Uno R3", "1", "1", "Owned", "—"],
    ["Soil moisture sensor", "1", "1", "Owned", "—"],
    ["Mini water pump 5V", "1", "0", "Missing", "3 matches"],
    ["Relay module", "1", "1", "Owned", "—"],
    ["Silicone tube", "40 cm", "0", "Missing", "8 matches"],
  ];
  return (
    <section className="detail-page">
      <button className="back-link" onClick={back}>← Back to project matches</button>
      <div className="detail-grid">
        <div>
          <ProjectVisual type="plant" large />
          <div className="detail-title"><span className="difficulty">Beginner · 1–2 hours</span><h1>Smart Plant Guardian</h1><p>Use your Arduino and sensor to build an automatic plant watering system.</p></div>
          <div className="why-match">
            <div className="score-ring"><strong>86%</strong><span>feasible</span></div>
            <div><h2>Why this is a strong match</h2><ul><li><Icon name="check" />You own 6 of 8 required components</li><li><Icon name="check" />No specialist tools required</li><li><Icon name="info" />Missing parts are available from 4 local sellers</li></ul></div>
          </div>
        </div>
        <div className="bom-panel">
          <div className="bom-header"><div><span className="overline">Bill of materials</span><h2>8 components required</h2></div><span className="owned-pill">6 available</span></div>
          <div className="bom-table-wrap">
            <table>
              <thead><tr><th>Component</th><th>Req.</th><th>Have</th><th>Status</th><th>Marketplace</th></tr></thead>
              <tbody>{bom.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{i === 3 ? <span className={cell === "Owned" ? "status-owned" : "status-missing"}>{cell}</span> : cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="reuse-estimate"><Icon name="scale" /><div><strong>~184 g kept in use</strong><span>Estimated from typical component mass</span></div></div>
          <Button className="full-button">Find 2 missing parts <Icon name="arrow" /></Button>
          <p className="bom-note">Marketplace results can be filtered by buy, rent, or donation.</p>
        </div>
      </div>
    </section>
  );
}

function ScanPanel({ close, openProject }: { close: () => void; openProject: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="scan-panel" role="dialog" aria-modal="true" aria-labelledby="scan-title">
        <div className="panel-head"><div><span className="eyebrow"><Icon name="scan" className="size-4" />Add component</span><h2 id="scan-title">{step === 0 ? "What are we working with?" : "Component identified"}</h2></div><button onClick={close} className="icon-button" aria-label="Close scan panel"><Icon name="close" /></button></div>
        <div className="stepper" aria-label="Listing progress"><span className="done">1 <small>Media</small></span><i /><span className={step > 0 ? "done" : ""}>2 <small>AI scan</small></span><i /><span>3 <small>Confirm</small></span><i /><span>4 <small>Match</small></span></div>
        {step === 0 ? (
          <div className="capture-area">
            <span className="camera-orbit"><Icon name="camera" className="size-8" /></span>
            <h3>Take a clear photo of the component</h3>
            <p>Use good lighting and include any printed labels or model numbers.</p>
            <Button onClick={() => setStep(1)}><Icon name="camera" />Scan sample component</Button>
            <button className="text-button">or upload from device</button>
            <div className="privacy-note"><Icon name="info" /><span>Photos are used only to identify your component.</span></div>
          </div>
        ) : (
          <div className="scan-result">
            <div className="result-component">
              <div className="result-thumb"><span className="board"><i /><i /><i /><i /><b /></span></div>
              <div><span className="confidence">High confidence</span><h3>Arduino Uno R3</h3><p>Microcontroller development board · ATmega328P</p></div>
              <button>Edit</button>
            </div>
            <div className="ai-note"><Icon name="info" /><span><strong>Why this match?</strong> The board shape, USB-B port, pin layout, and “UNO” marking match reference images. AI suggestion—not safety certification.</span></div>
            <div className="found-match"><span className="overline">Best project match</span><div><ProjectVisual type="plant" /><section><span className="difficulty">Beginner</span><h3>Smart Plant Guardian</h3><p>You have 6 of 8 parts · ~184 g reusable</p><div className="match-explain"><strong>86% feasible</strong><span>Strong parts match + no special tools</span></div></section></div></div>
            <Button onClick={() => { close(); openProject(); }} className="full-button">See project & missing parts <Icon name="arrow" /></Button>
          </div>
        )}
      </section>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return <section className="placeholder"><span className="banner-icon"><Icon name="wrench" /></span><h1>{title}</h1><p>This prototype keeps the mandatory component-to-project reuse path front and center.</p><Button variant="secondary">Return to dashboard</Button></section>;
}

function MobileNav({ view, go, openScan }: { view: string; go: (view: string) => void; openScan: () => void }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <button className={view === "home" ? "active" : ""} onClick={() => go("home")}><Icon name="home" /><span>Home</span></button>
      <button className={view === "marketplace" ? "active" : ""} onClick={() => go("marketplace")}><Icon name="market" /><span>Market</span></button>
      <button className="scan-fab" onClick={openScan} aria-label="Scan component"><span><Icon name="scan" /></span><small>Scan</small></button>
      <button className={view === "projects" ? "active" : ""} onClick={() => go("projects")}><Icon name="projects" /><span>Projects</span></button>
      <button><Icon name="user" /><span>Profile</span></button>
    </nav>
  );
}

export default function App() {
  const [stage, setStage] = useState<"auth" | "role" | "app">("auth");
  const [role, setRole] = useState<Role>("buyer");
  const [view, setView] = useState("home");
  const [scanOpen, setScanOpen] = useState(false);
  const openProject = () => setView("detail");
  if (stage === "auth") return <AuthPage onContinue={() => setStage("role")} />;
  if (stage === "role") return <RolePage back={() => setStage("auth")} selectRole={(nextRole) => { setRole(nextRole); setView("home"); setStage("app"); }} />;
  return (
    <div className={`app-shell role-${role}`}>
      <Sidebar view={view} go={setView} role={role} signOut={() => setStage("auth")} />
      <div className="main-shell">
        <Topbar openScan={() => setScanOpen(true)} role={role} />
        <main>
          {view === "home" && <Dashboard role={role} openScan={() => setScanOpen(true)} goProjects={() => setView("projects")} openProject={openProject} />}
          {view === "projects" && <Projects openProject={openProject} />}
          {view === "detail" && <ProjectDetail back={() => setView("projects")} />}
          {!["home", "projects", "detail"].includes(view) && <Placeholder title={view.charAt(0).toUpperCase() + view.slice(1)} />}
        </main>
      </div>
      <MobileNav view={view} go={setView} openScan={() => setScanOpen(true)} />
      {scanOpen && <ScanPanel close={() => setScanOpen(false)} openProject={openProject} />}
    </div>
  );
}
