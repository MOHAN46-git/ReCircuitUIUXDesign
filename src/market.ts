export type Mode = 'Sell' | 'Rent' | 'Donate';
export type Listing = { id: string; name: string; quantity: number; condition: string; mode: Mode; price: number; image: string; archived: boolean; category?:string; manufacturer?:string; model?:string; age?:string; previousProject?:string; issues?:string; description?:string; weightG?:number; originalPrice?:number; maxDays?:number; deposit?:number; tags?:string; images?:string[]; video?:string; applications?:string; searchKeywords?:string; title?:string };
export type Order = { id: string; listingId: string; name: string; mode: Mode; quantity: number; days: number; amount: number; buyerConfirmed: boolean; sellerConfirmed: boolean; status: 'Reserved' | 'Completed' | 'Cancelled' };
export type Market = { listings: Listing[]; orders: Order[] };
export const initialMarket: Market = {listings: [], orders: []};
export function publish(state: Market, listing: Listing): Market {
 if (!listing.name.trim() || !Number.isInteger(listing.quantity) || listing.quantity < 1 || !Number.isFinite(listing.price) || listing.price < 0 || !['Sell','Rent','Donate'].includes(listing.mode)) throw new Error('Check name, quantity and price.');
 if (state.listings.some(l=>l.id===listing.id)) throw new Error('Listing already exists.');
 return {...state,listings:[{...listing,price:listing.mode==='Donate'?0:listing.price},...state.listings]};
}
export function reserve(state: Market, id: string, quantity: number, days: number, orderId: string): Market {
 const l=state.listings.find(l=>l.id===id);
 if (!l || l.archived || !Number.isInteger(quantity) || quantity<1 || quantity>l.quantity || !Number.isInteger(days) || days<1) throw new Error('Requested quantity or rental duration is unavailable.');
 if (l.mode==='Rent' && l.maxDays && days>l.maxDays) throw new Error('Rental exceeds the seller’s maximum duration.');
 if (state.orders.some(o=>o.id===orderId)) throw new Error('Order already exists.');
 const order: Order={id:orderId,listingId:id,name:l.name,mode:l.mode,quantity,days:l.mode==='Rent'?days:1,amount:l.mode==='Donate'?0:l.price*quantity*(l.mode==='Rent'?days:1),buyerConfirmed:false,sellerConfirmed:false,status:'Reserved'};
 return {listings:state.listings.map(x=>x.id===id?{...x,quantity:x.quantity-quantity}:x),orders:[order,...state.orders]};
}
export function confirm(state:Market,id:string,role:'buyer'|'seller'):Market {
 return {...state,orders:state.orders.map(o=>{if(o.id!==id || o.status!=='Reserved')return o; const next={...o,[role==='buyer'?'buyerConfirmed':'sellerConfirmed']:true};return {...next,status:next.buyerConfirmed&&next.sellerConfirmed?'Completed':'Reserved'};})};
}
export function cancel(state:Market,id:string):Market {
 const order=state.orders.find(o=>o.id===id);if(!order || order.status!=='Reserved')return state;
 return {orders:state.orders.map(o=>o.id===id?{...o,status:'Cancelled'}:o),listings:state.listings.map(l=>l.id===order.listingId?{...l,quantity:l.quantity+order.quantity}:l)};
}
export const revenue=(state:Market)=>state.orders.filter(o=>o.status==='Completed').reduce((n,o)=>n+o.amount,0);
