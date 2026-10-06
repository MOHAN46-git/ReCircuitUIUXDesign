import {api as authenticatedApi, supabase} from './integration/supabase';
import { projectLibrary, match } from './project-engine';
import { type Listing, type Mode } from './market';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export type Profile = { name: string; email: string; dob: string; gender: string; profession: string; organization: string; mobile: string; address: string; photo: string };
export const emptyProfile: Profile = { name: '', email: '', dob: '', gender: '', profession: '', organization: '', mobile: '', address: '', photo: '' };
const api = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_AI_API_BASE_URL;
async function callAI(path:string, body:unknown){if(supabase)return authenticatedApi<Record<string, unknown>>(path,'POST',body);throw Error('Sign in through configured Supabase before using AI.');}

export function ComponentCapture({ close, publish, manual = false, projects }: { close: () => void; publish: (listing: Listing) => void | Promise<void>; manual?:boolean; projects:()=>void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const formRef=useRef<HTMLFormElement>(null);
  const [showMedia,setShowMedia]=useState(!manual);
  const [images,setImages]=useState<string[]>([]);
  const [clip,setClip]=useState('');
  const [vision,setVision]=useState<{name:string;category:string;condition:string;confidence:number|null}|null>(null);
  const [copilot,setCopilot]=useState<{title:string;description:string;tags:string;applications:string;keywords:string}|null>(null);
  const [lastListing,setLastListing]=useState<Listing|null>(null);
  const [live, setLive] = useState(false);
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<Mode>('Sell');
  const [suggestion,setSuggestion]=useState('');
  const [price, setPrice] = useState('0');
  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; };
  useEffect(() => () => { stream.current?.getTracks().forEach(t => t.stop()); }, []);
  useEffect(() => { if (live && video.current) video.current.srcObject = stream.current; }, [live]);
  async function camera() {
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera needs HTTPS or localhost. You can upload a photo instead.');
      stop(); stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }); setLive(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Camera unavailable. Upload a photo instead.'); }
  }
  function capture() {
    const v = video.current; if (!v?.videoWidth) { setError('Wait for the camera image before capturing.'); return; }
    const canvas = document.createElement('canvas'); canvas.width = v.videoWidth; canvas.height = v.videoHeight;
    canvas.getContext('2d')?.drawImage(v, 0, 0); const photo=canvas.toDataURL('image/jpeg', .85); setImage(photo); setImages(old=>[photo,...old].slice(0,4)); setResult(''); stop(); setLive(false);
  }
  function upload(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP image under 8 MB.'); return; }
    stop(); setLive(false); setError(''); setResult(''); setSaved(false);
    const reader = new FileReader(); reader.onload = () => {const photo=String(reader.result);setImage(photo);setImages(old=>[...old,photo].slice(-4));}; reader.readAsDataURL(file);
  }
  async function analyze() {
    if (!api) { setResult('AI analysis is not connected. Confirm the component manually below; no image identification has been performed.'); return; }
    setBusy(true); setError('');
    try {
      const data=await callAI('/api/ai/analyze-component',{image});
      if (typeof data.probable_name !== 'string') throw new Error('Invalid analysis response. Please confirm manually.');
      setVision({name:data.probable_name,category:typeof data.category==='string'?data.category:'',condition:typeof data.visible_condition==='string'?data.visible_condition:'',confidence:typeof data.confidence==='number'&&data.confidence>=0&&data.confidence<=1?data.confidence:null});
      setResult(`AI suggestion: ${data.probable_name}. ${typeof data.visible_condition === 'string' ? data.visible_condition : ''} Confirm before publishing. This is not a safety certification.`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Analysis failed. Continue manually.'); } finally { setBusy(false); }
  }
  function apply(fields:Record<string,string>){for(const [name,value] of Object.entries(fields)){const field=formRef.current?.elements.namedItem(name);if(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)field.value=value;}}
  async function generateListing(){
    if(!api){setSuggestion('AI Listing Copilot is not connected. Enter a title, description and tags manually.');return;}
    setBusy(true);setSuggestion('');
    try{const fields=Object.fromEntries(new FormData(formRef.current!));const d=await callAI('/api/ai/generate-listing',{images,component:fields});if(typeof d.title!=='string'||typeof d.description!=='string')throw new Error('Invalid copilot response. Continue manually.');const list=(v:unknown)=>Array.isArray(v)?v.filter(x=>typeof x==='string').join(', '):typeof v==='string'?v:'';setCopilot({title:d.title,description:d.description,tags:list(d.tags),applications:list(d.possible_applications),keywords:list(d.search_keywords)});}catch(e){setSuggestion(e instanceof Error?e.message:'Copilot unavailable.');}finally{setBusy(false);}
  }
  return <div className="modal-backdrop"><section className="scan-panel feature-panel" role="dialog" aria-modal="true" aria-labelledby="capture-title"><div className="panel-head"><h2 id="capture-title">Scan / Add listing</h2><button onClick={() => { stop(); close(); }} aria-label="Close capture">✕</button></div>
    <p>Photograph your component, review the analysis, then confirm its details.</p>
    {showMedia && <div className="feature-actions"><button className="button button-primary" onClick={camera}>Open live camera</button><label className="button button-secondary">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => Array.from(e.target.files||[]).slice(0,4).forEach(upload)} /></label></div>}
    {live && <><video ref={video} autoPlay playsInline muted className="capture-preview" /><button className="button button-primary" onClick={capture}>Capture photo</button><button className="button button-secondary" onClick={() => { stop(); setLive(false); }}>Stop camera</button></>}
    {!showMedia && <button className="button button-secondary" onClick={()=>setShowMedia(true)}>Add optional photos</button>}
    {image && <><img src={image} alt="Component selected for analysis" className="capture-preview" /><button disabled={busy} className="button button-primary" onClick={analyze}>{busy ? 'Analyzing…' : 'Analyze photo'}</button></>}
    {error && <p role="alert">{error}</p>}{result && <p role="status" className="ai-note">{result}</p>}
    {vision&&<div className="ai-note"><h3>Probable identification — seller confirmation required</h3><label className="field-label">Probable component<input value={vision.name} onChange={e=>setVision({...vision,name:e.target.value})}/></label><label className="field-label">Category<input value={vision.category} onChange={e=>setVision({...vision,category:e.target.value})}/></label><label className="field-label">Visible condition<input value={vision.condition} onChange={e=>setVision({...vision,condition:e.target.value})}/></label><p>{vision.confidence===null?'Confidence not supplied':`Provider confidence: ${Math.round(vision.confidence*100)}% (not calibrated accuracy)`}</p><button className="button button-secondary" onClick={()=>apply({component:vision.name,category:vision.category})}>Confirm editable identification</button></div>}
    {images.length>1&&<div className="feature-actions">{images.map((src,i)=><img key={i} src={src} alt={`Component photo ${i+1}`} className="profile-preview"/>)}</div>}
    <label className="field-label">Optional video (MP4/WebM, max 5 MB)<input type="file" accept="video/mp4,video/webm" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(!['video/mp4','video/webm'].includes(f.type)||f.size>5*1024*1024){setError('Use MP4/WebM under 5 MB.');return;}const r=new FileReader();r.onload=()=>setClip(String(r.result));r.readAsDataURL(f);}}/></label>{clip&&<video src={clip} controls className="capture-preview"/>}
    <form ref={formRef} onSubmit={async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const f = new FormData(e.currentTarget); try { const listing:Listing={id:crypto.randomUUID(),name:String(f.get('component')).trim(),quantity:Number(f.get('quantity')),condition:String(f.get('condition')),mode,price:mode==='Donate'?0:Number(price),image,archived:false,category:String(f.get('category')||''),manufacturer:String(f.get('manufacturer')||''),model:String(f.get('model')||''),age:String(f.get('age')||''),previousProject:String(f.get('previousProject')||''),issues:String(f.get('issues')||''),description:String(f.get('description')||''),weightG:Number(f.get('weightG')||0),originalPrice:Number(f.get('originalPrice')||0),maxDays:Number(f.get('maxDays')||0),deposit:Number(f.get('deposit')||0),tags:String(f.get('tags')||''),images,video:clip,applications:String(f.get('applications')||''),searchKeywords:String(f.get('searchKeywords')||''),title:String(f.get('title')||'')}; await publish(listing);setLastListing(listing); setSaved(true); setError(''); } catch(e) {setError(e instanceof Error?e.message:'Listing failed.');} }} className="form-grid"><label className="field-label full-field">Component name<input required name="component" /></label><label className="field-label">Quantity<input required name="quantity" type="number" min="1" step="1" defaultValue="1" /></label><label className="field-label">Condition<select name="condition"><option>Used — working, seller reported</option><option>Untested</option><option>For parts</option></select></label><label className="field-label">Listing mode<select value={mode} onChange={e=>setMode(e.target.value as Mode)}><option>Sell</option><option>Rent</option><option>Donate</option></select></label><label className="field-label">{mode==='Donate'?'Price — Free':mode==='Rent'?'Daily rental rate (₹ / day)':'Selling price (₹)'}<input required type="number" min="0" step="0.01" readOnly={mode==='Donate'} value={mode==='Donate'?'0':price} onChange={e=>setPrice(e.target.value)} /></label>{[['title','Listing title'],['applications','Possible applications (seller confirmed)'],['searchKeywords','Search keywords'],['category','Category'],['manufacturer','Manufacturer'],['model','Model number'],['age','Approximate age'],['previousProject','Previous project usage'],['issues','Known issues'],['description','Description'],['tags','Tags / search keywords']].map(([name,label])=><label key={name} className="field-label">{label}<input name={name} /></label>)}<label className="field-label">Approximate weight per item (g)<input name="weightG" type="number" min="0" step="0.1" /></label>{mode==='Sell'&&<label className="field-label">Original price (₹, optional)<input name="originalPrice" type="number" min="0" step="0.01" /></label>}{mode==='Rent'&&<><label className="field-label">Maximum rental days<input name="maxDays" required type="number" min="1" step="1" defaultValue="7" /></label><label className="field-label">Deposit (₹, DEMO only)<input name="deposit" type="number" min="0" step="0.01" defaultValue="0" /></label></>}<button className="button button-primary" disabled={saved}>Publish demo listing</button></form>
    {mode === 'Donate' && <p className="ai-note">Thank you for donating! Your component is free for another maker to reuse.</p>}
    {saved && <p role="status">Listing published to the shared demo marketplace. Listing an item alone does not count as waste saved.</p>}
    <button className="button button-secondary" disabled={busy} onClick={generateListing}>AI Listing Copilot</button>{suggestion&&<p role="status">{suggestion}</p>}
    {copilot&&<div className="ai-note"><h3>Editable listing suggestions</h3>{(Object.keys(copilot) as (keyof typeof copilot)[]).map(key=><label key={key} className="field-label">{key}<input value={copilot[key]} onChange={e=>setCopilot({...copilot,[key]:e.target.value})}/></label>)}<button className="button button-secondary" onClick={()=>apply({title:copilot.title,description:copilot.description,tags:copilot.tags,applications:copilot.applications,searchKeywords:copilot.keywords})}>Apply confirmed suggestions</button><p>Check specifications and applications before publishing. AI suggestions are not authenticity or safety certification.</p></div>}
    {lastListing&&<div className="ai-note"><h3>This component can contribute to</h3>{projectLibrary.map(p=>({p,result:match(p.requirements,[lastListing])})).filter(x=>x.result.score>0).sort((a,b)=>b.result.score-a.result.score).map(({p,result})=><p key={p.id}>{p.title} · {result.score}% of required units from this listing</p>)}<button className="button button-primary" onClick={()=>{stop();close();projects();}}>See all inventory matches</button></div>}

    <p className="legal-copy">Impact is recorded separately after actual handover/reuse. No mass is recorded from a scan.</p>
  </section></div>;
}

