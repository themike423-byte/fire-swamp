// year in footer
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// sticky / solid nav on scroll
var nav = document.getElementById('nav');
if (nav) addEventListener('scroll', function(){ nav.classList.toggle('solid', scrollY > 40); });

// mobile hamburger menu
var toggle = document.getElementById('toggle'), links = document.getElementById('navlinks');
if (toggle && links) {
  toggle.addEventListener('click', function(){ links.classList.toggle('open'); toggle.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('open'); toggle.classList.remove('open'); });
  });
}

// reveal-on-scroll
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

// jobs accordion (jobs page only)
document.querySelectorAll('.job-toggle').forEach(function(btn){
  btn.addEventListener('click', function(){
    var card = btn.closest('.jobcard');
    var open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// hero market-status badge (home page only)
(function(){
  var text = document.getElementById('heroStatusText'), dot = document.getElementById('heroDot');
  if(!text) return;
  var now = new Date();
  var day = now.getDay(), hr = now.getHours();
  var names = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var marketDays = [0,4];
  var openNow = marketDays.includes(day) && hr >= 8 && hr < 13;
  var nextOffset = 99, nextDay = day;
  for(var i=0;i<=7;i++){ var d=(day+i)%7; if(marketDays.includes(d) && !(i===0 && hr>=13)){ nextOffset=i; nextDay=d; break; } }
  if(openNow){ if(dot) dot.classList.add('live'); var loc = day===0 ? 'Civic Center, San Rafael' : 'Ave of the Flags, San Rafael'; text.textContent = 'Open right now, ' + loc + ', til 1PM'; }
  else if(nextOffset===0){ text.textContent = 'At market today, ' + names[nextDay] + ', 8AM to 1PM'; }
  else { var when = nextOffset===1 ? 'tomorrow' : names[nextDay]; text.textContent = 'Next market: ' + when + ', San Rafael, 8 to 1'; }
  document.querySelectorAll('.market').forEach(function(m){
    var md = +m.dataset.day, tag = m.querySelector('.tag');
    if(openNow && md===day){ tag.classList.add('now'); tag.textContent='Open now'; }
    else if(md===nextDay && nextOffset>=0){ tag.classList.add('next'); tag.textContent = nextOffset<=1 ? (nextOffset===0?'Today':'Tomorrow') : 'Up next'; }
  });
})();

/* Instagram feed (bakes page only). Lightweight: native lazy-loaded /embed/
   iframes, no embed.js runtime, so off-screen posts never block load.
   Swap or curate posts by editing this list (skip Reels/videos). */
var IG_POSTS = [
  "https://www.instagram.com/p/DZ1GCcShwC8/",
  "https://www.instagram.com/p/DZqur6NGteo/",
  "https://www.instagram.com/p/DZYvdRJhdld/",
  "https://www.instagram.com/p/DYdLK_1hJZZ/",
  "https://www.instagram.com/p/DWtwyVcjcmb/",
  "https://www.instagram.com/p/DWJZj38j7af/",
  "https://www.instagram.com/p/DWElf5tARN8/",
  "https://www.instagram.com/p/DVnzYunAQLh/",
  "https://www.instagram.com/p/DP20P6rjrvL/",
  "https://www.instagram.com/p/DPxqal6kaNN/",
  "https://www.instagram.com/p/DPscdyaDpeG/",
  "https://www.instagram.com/p/DNEpe0VS1X0/",
];
(function(){
  var embed = document.getElementById('igEmbed');
  if(!embed || !IG_POSTS.length) return;
  embed.innerHTML = IG_POSTS.map(function(u){
    var m = u.match(/\/(?:p|reel)\/([^\/?#]+)/);
    if(!m) return '';
    return '<iframe loading="lazy" title="Fire Swamp Provisions on Instagram" '
      + 'src="https://www.instagram.com/p/'+m[1]+'/embed/"></iframe>';
  }).join('');
})();

// newsletter form (home page only)
function fakeSub(e){
  e.preventDefault();
  e.target.querySelector('input').value='';
  var m = document.getElementById('subMsg');
  if(m) m.textContent = "You're on the list. Now you'll hear about the cool stuff before anybody else.";
  return false;
}

/* =====================================================================
   PRE-ORDER FLOW (preorder.html only)
   This is a front-end prototype of the ordering experience: menu ->
   pickup -> payment -> confirmation -> newsletter -> sent to bakery.
   Payment runs in DEMO / TEST mode; no real charge happens and no email
   is actually sent. To make it live, the marked spots below need a real
   Stripe integration (Checkout/Payment Intent) and a small backend or
   serverless function to email the order to fireswampprovisions@gmail.com.
   ===================================================================== */
(function(){
  var root = document.getElementById('preorder');
  if(!root) return;

  var BAKERY_EMAIL = 'fireswampprovisions@gmail.com';
  var IMG = 'https://static.wixstatic.com/media/';
  var PRODUCTS = [
    {id:'bagels',  name:'Sourdough Bagels',        price:15, unit:'/ 6', d:'Plain, everything, bialys, jalapeno cheddar.', img:IMG+'01393c_df6a6af05de94183a410cd352e13a976~mv2.png/v1/fill/w_240,h_240,al_c,q_80,enc_auto/file.png'},
    {id:'loaf',    name:'Sourdough Sandwich Loaf', price:10, unit:'each', d:'Three-ingredient soft crumb everyday loaf.', img:IMG+'01393c_7d8d68c2e54c4ae5a99535f0b0d2944b~mv2.jpg/v1/fill/w_240,h_240,al_c,q_80,enc_auto/file.jpg'},
    {id:'muffins', name:'English Muffins',         price:13, unit:'/ 6', d:'All nooks, all crannies, built for too much butter.', img:IMG+'01393c_945c5a73193c49a995a3f1f20d374f10~mv2.png/v1/fill/w_240,h_240,al_c,q_80,enc_auto/file.png'},
    {id:'rkt',     name:'RKTs',                    price:5,  unit:'each', d:'The grown-up version of the one you loved as a kid.', img:IMG+'01393c_b950c9ae503e428c9b672d1b3a80151b~mv2.jpg/v1/fill/w_240,h_240,al_c,q_80,enc_auto/file.jpg'},
  ];
  var MARKETS = { 0:{name:'Sunday market', loc:'Marin Civic Center, 3501 Civic Center Dr'}, 4:{name:'Thursday market', loc:'Avenue of the Flags, San Rafael'} };

  var cart = {};               // id -> qty
  var picked = null;           // chosen pickup slot
  var $ = function(id){ return document.getElementById(id); };
  var money = function(n){ return '$' + n.toFixed(2); };
  var cartTotal = function(){ var t=0; PRODUCTS.forEach(function(p){ t += (cart[p.id]||0)*p.price; }); return t; };
  var cartCount = function(){ var c=0; for(var k in cart) c += cart[k]; return c; };

  // ---- step 1: menu ----
  var menu = $('poMenu');
  menu.innerHTML = PRODUCTS.map(function(p){
    return '<div class="po-item">'
      + '<img class="po-thumb" src="'+p.img+'" alt="'+p.name+'" loading="lazy">'
      + '<div class="po-info"><div class="po-name">'+p.name+'</div>'
      + '<div class="po-d">'+p.d+'</div>'
      + '<div class="po-price">'+money(p.price)+' '+p.unit+'</div></div>'
      + '<div class="qty"><button type="button" aria-label="Remove one" data-dec="'+p.id+'">&minus;</button>'
      + '<span class="q" id="q-'+p.id+'">0</span>'
      + '<button type="button" aria-label="Add one" data-inc="'+p.id+'">+</button></div></div>';
  }).join('');

  function setQty(id, n){
    cart[id] = Math.max(0, n);
    if(cart[id]===0) delete cart[id];
    var qEl = $('q-'+id); if(qEl) qEl.textContent = cart[id]||0;
    renderSummary();
  }
  menu.addEventListener('click', function(e){
    var inc = e.target.getAttribute('data-inc'), dec = e.target.getAttribute('data-dec');
    if(inc) setQty(inc, (cart[inc]||0)+1);
    if(dec) setQty(dec, (cart[dec]||0)-1);
  });

  function lineHtml(){
    var rows = PRODUCTS.filter(function(p){return cart[p.id];}).map(function(p){
      return '<div class="po-line"><span class="l">'+(cart[p.id])+'&times; '+p.name+'</span><span class="r">'+money(cart[p.id]*p.price)+'</span></div>';
    });
    return rows.length ? rows.join('') : '<div class="po-empty">No items yet. Add something tasty.</div>';
  }
  function renderSummary(){
    ['poLines1','poLines3'].forEach(function(id){ var el=$(id); if(el) el.innerHTML = lineHtml(); });
    ['poTotal1','poTotal3'].forEach(function(id){ var el=$(id); if(el) el.textContent = money(cartTotal()); });
    var c1 = $('poContinue1'); if(c1) c1.disabled = cartCount()===0;
    var pay = $('poPay'); if(pay) pay.textContent = 'Pay '+money(cartTotal());
  }

  // pre-add via ?add=bagels (from the per-item links on the bakes page)
  var add = (location.search.match(/[?&]add=([^&]+)/)||[])[1];
  if(add && PRODUCTS.some(function(p){return p.id===add;})) setQty(add, 1);
  renderSummary();

  // ---- step 2: pickup slots ----
  function buildSlots(){
    var slots=[], d=new Date(); d.setHours(0,0,0,0);
    for(var i=1;i<=21 && slots.length<4;i++){
      var x=new Date(d); x.setDate(d.getDate()+i);
      var wd=x.getDay();
      if(wd===0||wd===4) slots.push({wd:wd, date:x});
    }
    return slots;
  }
  var slotWrap = $('poSlots');
  buildSlots().forEach(function(s, i){
    var m = MARKETS[s.wd];
    var label = s.date.toLocaleDateString(undefined,{weekday:'long', month:'short', day:'numeric'});
    var lbl = document.createElement('label');
    lbl.className = 'po-slot';
    lbl.innerHTML = '<input type="radio" name="poSlot" value="'+i+'">'
      + '<span><span class="d">'+label+'</span>'
      + '<span class="m">'+m.name+' &middot; '+m.loc+' &middot; 8 AM to 1 PM</span></span>';
    lbl.querySelector('input').addEventListener('change', function(){
      picked = {label:label, market:m.name, loc:m.loc};
      [].forEach.call(slotWrap.children, function(c){ c.classList.remove('sel'); });
      lbl.classList.add('sel');
    });
    slotWrap.appendChild(lbl);
  });

  // ---- step navigation ----
  function goStep(n){
    [].forEach.call(root.querySelectorAll('.po-step'), function(s){ s.hidden = (+s.dataset.step !== n); });
    var lis = root.querySelectorAll('.po-steps li');
    [].forEach.call(lis, function(li, i){
      li.classList.toggle('active', i === n-1);
      li.classList.toggle('done', i < n-1);
    });
    root.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // ---- validation helpers ----
  function flag(fieldId, ok){ var f=$(fieldId); if(f) f.classList.toggle('invalid', !ok); return ok; }
  var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  $('poContinue1').addEventListener('click', function(){ if(cartCount()) goStep(2); });
  $('poBack2').addEventListener('click', function(){ goStep(1); });
  $('poContinue2').addEventListener('click', function(){
    var okName = flag('f-name', $('poName').value.trim().length>1);
    var okEmail = flag('f-email', emailRe.test($('poEmail').value.trim()));
    var okPhone = flag('f-phone', $('poPhone').value.replace(/\D/g,'').length>=7);
    var okSlot = flag('f-slot', !!picked);
    if(okName && okEmail && okPhone && okSlot) goStep(3);
  });
  $('poBack3').addEventListener('click', function(){ goStep(2); });

  // ---- payment field formatting (cosmetic, demo only) ----
  var cardNum = $('poCardNum');
  cardNum.addEventListener('input', function(){
    var v = cardNum.value.replace(/\D/g,'').slice(0,16);
    cardNum.value = v.replace(/(.{4})/g,'$1 ').trim();
  });
  var exp = $('poExp');
  exp.addEventListener('input', function(){
    var v = exp.value.replace(/\D/g,'').slice(0,4);
    exp.value = v.length>2 ? v.slice(0,2)+' / '+v.slice(2) : v;
  });
  $('poCvc').addEventListener('input', function(e){ e.target.value = e.target.value.replace(/\D/g,'').slice(0,4); });

  $('poPay').addEventListener('click', function(){
    var okNum = flag('f-card', cardNum.value.replace(/\s/g,'').length>=15);
    var okExp = flag('f-exp', exp.value.replace(/\D/g,'').length===4);
    var okCvc = flag('f-cvc', $('poCvc').value.length>=3);
    if(!(okNum && okExp && okCvc)) return;

    var btn = $('poPay'); btn.disabled = true; var orig = btn.textContent; btn.textContent = 'Processing...';

    // --- INTEGRATION POINT ---------------------------------------------
    // Real version: send `order` to a serverless endpoint that (1) creates
    // a Stripe PaymentIntent / Checkout Session to charge the card, and
    // (2) emails the confirmed order to BAKERY_EMAIL. Here we just simulate.
    var order = {
      items: PRODUCTS.filter(function(p){return cart[p.id];}).map(function(p){return {name:p.name, qty:cart[p.id], price:p.price};}),
      total: cartTotal(), pickup: picked,
      customer: {name:$('poName').value.trim(), email:$('poEmail').value.trim(), phone:$('poPhone').value.trim()}
    };
    console.log('[Fire Swamp pre-order DEMO] order payload (would POST to Stripe + bakery email):', order);
    // -------------------------------------------------------------------

    setTimeout(function(){
      btn.disabled = false; btn.textContent = orig;
      fillConfirmation(order);
      goStep(4);
    }, 1100);
  });

  // ---- step 4: confirmation + newsletter + sent ----
  function orderNumber(){ return 'FSP-' + (Date.now().toString(36).toUpperCase().slice(-6)); }
  function fillConfirmation(order){
    var no = orderNumber();
    $('poOrdNo').textContent = 'Order ' + no;
    $('poConfEmail').textContent = order.customer.email;
    $('poNewsEmail').value = order.customer.email;
    $('poSentEmail').textContent = order.customer.email;
    var recap = order.items.map(function(it){
      return '<div class="po-line"><span class="l">'+it.qty+'&times; '+it.name+'</span><span class="r">'+money(it.qty*it.price)+'</span></div>';
    }).join('');
    recap += '<div class="po-line" style="margin-top:8px"><span class="l">Pickup</span><span class="r">'+order.pickup.label+', '+order.pickup.market+'</span></div>';
    recap += '<div class="po-total"><span>Total paid</span><span class="r">'+money(order.total)+'</span></div>';
    $('poRecap').innerHTML = '<h4>Your order</h4>' + recap;
  }
  function finishNewsletter(subscribed){
    var msg = $('poNewsMsg');
    msg.textContent = subscribed
      ? "You're on the list. Talk soon."
      : "No problem, maybe next time.";
    $('poSubscribe').disabled = true; $('poSkip').disabled = true;
    $('poSent').hidden = false;
    $('poSent').scrollIntoView({behavior:'smooth', block:'center'});
  }
  $('poSubscribe').addEventListener('click', function(){ finishNewsletter(true); });
  $('poSkip').addEventListener('click', function(){ finishNewsletter(false); });
  var restart = $('poRestart'); if(restart) restart.addEventListener('click', function(){ location.href = 'preorder.html'; });

  goStep(1);
})();
