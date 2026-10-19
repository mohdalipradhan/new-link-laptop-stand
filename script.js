const gallery = [
 ['hero-desk','On the desk','Silver aluminium stand holding a laptop on a wooden desk'],
 ['stand-product','The aluminium X-frame','Open silver aluminium laptop stand'],
 ['unfold-diagram-poster','Opens in 3 steps','Setup diagram showing how to unfold the stand'],
 ['laptop-side-angle-generated','Height & angle','Side view of a laptop supported on the adjustable aluminium stand','png'],
 ['grey-silicone-pad-generated','Grey silicone pads','Close-up of the grey silicone pad','png'],
 ['lifestyle-home','Work from home','Woman using a raised laptop and separate keyboard'],
 ['travel-bag','Fold & carry','Folded stand beside a laptop bag'],
 ['stand-with-dumbbells-generated','With dumbbells · AI illustration; load capacity unverified','AI-generated conceptual illustration of a silver laptop stand supporting two black dumbbells','png']
];
const thumbs = document.querySelector('#thumbnails');
let current = 0;
gallery.forEach(([file,caption,alt,ext="jpg"],i) => {
 const button = document.createElement('button');
 button.type='button'; button.setAttribute('aria-label',caption);
 button.innerHTML=`<img src="assets/${file}.${ext}" alt="" width="80" height="80">`;
 button.addEventListener('click',()=>showImage(i)); thumbs.append(button);
});
function showImage(i){
 current=(i+gallery.length)%gallery.length;
 const [file,caption,alt,ext="jpg"]=gallery[current];
 const image=document.querySelector('#gallery-main');
 image.src=`assets/${file}.${ext}`;image.alt=alt;
 image.style.objectFit=(current===1||file==='stand-with-dumbbells-generated'||file==='laptop-side-angle-generated')?'contain':'cover';
 document.querySelector('#gallery-caption').textContent=caption;
 [...thumbs.children].forEach((button,index)=>button.setAttribute('aria-pressed',String(index===current)));
}
showImage(0);
document.querySelector('.prev').addEventListener('click',()=>showImage(current-1));
document.querySelector('.next').addEventListener('click',()=>showImage(current+1));
document.querySelector('.gallery').addEventListener('keydown',e=>{
 if(e.key==='ArrowRight'){e.preventDefault();showImage(current+1)}
 if(e.key==='ArrowLeft'){e.preventDefault();showImage(current-1)}
});
const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const dialog=document.querySelector('#order-dialog');
function updateOrder(){
 const online=document.querySelector('input[name=payment]:checked').value==='online';
 const text=`Hi, I would like to order the foldable aluminium laptop stand (SKU DS106719) with ${online?'online payment at ₹599':'Cash on Delivery at ₹699'}. Please confirm availability, delivery and return terms.`;
 document.querySelector('#order-whatsapp').href='https://wa.me/919131956290?text='+encodeURIComponent(text);
}
document.querySelectorAll('[data-order]').forEach(b=>b.addEventListener('click',()=>{updateOrder();dialog.showModal()}));
document.querySelectorAll('[name=payment]').forEach(r=>r.addEventListener('change',updateOrder));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

// Two height illustrations: manual controls, arrow keys and touch swipes.
const heightCarousel=document.querySelector('.height-carousel');
if(heightCarousel){
 const slides=[...heightCarousel.querySelectorAll('.height-slide')];
 const choices=[...heightCarousel.querySelectorAll('[data-height-slide]')];
 let active=0;
 function setHeightSlide(index){
  active=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{slide.hidden=i!==active});
  choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
  heightCarousel.querySelector('.height-status').textContent=active===0?'Lowest setting · approximately 6 cm':'Highest setting · approximately 14 cm';
 }
 heightCarousel.querySelector('.height-prev').addEventListener('click',()=>setHeightSlide(active-1));
 heightCarousel.querySelector('.height-next').addEventListener('click',()=>setHeightSlide(active+1));
 choices.forEach((button,i)=>button.addEventListener('click',()=>setHeightSlide(i)));
 heightCarousel.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'){event.preventDefault();setHeightSlide(active+1)}
  if(event.key==='ArrowLeft'){event.preventDefault();setHeightSlide(active-1)}
 });
 let touchStart=null;
 heightCarousel.querySelector('.height-slides').addEventListener('touchstart',event=>{touchStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
 heightCarousel.querySelector('.height-slides').addEventListener('touchend',event=>{
  if(!touchStart)return;
  const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))setHeightSlide(active+(dx<0?1:-1));
  touchStart=null;
 },{passive:true});
 heightCarousel.querySelector('.height-slides').addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
}