export function Assistant() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi, I’m Circuit! I can help with listing, reuse projects and handover. AI is not connected yet; local help is available.' }]);
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false);
  async function send(e: FormEvent) {
    e.preventDefault(); if (!text.trim() || busy) return;
    const prompt = text.trim(); setText(''); setMessages(m => [...m, { role: 'user', text: prompt }]); setBusy(true);
    let answer = 'Local help (not AI): add a photo and confirm the component name, condition and quantity. Compare your parts with a project’s bill of materials. Complete handover before recording reused mass.';
    try { if (api) { const d = await callAI('/api/ai/chat',{message:prompt}); if (typeof d.reply !== 'string') throw new Error(); answer = d.reply; } } catch { answer = 'AI is unavailable. You can still add components manually and browse project requirements.'; }
    setMessages(m => [...m, { role: 'assistant', text: answer }]); setBusy(false);
  }
  return <section className="section-block feature-page"><div className="section-heading"><div><span className="overline">Your reuse companion</span><h1>Meet Circuit</h1><p>{api ? 'AI service configured' : 'Local help mode · AI service not connected'}</p></div><div className="mini-bot" aria-label="Circuit mini bot">◉‿◉<span>⚡</span></div></div><div className="chat-log" role="log" aria-live="polite">{messages.map((m,i) => <div key={i} className={`chat-bubble ${m.role}`}><strong>{m.role === 'assistant' ? 'Circuit' : 'You'}</strong><p>{m.text}</p></div>)}</div><form onSubmit={send} className="feature-actions"><label className="field-label chat-input">Message Circuit<input value={text} onChange={e => setText(e.target.value)} maxLength={2000} placeholder="How can I reuse my spare components?" /></label><button className="button button-primary" disabled={busy || !text.trim()}>{busy ? 'Thinking…' : 'Send'}</button></form></section>;
}

