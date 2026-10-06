// Enable only after configuring Supabase and completing the migration.
import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase=url&&key?createClient(url,key):null;
export async function signUp(email:string,password:string,name:string){if(!supabase)throw Error('Supabase not configured');return supabase.auth.signUp({email,password,options:{data:{name},emailRedirectTo:window.location.origin}});}
export async function signIn(email:string,password:string){if(!supabase)throw Error('Supabase not configured');return supabase.auth.signInWithPassword({email,password});}
export async function signOut(){await supabase?.auth.signOut();}
export async function api<T>(path:string,method='GET',body?:unknown):Promise<T>{
 if(!supabase)throw Error('Supabase not configured');
 const {data:{session}}=await supabase.auth.getSession();if(!session)throw Error('Sign in required');
 const base=import.meta.env.VITE_BACKEND_URL?.replace(/\/$/,'')||'';
 const r=await fetch(base+path,{method,headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
 const data=await r.json();if(!r.ok)throw Error(data.detail||'Request failed');return data as T;
}
export async function uploadMedia(file:File){if(!supabase)throw Error('Supabase not configured');const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');const extensions:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'};if(!extensions[file.type]||file.size>8*1024*1024)throw Error('Unsupported media');const path=`${user.id}/${crypto.randomUUID()}.${extensions[file.type]}`;const {error}=await supabase.storage.from('component-media').upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return path;}
export async function signedMedia(path:string){if(!supabase||!path)return '';const{data,error}=await supabase.storage.from('component-media').createSignedUrl(path,300);if(error)return '';return data.signedUrl;}
