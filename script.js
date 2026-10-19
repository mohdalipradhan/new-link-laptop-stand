const gallery = [
 ['hero-desk-generated','On the desk','Silver laptop on the aluminium X-frame stand in a naturally lit workspace','png'],
 ['stand-product','The aluminium X-frame','Open silver aluminium laptop stand'],
 ['unfold-three-steps-generated','Opens in 3 steps','Three-step illustration: start flat, open the X-frame, then lift and set your height','png'],
 ['laptop-side-angle-generated','Height & angle','Side view of a laptop supported on the adjustable aluminium stand','png'],
 ['grey-silicone-pad-generated','Grey silicone pads','Close-up of the grey silicone pad','png'],
 ['lifestyle-home','Work from home','Woman using a raised laptop and separate keyboard'],
 ['travel-bag','Fold & carry','Folded stand beside a laptop bag'],
 ['posture-before-generated','Before · Laptop flat on desk','Person looking down while using a laptop directly on the desk','webp'],
 ['posture-after-generated','After · Raised laptop setup','Same person using a raised laptop with a separate keyboard and mouse','webp'],
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
 image.style.objectFit=(current===1||current===2||file==='stand-with-dumbbells-generated'||file==='laptop-side-angle-generated'||file.startsWith('posture-'))?'contain':'cover';
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
let selectedPayment='online';
let razorpayPaymentLink='';
try{
 const configured=window.LAPTOP_STAND_PAYMENT?.razorpayPaymentLink;
 if(configured){
  const url=new URL(configured);
  if(url.protocol==='https:'&&(url.hostname==='rzp.io'||url.hostname==='razorpay.com'||url.hostname.endsWith('.razorpay.com'))){razorpayPaymentLink=url.href}
 }
}catch{}
function updateOrder(){
 const online=selectedPayment==='online';
 document.querySelectorAll('[name="hero-payment"],[name="payment"]').forEach(radio=>{radio.checked=radio.value===selectedPayment});
 document.querySelectorAll('.payment-variant').forEach(label=>label.classList.toggle('is-selected',label.querySelector('input').checked));
 document.querySelector('.payment-main-button').textContent=online?'Express checkout · ₹599':'Continue with COD · ₹699';
 document.querySelector('.payment-gateway').hidden=!online;
 const mobile=document.querySelector('.mobile-buy');
 mobile.querySelector('div').innerHTML=online?'<b>₹599 <small>online</small></b><small>Save ₹100 · Free shipping</small>':'<b>₹699 <small>COD</small></b><small>Pay at your door · Free shipping</small>';
 mobile.querySelector('[data-order]').textContent=online?'Express checkout':'Choose COD';
 const text=`Hi, I would like to order the foldable aluminium laptop stand (SKU DS106719) with ${online?'online payment at ₹599 via Razorpay (please share your payment link)':'Cash on Delivery at ₹699'}. Please confirm availability, delivery and return terms.`;
 document.querySelector('#order-whatsapp').href='https://wa.me/919131956290?text='+encodeURIComponent(text);
 document.querySelector('#order-payment-summary').textContent=online?'Online payment · ₹599. Confirm your order with New Link and request a Razorpay payment link.':'Cash on Delivery · ₹699. Contact New Link to confirm your delivery details.';
}
document.querySelectorAll('[name="hero-payment"],[name="payment"]').forEach(radio=>radio.addEventListener('change',()=>{selectedPayment=radio.value;updateOrder()}));
document.querySelectorAll('[data-order]').forEach(button=>button.addEventListener('click',()=>{
 updateOrder();
 if(selectedPayment==='online'&&razorpayPaymentLink){window.location.assign(razorpayPaymentLink);return}
 dialog.showModal();
}));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
updateOrder();

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

// Each airflow video has its own pause control and respects reduced motion.
document.querySelectorAll('.airflow-animation-toggle').forEach(toggle=>{
 const video=document.getElementById(toggle.getAttribute('aria-controls'));
 if(!video)return;
 const name=video.id==='flat-desk-video'?'flat-desk':'open-frame';
 const syncLabel=()=>{
  toggle.textContent=video.paused?'Play animation':'Pause animation';
  toggle.setAttribute('aria-label',`${video.paused?'Play':'Pause'} ${name} animation`);
 };
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const applyMotion=()=>{if(reducedMotion.matches){video.autoplay=false;video.pause()}syncLabel()};
 applyMotion();reducedMotion.addEventListener('change',applyMotion);
 video.addEventListener('play',syncLabel);video.addEventListener('pause',syncLabel);
 toggle.addEventListener('click',()=>{if(video.paused){video.play().catch(syncLabel)}else{video.pause()}});
});