export function Impact({ grams, record }: { grams: number; record: (grams: number) => void }) {
  const [baseline, setBaseline] = useState(''); const [weight, setWeight] = useState('');
  const base = Number(baseline); const saved = grams / 1000; const scale = Math.max(base || 0, saved, 1);
  return <section className="section-block feature-page"><span className="overline">Your circular impact</span><h1>Track electronics kept in use</h1><p>Self-reported completed reuse in this session. This is an estimate, not a verified environmental claim.</p><label className="field-label">Optional comparison scenario (kg)<input type="number" min="0" step="0.01" value={baseline} onChange={e => setBaseline(e.target.value)} placeholder="Enter a sourced baseline or your own scenario" /></label><p className="legal-copy">Expected e-waste generation is unavailable until an authoritative dataset and calculation method are supplied. This input is a user-defined scenario, not a forecast.</p><div className="impact-chart" role="img" aria-label={`Scenario baseline ${base || 0} kg; self-reported reused ${saved.toFixed(3)} kg`}>
    <div><strong>Comparison scenario {baseline ? `${base} kg` : 'not entered'}</strong><div className="bar-track"><div className="bar-baseline" style={{width:`${base / scale * 100}%`}} /></div></div>
    <div><strong>Recorded reused mass {saved.toFixed(3)} kg</strong><div className="bar-track"><div className="bar-saved" style={{width:`${saved / scale * 100}%`}} /></div></div></div>
    <form className="feature-actions" onSubmit={e => { e.preventDefault(); const n = Number(weight); if (n > 0) { record(n); setWeight(''); } }}><label className="field-label">Record completed reuse (grams)<input required type="number" min="1" step="1" value={weight} onChange={e => setWeight(e.target.value)} /></label><button className="button button-primary">Record self-reported reuse</button></form><p>Record each item once, after handover or reuse. These entries are kept in this session only.</p></section>;
}

