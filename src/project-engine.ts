import type { Listing } from './market';
export type Requirement={name:string;qty:number;critical?:boolean};
export const projectLibrary=[
 {id:'irrigation',title:'Smart Irrigation',category:'Environment',requirements:[{name:'ESP32',qty:1,critical:true},{name:'Soil Moisture Sensor',qty:1},{name:'Relay Module',qty:1},{name:'Water Pump',qty:1},{name:'Power Supply',qty:1}]},
 {id:'rc-car',title:'RC Car',category:'Robotics',requirements:[{name:'DC Motor',qty:4},{name:'L298N Motor Driver',qty:1},{name:'Arduino Uno',qty:1,critical:true},{name:'Battery',qty:1}]},
 {id:'robot',title:'Obstacle Avoiding Robot',category:'Robotics',requirements:[{name:'DC Motor',qty:2},{name:'L298N Motor Driver',qty:1},{name:'Arduino Uno',qty:1},{name:'Ultrasonic Sensor',qty:1},{name:'Battery',qty:1}]},
 {id:'fan',title:'Smart Fan',category:'Home',requirements:[{name:'DC Motor',qty:1},{name:'Temperature Sensor',qty:1},{name:'Arduino Uno',qty:1},{name:'Power Supply',qty:1}]},
 {id:'weather',title:'Weather Monitor',category:'IoT',requirements:[{name:'ESP32',qty:1},{name:'Temperature Sensor',qty:1},{name:'OLED Display',qty:1},{name:'Power Supply',qty:1}]},
 {id:'alarm',title:'Motion Alarm',category:'Automation',requirements:[{name:'Arduino Uno',qty:1},{name:'PIR Sensor',qty:1},{name:'Buzzer',qty:1},{name:'Power Supply',qty:1}]},
 {id:'lamp',title:'Automatic Night Lamp',category:'Home',requirements:[{name:'LDR',qty:1},{name:'LED',qty:1},{name:'Resistor',qty:1},{name:'Power Supply',qty:1}]},
 {id:'level',title:'Water Level Monitor',category:'Environment',requirements:[{name:'Arduino Uno',qty:1},{name:'Water Level Sensor',qty:1},{name:'Buzzer',qty:1},{name:'Power Supply',qty:1}]},
 {id:'display',title:'Sensor Learning Station',category:'Education',requirements:[{name:'Arduino Uno',qty:1},{name:'Temperature Sensor',qty:1},{name:'OLED Display',qty:1},{name:'Power Supply',qty:1}]},
 {id:'automation',title:'Relay Home Automation Demo',category:'Automation',requirements:[{name:'ESP32',qty:1},{name:'Relay Module',qty:1},{name:'LED',qty:1},{name:'Power Supply',qty:1}]}
];
export function normalize(s:string){const n=s.toLowerCase().replace(/[^a-z0-9]/g,'');const aliases:Record<string,string>={uno:'arduinouno',arduinounor3:'arduinouno',motor:'dcmotor',soilsensor:'soilmoisturesensor',relay:'relaymodule',l298n:'l298nmotordriver',pump:'waterpump',waterpump5v:'waterpump','5vwaterpump':'waterpump'};return aliases[n]||n;}
export function match(requirements:Requirement[],inventory:Listing[]){const rows=requirements.map(r=>{const parts=inventory.filter(l=>!l.archived&&normalize(l.name)===normalize(r.name));const available=parts.reduce((n,l)=>n+l.quantity,0);const matched=Math.min(available,r.qty);const mass=parts.reduce((n,l)=>n+(l.weightG||0)*l.quantity,0);return {...r,available,matched,missing:r.qty-matched,mass:available?mass/available*matched:0};});const total=rows.reduce((n,r)=>n+r.qty,0);return {rows,score:total?Math.round(100*rows.reduce((n,r)=>n+r.matched,0)/total):0,mass:rows.reduce((n,r)=>n+r.mass,0)};}
