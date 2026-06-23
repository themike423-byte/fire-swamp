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