export function ProfileEditor({ profile, save }: { profile: Profile; save: (p: Profile) => void }) {
  const [draft, setDraft] = useState(profile); const [notice, setNotice] = useState('');
  const fields: [keyof Profile,string,string][] = [['name','Full name','text'],['dob','Date of birth','date'],['gender','Gender','text'],['profession','Profession','text'],['organization','Organization','text'],['mobile','Mobile','tel'],['address','Address','text']];
  return <section className="section-block feature-page"><h1>Edit your profile</h1><p>Email is your login identifier and cannot be edited here.</p><form className="form-grid" onSubmit={e => { e.preventDefault(); save({...draft,email:profile.email}); setNotice('Profile updated for this session.'); }}><label className="field-label full-field">Email (read only)<input type="email" value={profile.email} readOnly aria-readonly="true" /></label>{fields.map(([key,label,type]) => <label className="field-label" key={key}>{label}<input type={type} required={key==='name'} value={draft[key]} onChange={e => setDraft({...draft,[key]:e.target.value})} /></label>)}<label className="field-label full-field">Profile photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f=e.target.files?.[0]; if (!f) return; if (!['image/jpeg','image/png','image/webp'].includes(f.type) || f.size>8*1024*1024) { setNotice('Use JPG, PNG or WebP under 8 MB.'); return; } const r=new FileReader(); r.onload=()=>setDraft(d=>({...d,photo:String(r.result)}));r.readAsDataURL(f); }} /></label>{draft.photo && <img src={draft.photo} className="profile-preview" alt="Your profile" />}<button className="button button-primary">Save changes</button>{notice && <p role="status">{notice}</p>}</form></section>;
}
