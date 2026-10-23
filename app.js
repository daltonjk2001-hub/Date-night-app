/* Native Haptic Feedback Helper */
function triggerHaptic(type = 'light') {
  if (typeof appSettings !== 'undefined' && !['both','vibration'].includes(appSettings.feedback)) return;
  if (!navigator.vibrate) return;
  if (type === 'light') navigator.vibrate(15);
  else if (type === 'success') navigator.vibrate([40, 60, 40]);
  else if (type === 'heavy') navigator.vibrate(50);
}

const audioCtx = (() => { try { return new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; } })();
function playSound(type) {
  if (typeof appSettings !== 'undefined' && !['both','sound'].includes(appSettings.feedback)) return;
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  if(type === 'swipe') { osc.frequency.setValueAtTime(350, now); osc.frequency.exponentialRampToValueAtTime(120, now + .08); gain.gain.setValueAtTime(.12, now); gain.gain.linearRampToValueAtTime(.01, now + .08); osc.start(now); osc.stop(now + .08); }
  else if(type === 'ban') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(160, now); osc.frequency.exponentialRampToValueAtTime(70, now + .1); gain.gain.setValueAtTime(.15, now); gain.gain.linearRampToValueAtTime(.01, now + .1); osc.start(now); osc.stop(now + .1); }
  else if(type === 'tick') { osc.type = 'sine'; osc.frequency.setValueAtTime(550, now); gain.gain.setValueAtTime(.04, now); gain.gain.linearRampToValueAtTime(.01, now + .03); osc.start(now); osc.stop(now + .03); }
  else if(type === 'win') { osc.type = 'triangle'; osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + .1); osc.frequency.setValueAtTime(783, now + .2); gain.gain.setValueAtTime(.15, now); gain.gain.linearRampToValueAtTime(.01, now + .35); osc.start(now); osc.stop(now + .35); }
}

const masterDeck = [
  { id:"baking-01", icon:"🥧", title:"Apple-Blackberry Lattice Pie", detail:"Make an all-butter pie dough from scratch, roll out a woven lattice top, and fill with fresh apple and blackberry.", category:"baking" },
  { id:"baking-02", icon:"🥐", title:"Cream Cheese Danish Batch", detail:"Make laminated pastry dough from scratch, fill with sweet cream cheese and fruit preserves, and bake until golden.", category:"baking" },
  { id:"baking-03", icon:"🍫", title:"Rich Chocolate Fudge Cake", detail:"Bake a moist scratch chocolate cake with homemade rich chocolate fudge glaze completely from scratch.", category:"baking" },
  { id:"baking-04", icon:"🎃", title:"Spiced Pumpkin Pie", detail:"Make a flaky butter crust from scratch, mix up a spiced pumpkin custard filling, and bake until golden.", category:"baking" },
  { id:"baking-05", icon:"🍞", title:"Cinnamon Pull-Apart Bread", detail:"Mix a rich yeast dough from scratch, layer with butter, condensed milk and cinnamon, and bake in a loaf pan.", category:"baking" },
  { id:"baking-06", icon:"🍑", title:"Cast-Iron Peach Skillet Cobbler", detail:"Whip up a sweet scratch batter, pour over spiced peaches in a hot cast-iron skillet, and bake until golden.", category:"baking" },
  { id:"baking-07", icon:"🫐", title:"Glazed Blueberry Scones", detail:"Cut cold butter into flour and cream to create crumbly, scratch-made blueberry scones topped with vanilla glaze.", category:"baking" },
  { id:"baking-08", icon:"🥕", title:"Classic Layered Carrot Cake", detail:"Grate fresh carrots, bake a spiced sponge cake from scratch, and stack with homemade cream cheese frosting.", category:"baking" },
  { id:"baking-09", icon:"🫐", title:"Raspberry Cream Cheese Turnovers", detail:"Roll out quick scratch puff pastry, fold over tart raspberry and sweet cream cheese filling, and bake until flaky.", category:"baking" },
  { id:"baking-10", icon:"🍮", title:"Warm Caramel Apple Bread Pudding", detail:"Tear up scratch-baked bread, soak in vanilla custard, bake in a dish, and drizzle with homemade caramel sauce.", category:"baking" },
  { id:"minecraft-01", icon:"🏰", title:"Underground Vault Bunker", detail:"Dig down to deepslate coordinates and spend the night carving out a massive, lit underground storage & treasury bunker.", category:"game" },
  { id:"minecraft-02", icon:"🔥", title:"Nether Fortress Outpost", detail:"Portal into a Nether basalt delta and build a fully fortified stone-brick bridge and safe-house.", category:"game" },
  { id:"minecraft-03", icon:"🏘️", title:"Village Wall & Lighting Overhaul", detail:"Take over a village, build a stone defensive wall around the entire perimeter, and place lanterns on every single building.", category:"game" },
  { id:"minecraft-04", icon:"🚨", title:"Mountain Peak Redstone Lighthouse", detail:"Travel to the highest mountain peak on your map and build a towering stone lighthouse with an automated redstone light.", category:"game" },
  { id:"minecraft-05", icon:"🔱", title:"Ocean Monument Expedition Base", detail:"Sail into deep ocean, locate a monument, and set up a temporary staging camp and diving platform.", category:"game" },
  { id:"movie-01", icon:"⚔️", title:"Epic Medieval Action Debut", detail:"Stream a gritty, large-scale medieval or ancient warfare movie that neither of you has ever seen.", category:"movie" },
  { id:"movie-02", icon:"💥", title:"High-Octane Action-Comedy", detail:"Put on an explosive, laugh-out-loud action-comedy film you both skipped in theaters.", category:"movie" },
  { id:"movie-03", icon:"🪖", title:"Historical War Epic Premiere", detail:"Queue up a critically acclaimed historical combat film for a heavy, first-time watch.", category:"movie" },
  { id:"movie-04", icon:"🌋", title:"Big-Budget Adventure Premiere", detail:"Pick a massive-scale cinematic adventure or fantasy blockbuster released recently on streaming.", category:"movie" },
  { id:"movie-05", icon:"⛺", title:"Survival Action Thriller", detail:"Stream a fast-paced wilderness or disaster survival movie with zero prior spoilers.", category:"movie" },
  { id:"series-01", icon:"🐉", title:"Epic Fantasy TV show", detail:"Watch the first two episodes back-to-back of a massive-scale fantasy or mythos adventure series.", category:"TV show" },
  { id:"series-02", icon:"🚀", title:"Sci-Fi / Space Adventure Premiere", detail:"Stream the pilot episodes of a high-budget sci-fi or futuristic adventure series.", category:"TV show" },
  { id:"series-03", icon:"🤠", title:"Action-Adventure Expedition Start", detail:"Watch the first two episodes of a fast-paced exploration or survival adventure show.", category:"TV show" },
  { id:"series-04", icon:"🎬", title:"Action-Comedy TV show", detail:"Stream the opening episodes of a witty, high-energy action-comedy series.", category:"TV show" },
  { id:"series-05", icon:"📺", title:"Pilot Week Adventure Triple-Feature", detail:"Stream the pilot episodes of three completely different fantasy, action, or adventure series back-to-back.", category:"TV show" }
];

const STORAGE = { custom:"dateArcadeCustomDeck", deleted:"dateArcadeDeletedBuiltins", categories:"dateArcadeSelectedCategories", filters:"dateArcadeFilters" };
function readStorage(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch(e) { return fallback; } }
function safeSetItem(key, value) { try { localStorage.setItem(key, value); return true; } catch(e) { console.warn('Could not save local app data:', key, e); return false; } }

/* A2HS PWA Installation Handler */
let deferredInstallPrompt = null;

function checkIsStandalone() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches;
  const isNavigatorStandalone = window.navigator.standalone === true;
  return isStandaloneMatch || (isIOS && isNavigatorStandalone);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

function renderContextualInstallPrompt() {
  if (checkIsStandalone()) return;
  const container = document.getElementById('installBannerContainer');
  if (!container) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (deferredInstallPrompt) {
    container.innerHTML = `
      <div class="install-banner">
        <div class="install-text">
          <strong>📱 Install Date Night Decider</strong>
          <p>Add to your home screen for instant fullscreen access and zero decision fatigue!</p>
        </div>
        <button class="primary-btn install-btn" onclick="triggerPWAInstallation()">Install</button>
      </div>
    `;
    container.style.display = 'block';
  } else if (isIOS) {
    container.innerHTML = `
      <div class="install-banner ios-banner">
        <div class="install-text">
          <strong>📲 Add to Home Screen</strong>
          <p>Tap <span class="ios-icon">⎋</span> <strong>Share</strong> in Safari, then select <strong>'Add to Home Screen'</strong> <span class="ios-icon">➕</span>!</p>
        </div>
        <button class="close-settings-btn" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
      </div>
    `;
    container.style.display = 'block';
  }
}

async function triggerPWAInstallation() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') {
    console.info('User accepted the PWA install prompt.');
  }
  deferredInstallPrompt = null;
  const container = document.getElementById('installBannerContainer');
  if (container) container.style.display = 'none';
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const container = document.getElementById('installBannerContainer');
  if (container) container.style.display = 'none';
});

let customDeck = readStorage(STORAGE.custom, []);
if (!Array.isArray(customDeck)) customDeck = [];
const legacyCategoryMap = { "Scratch Baking":"baking", "Minecraft Project":"game", "First-Time Movie":"movie", "Series Pilot":"TV show" };
customDeck = customDeck.filter(item => item && typeof item === "object").map(item => ({ ...item, category: legacyCategoryMap[item.category] || item.category })).filter(validActivity);
const savedDeletedBuiltins = readStorage(STORAGE.deleted, []);
let deletedBuiltins = new Set(Array.isArray(savedDeletedBuiltins) ? savedDeletedBuiltins.filter(id => typeof id === "string" && masterDeck.some(item => item.id === id)) : []);
let fullDeck = [];
let activeDeck = [];
function saveDecks() {
  safeSetItem(STORAGE.custom, JSON.stringify(customDeck));
  safeSetItem(STORAGE.deleted, JSON.stringify([...deletedBuiltins]));
}
function refreshDecks() {
  fullDeck = [...masterDeck.filter(item => !deletedBuiltins.has(item.id)), ...customDeck];
  const selected = [...document.querySelectorAll(".category-choice:checked")].map(input => input.value);
  activeDeck = fullDeck.filter(item => selected.includes(item.category) && matchesFilters(item));
  const summaryEl = document.getElementById("categorySummary");
  if (summaryEl) {
    summaryEl.textContent = selected.length === 4 ? `All categories selected (${activeDeck.length} ideas) ▾` : selected.length === 0 ? "No categories selected ▾" : `${selected.length} categor${selected.length === 1 ? "y" : "ies"} selected (${activeDeck.length} ideas) ▾`;
  }
}
const shuffle = a => { for(let i=a.length-1; i>0; i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

function applyCategoryFilter() {
  const selected = [...document.querySelectorAll(".category-choice:checked")].map(input => input.value);
  safeSetItem(STORAGE.categories, JSON.stringify(selected));
  refreshDecks();
  initMatcher(); initDraft(); initWheel(); renderDailyDate();
  if (document.getElementById("card-library")?.classList.contains("active-mode")) renderLibrary();
}

function saveFilters() {
  const filters = {
    time: document.getElementById("timeFilter").value,
    budget: document.getElementById("budgetFilter").value,
    energy: document.getElementById("energyFilter").value
  };
  safeSetItem(STORAGE.filters, JSON.stringify(filters));
  applyCategoryFilter();
}

function setAllCategories(checked) {
  document.querySelectorAll(".category-choice").forEach(input => input.checked = checked);
  applyCategoryFilter();
}
function switchGame(mode, button) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active-mode'));
  button.classList.add('active');
  document.getElementById(`card-${mode}`).classList.add('active-mode');
  if(mode === 'matcher') initMatcher();
  if(mode === 'draft') initDraft();
  if(mode === 'wheel') initWheel();
  if(mode === 'library') renderLibrary();
  if(mode === 'vote') renderVoting();
  if(mode === 'history') renderHistory();
}

/* TOP-RIGHT GEAR SETTINGS TOGGLE LOGIC */
function toggleSettingsMenu() {
  const menu = document.getElementById("settingsDropdown");
  if (!menu) return;
  const isShowing = menu.classList.contains("show");
  if (isShowing) {
    menu.classList.remove("show");
  } else {
    triggerHaptic('light');
    playSound('tick');
    menu.classList.add("show");
  }
}

// Click outside settings popover or category details
document.addEventListener('click', (e) => {
  const picker = document.getElementById('categoryPicker');
  if (picker && picker.open && !picker.contains(e.target)) {
    picker.open = false;
  }
  const settingsMenu = document.getElementById('settingsDropdown');
  const gearBtn = document.getElementById('gearBtn');
  if (settingsMenu && settingsMenu.classList.contains('show')) {
    if (!settingsMenu.contains(e.target) && !gearBtn?.contains(e.target)) {
      settingsMenu.classList.remove('show');
    }
  }
});

/* MATCHER */
let p1Deck = [], p2Deck = [], p1Likes = [], p2Likes = [], swipePlayer = 1, swipeIndex = 0;
function initMatcher() {
  p1Deck = shuffle([...activeDeck]); p2Deck = shuffle([...activeDeck]);
  p1Likes = []; p2Likes = []; swipePlayer = 1; swipeIndex = 0;
  updateSwipeCard();
}
function updateSwipeCard() {
  const curDeck = swipePlayer === 1 ? p1Deck : p2Deck;
  const header = document.getElementById("matcherTurnHeader");
  if (!header) return;
  if (!curDeck.length) {
    header.textContent = "No ideas in this category";
    document.getElementById("cardIcon").textContent = "📚";
    document.getElementById("cardCategory").textContent = "Library is empty";
    document.getElementById("cardTitle").textContent = "Add or restore an idea";
    document.getElementById("cardDetail").textContent = "Add a custom idea below in the Library.";
    return;
  }
  header.textContent = `Player ${swipePlayer}'s Turn · Card ${Math.min(swipeIndex + 1, curDeck.length)} of ${curDeck.length}`;
  if(swipeIndex >= curDeck.length) {
    if(swipePlayer === 1) { swipePlayer = 2; swipeIndex = 0; alert("Player 1 complete! Pass the phone to Player 2."); updateSwipeCard(); }
    else {
      const mutual = p1Likes.filter(a => p2Likes.some(b => b.id === a.id));
      if(mutual.length) { 
        const match = mutual[Math.floor(Math.random() * mutual.length)]; 
        window.currentWinner=match; 
        showModal("💖", "It's a Match!", match.title, match.detail, match.icon);
        renderContextualInstallPrompt(); // Surface install prompt on successful match milestone
      }
      else showModal("🤝", "No Direct Matches", "Try Draft Mode!", "You swiped differently! Hop into Elimination Draft to settle it.", "🎲");
    }
    return;
  }
  const item = curDeck[swipeIndex];
  document.getElementById("cardIcon").textContent = item.icon;
  document.getElementById("cardCategory").textContent = item.category;
  document.getElementById("cardTitle").textContent = item.title;
  document.getElementById("cardDetail").textContent = item.detail;
}
function handleSwipe(liked) {
  const curDeck = swipePlayer === 1 ? p1Deck : p2Deck;
  if (swipeIndex >= curDeck.length) return;
  playSound('swipe');
  triggerHaptic('light');
  if(liked) (swipePlayer === 1 ? p1Likes : p2Likes).push(curDeck[swipeIndex]);
  swipeIndex++; updateSwipeCard();
}

// Swipe Card Drag Physics with Dynamic Event Binding
let isDragging = false;
let startX = 0;
let currentX = 0;
const swipeCardEl = document.getElementById('swipeCard');

if (swipeCardEl) {
  function dragStart(e) {
    const curDeck = swipePlayer === 1 ? p1Deck : p2Deck;
    if (swipeIndex >= curDeck.length) return;
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    swipeCardEl.style.transition = 'none';

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
    if (!isDragging) return;
    currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - startX;
    swipeCardEl.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchmove', dragMove);
    window.removeEventListener('touchend', dragEnd);

    swipeCardEl.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
    
    if (currentX > 80) {
      triggerHaptic('light');
      swipeCardEl.style.transform = 'translateX(400px) rotate(30deg)';
      swipeCardEl.style.opacity = '0';
      setTimeout(() => {
        handleSwipe(true);
        resetCardStyle();
      }, 300);
    } else if (currentX < -80) {
      triggerHaptic('light');
      swipeCardEl.style.transform = 'translateX(-400px) rotate(-30deg)';
      swipeCardEl.style.opacity = '0';
      setTimeout(() => {
        handleSwipe(false);
        resetCardStyle();
      }, 300);
    } else {
      swipeCardEl.style.transform = 'translateX(0px) rotate(0deg)';
    }
    currentX = 0;
  }

  function resetCardStyle() {
    swipeCardEl.style.transform = 'translateX(0px) rotate(0deg)';
    swipeCardEl.style.opacity = '1';
  }

  swipeCardEl.addEventListener('mousedown', dragStart);
  swipeCardEl.addEventListener('touchstart', dragStart, { passive: true });
}

/* DRAFT */
let draftItems = [], draftTurn = 1;
function initDraft() {
  draftItems = shuffle([...activeDeck]).slice(0, Math.min(8, activeDeck.length)).map(x => ({ ...x, banned:false }));
  draftTurn = 1; renderDraftGrid();
}
function renderDraftGrid() {
  const headerEl = document.getElementById("draftTurnHeader");
  if (headerEl) headerEl.textContent = `Player ${draftTurn}'s Turn`;
  const grid = document.getElementById("draftGrid"); 
  if (!grid) return;
  grid.innerHTML = "";
  if (!draftItems.length) { grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">No ideas available. Add or restore ideas in your Library.</div>'; return; }
  draftItems.forEach((item, idx) => {
    const tile = document.createElement("button");
    tile.className = `draft-tile ${item.banned ? 'banned' : ''}`;
    const icon = document.createElement("span"); icon.className = "icon"; icon.textContent = item.icon;
    const title = document.createElement("span"); title.className = "title"; title.textContent = item.title;
    const cat = document.createElement("span"); cat.className = "cat"; cat.textContent = item.category;
    tile.append(icon, title, cat);
    tile.disabled = item.banned;
    if(!item.banned) tile.onclick = () => banItem(idx);
    grid.appendChild(tile);
  });
}
function banItem(idx) {
  if (!draftItems[idx] || draftItems[idx].banned) return;
  playSound('ban');
  triggerHaptic('heavy');
  draftItems[idx].banned = true;
  const remaining = draftItems.filter(i => !i.banned);
  if(remaining.length === 1) { 
    window.currentWinner=remaining[0]; 
    showModal("🏆", "Winner by Elimination!", remaining[0].title, remaining[0].detail, remaining[0].icon); 
    renderContextualInstallPrompt();
  }
  else { draftTurn = draftTurn === 1 ? 2 : 1; renderDraftGrid(); }
}

/* WHEEL */
let wheelAngle = 0, isSpinning = false, wheelPool = [];
function initWheel() { if (!isSpinning) wheelPool = shuffle([...activeDeck]).slice(0, 8); drawWheel(); }
function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const pool = wheelPool, num = pool.length;
  ctx.clearRect(0,0,300,300);
  if (!num) { ctx.fillStyle = "#fff5ea"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.fillText("No ideas available", 150, 150); return; }
  const slice = (2 * Math.PI) / num, colors = ["#ff4365","#ffc857","#48bb78","#9f7aea","#ed64a6","#3182ce","#d69e2e","#e53e3e"];
  ctx.save(); ctx.translate(150,150); ctx.rotate(wheelAngle);
  for(let i=0; i<num; i++) {
    ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,135,i*slice,(i+1)*slice);
    ctx.fillStyle = colors[i % colors.length]; ctx.fill(); ctx.stroke();
    ctx.save(); ctx.rotate(i*slice + slice/2); ctx.fillStyle="#ffffff"; 
    let label = pool[i].title; 
    let fontSize = num > 6 ? 9 : 10;
    if(label.length > 18) label = label.slice(0,17) + "…";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign="left";
    ctx.fillText(label, 40, 3); ctx.restore();
  }
  ctx.restore(); ctx.fillStyle="#ffc857"; ctx.beginPath(); ctx.moveTo(150,8); ctx.lineTo(140,26); ctx.lineTo(160,26); ctx.fill();
}
function spinWheel() {
  if(isSpinning) return;
  const pool = shuffle([...activeDeck]).slice(0,8);
  wheelPool = pool;
  if(!pool.length) { showModal("📚","Library is empty","Add or restore an idea","Add a custom idea below or restore a deleted built-in idea in the Library.","📚"); return; }
  isSpinning = true;
  let speed = Math.random()*.25+.35, friction=.985, lastTick=wheelAngle;
  function animate() {
    speed *= friction; wheelAngle += speed;
    if(Math.abs(wheelAngle-lastTick)>.35) { playSound('tick'); triggerHaptic('light'); lastTick=wheelAngle; }
    drawWheel();
    if(speed>.002) requestAnimationFrame(animate);
    else {
      isSpinning=false;
      const slice = 2*Math.PI/pool.length;
      let pointerAngle = ((Math.PI*1.5 - wheelAngle) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
      const selected = pool[Math.floor(pointerAngle/slice) % pool.length];
      window.currentWinner=selected;
      showModal("🎉","The Wheel Has Spoken!",selected.title,selected.detail,selected.icon);
      renderContextualInstallPrompt();
    }
  }
  animate();
}

/* LIBRARY & DECK CODES */
function exportDeckCode() {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(customDeck))));
  prompt("📋 Copy your custom deck sharing code below:", payload);
}
function importDeckCode() {
  const payload = prompt("📥 Paste your partner's custom deck code below:");
  if (!payload) return;
  try {
    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload.trim()))));
    if (!validateActivityArray(decoded)) throw new Error('Invalid deck');
    const existing = new Set(customDeck.map(x=>x.id));
    const incoming = decoded.map((x,i)=>({...x, id: existing.has(x.id) || masterDeck.some(b=>b.id===x.id) ? `custom-import-${Date.now()}-${i}` : x.id}));
    customDeck = [...customDeck, ...incoming];
    saveDecks(); refreshDecks(); initMatcher(); initDraft(); initWheel(); renderLibrary();
    alert(`✨ Imported ${incoming.length} ideas successfully!`);
  } catch(e) { alert("⚠️ That code could not be read or contains invalid activity data."); }
}

function renderLibrary() {
  const searchInput = document.getElementById("librarySearch");
  const categorySelect = document.getElementById("libraryCategory");
  const statusSelect = document.getElementById("libraryStatus");
  const summaryEl = document.getElementById("librarySummary");
  const listEl = document.getElementById("libraryList");
  if (!listEl) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const category = categorySelect ? categorySelect.value : "all";
  const status = statusSelect ? statusSelect.value : "active";

  let items = fullDeck.map(item => ({...item, deleted:false, builtin:masterDeck.some(b => b.id === item.id)}));
  
  items = items.filter(item => {
    const matchesCat = (category === "all" || item.category === category);
    const matchesQuery = (!query || `${item.title} ${item.detail} ${item.category}`.toLowerCase().includes(query));
    const matchesStatus = (status === "all" || (status === "active" && !deletedBuiltins.has(item.id)));
    return matchesCat && matchesQuery && matchesStatus;
  });

  if (summaryEl) {
    summaryEl.textContent = `${fullDeck.length} saved idea${fullDeck.length===1?"":"s"}${query ? ` · ${items.length} match${items.length===1?"":"es"}` : ""}`;
  }
  
  listEl.innerHTML = "";
  if (!items.length) { listEl.innerHTML = `<div class="empty-state">No ideas match your search. Try another search or add a new idea below.</div>`; return; }
  items.forEach(item => {
    const card = document.createElement("article"); card.className = "library-item";
    const icon = document.createElement("div"); icon.className = "library-icon"; icon.textContent = item.icon;
    const content = document.createElement("div");
    const title = document.createElement("div"); title.className = "library-title"; title.textContent = item.title;
    const cat = document.createElement("div"); cat.className = "library-category"; cat.textContent = `${item.category}${item.builtin ? " · Built-in" : " · Custom"}`;
    const detail = document.createElement("div"); detail.className = "library-detail"; detail.textContent = item.detail;
    const actions = document.createElement("div"); actions.className = "library-actions";
    const fav = document.createElement("button"); fav.className = "heart-btn"; fav.textContent = isFavorite(item.id) ? "❤️ Favorited" : "🤍 Favorite"; fav.onclick = () => toggleFavorite(item.id); actions.appendChild(fav);
    
    if (!item.builtin) {
      const edit = document.createElement("button"); edit.className = "restore-btn"; edit.textContent = "✏️ Edit";
      edit.onclick = () => editCustomIdea(item.id); actions.appendChild(edit);

      const del = document.createElement("button"); del.className = "delete-btn"; del.textContent = "🗑 Delete";
      del.onclick = () => deleteIdea(item.id, false); actions.appendChild(del);
    } else {
      const protectedNote = document.createElement("div");
      protectedNote.className = "library-detail";
      protectedNote.style.marginTop = "10px";
      protectedNote.textContent = "🔒 Built-in idea · protected from deletion";
      actions.appendChild(protectedNote);
    }
    content.append(title, cat, detail, actions); card.append(icon, content); listEl.appendChild(card);
  });
}

function editCustomIdea(id) {
  const item = customDeck.find(x => x.id === id);
  if (!item) return;
  const newTitle = prompt("Edit idea title:", item.title);
  if (newTitle === null) return;
  const newDetail = prompt("Edit exact instructions / details:", item.detail);
  if (newDetail === null) return;
  const newCat = prompt("Edit category (baking, game, movie, TV show):", item.category);
  if (newCat === null) return;
  
  const validCats = ["baking", "game", "movie", "TV show"];
  if (newTitle.trim()) item.title = newTitle.trim();
  if (newDetail.trim()) item.detail = newDetail.trim();
  if (validCats.includes(newCat.trim())) item.category = newCat.trim();
  
  saveDecks(); refreshDecks(); initMatcher(); initDraft(); initWheel(); renderLibrary();
}

function deleteIdea(id, builtin) {
  const item = fullDeck.find(x => x.id === id);
  if (!item) return;
  if (builtin || masterDeck.some(x => x.id === id)) {
    alert("Built-in ideas are protected and cannot be deleted.");
    return;
  }
  if (!confirm(`Delete custom idea "${item.title}" from your library?`)) return;
  customDeck = customDeck.filter(x => x.id !== id);
  saveDecks(); refreshDecks(); initMatcher(); initDraft(); initWheel(); renderLibrary();
}

/* CUSTOM WISHLIST FORM SUBMISSION */
const customFormEl = document.getElementById("customForm");
if (customFormEl) {
  customFormEl.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("customTitle").value.trim();
    const detail = document.getElementById("customDetail").value.trim();
    const category = document.getElementById("customCategory").value;
    if (!title || !detail) return;
    
    const newItem = { 
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, 
      icon: "⭐", 
      title: title, 
      detail: detail, 
      category: category 
    };
    
    customDeck.push(newItem); 
    saveDecks(); 
    refreshDecks();
    
    document.getElementById("customTitle").value = ""; 
    document.getElementById("customDetail").value = "";
    
    applyCategoryFilter();
    triggerHaptic('success');
    playSound('win');
    
    const libStatus = document.getElementById("libraryStatus");
    if (libStatus) libStatus.value = "active";
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.nav-tab[onclick*="library"]')?.classList.add('active');
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active-mode'));
    document.getElementById("card-library")?.classList.add('active-mode');
    
    renderLibrary();
    alert("⭐ Added to your shared date night wishlist!");
  });
}

/* PERSONAL FEATURES & ANALYTICS */
const PERSONAL = { favorites:"dateArcadeFavorites", history:"dateArcadeHistory", votes:"dateArcadeVotes" };
const EXTRA_STORAGE = { daily:"dateArcadeDailyDateV2", settings:"dateArcadeSettingsV2", compatibility:"dateArcadeCompatibilityV1" };
let appSettings = readStorage(EXTRA_STORAGE.settings, {theme:'dark', feedback:'both'});
function localDayKey(date = new Date()) { const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }
function getCompletedDayKeys() { return [...new Set(dateHistory.map(h => { const d=new Date(h.date); return Number.isNaN(d.getTime()) ? null : localDayKey(d); }).filter(Boolean))].sort(); }
function currentStreak() { const days=new Set(getCompletedDayKeys()); const today=new Date(); let cursor=new Date(today.getFullYear(),today.getMonth(),today.getDate()); if(!days.has(localDayKey(cursor))) cursor.setDate(cursor.getDate()-1); let count=0; while(days.has(localDayKey(cursor))){count++;cursor.setDate(cursor.getDate()-1);} return count; }
function achievementList() { const total=dateHistory.length, streak=currentStreak(), categories=new Set(dateHistory.map(x=>x.category)); const allCats=['baking','game','movie','TV show'].every(c=>categories.has(c)); const out=[]; if(total>=1)out.push('💖 First date logged'); if(total>=5)out.push('✨ 5 dates together'); if(total>=10)out.push('🏆 10-date milestone'); if(total>=25)out.push('💎 25-date legends'); if(streak>=3)out.push('🔥 3-day streak'); if(streak>=7)out.push('🌟 7-day streak'); if(allCats)out.push('🎭 Tried every category'); return out; }
function renderAchievementStrip() { const root=document.getElementById('achievementStrip'); if(!root)return; const badges=achievementList(); root.innerHTML=''; if(!badges.length){root.innerHTML='<span class="achievement-badge">🌱 Your first milestone is waiting</span>';return;} badges.forEach(label=>{const b=document.createElement('span');b.className='achievement-badge';b.textContent=label;root.appendChild(b);}); }
function applyTheme(theme) { const valid=['dark','light','ocean']; appSettings.theme=valid.includes(theme)?theme:'dark'; document.documentElement.dataset.theme=appSettings.theme==='dark'?'':appSettings.theme; safeSetItem(EXTRA_STORAGE.settings,JSON.stringify(appSettings)); const el=document.getElementById('themeSelect'); if(el)el.value=appSettings.theme; }
function saveFeedbackSettings(value) { appSettings.feedback=['both','sound','vibration','off'].includes(value)?value:'both'; safeSetItem(EXTRA_STORAGE.settings,JSON.stringify(appSettings)); }
function shareCurrentDate() { const item=window.currentWinner || getDailyActivity(); if(!item){alert('Choose an idea first.');return;} const text=`💞 Date Night Decider: ${item.title}\n${item.detail}`; if(navigator.share){navigator.share({title:item.title,text}).catch(()=>{});} else if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>alert('Date idea copied to clipboard!')).catch(()=>prompt('Copy your date idea:',text));} else {prompt('Copy your date idea:',text);} }
function getDailyActivity() { const saved=readStorage(EXTRA_STORAGE.daily,null); if(saved && saved.day===localDayKey() && saved.id){const found=fullDeck.find(x=>x.id===saved.id);if(found)return found;} const pool=activeDeck.length?activeDeck:fullDeck; if(!pool.length)return null; const chosen=shuffle([...pool])[0]; safeSetItem(EXTRA_STORAGE.daily,JSON.stringify({day:localDayKey(),id:chosen.id,completed:false})); return chosen; }
function renderDailyDate() { const root=document.getElementById('dailyDateContent'); if(!root)return; const saved=readStorage(EXTRA_STORAGE.daily,null); const item=getDailyActivity(); const labelEl = document.getElementById('dailyDateLabel'); if (labelEl) labelEl.textContent = new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}).toUpperCase(); root.innerHTML=''; if(!item){root.innerHTML='<p class="daily-detail">Add or restore ideas to get a daily pick.</p>';return;} const title=document.createElement('div');title.className='daily-title';title.textContent=`${item.icon||'💖'} ${item.title}`;const detail=document.createElement('p');detail.className='daily-detail';detail.textContent=item.detail;const meta=document.createElement('div');meta.className='daily-meta';const completed=saved&&saved.day===localDayKey()&&saved.completed;meta.textContent=`${item.category} · ${estimate(item).time==='long'?'3+ hours':estimate(item).time==='short'?'≤ 1 hour':'1–3 hours'} · ${completed?'✓ Completed today':'Your pick stays saved for today'}`;root.append(title,detail,meta);const doneBtn=document.querySelector('.daily-actions button');if(doneBtn){doneBtn.disabled=!!completed;doneBtn.textContent=completed?'🎉 Today completed':'✅ We did today’s date';} renderAchievementStrip(); }
function refreshDailyDate(force=false) { if(force){const pool=activeDeck.length?activeDeck:fullDeck;if(!pool.length){renderDailyDate();return;} const previous=readStorage(EXTRA_STORAGE.daily,null);let choices=pool.filter(x=>!previous||x.id!==previous.id);if(!choices.length)choices=pool;const chosen=shuffle([...choices])[0];safeSetItem(EXTRA_STORAGE.daily,JSON.stringify({day:localDayKey(),id:chosen.id,completed:false}));} renderDailyDate(); }
function completeDailyDate() { 
  const saved=readStorage(EXTRA_STORAGE.daily,null); 
  const item=getDailyActivity(); 
  if(!item || (saved&&saved.day===localDayKey()&&saved.completed))return; 
  const a=prompt('Player 1 rating (1–5):','5');if(a===null)return;
  const b=prompt('Player 2 rating (1–5):','5');if(b===null)return;
  const note=prompt('Add a memory (optional):','')||'';
  saveCompletedDate(item,a,b,note);
  safeSetItem(EXTRA_STORAGE.daily,JSON.stringify({day:localDayKey(),id:item.id,completed:true}));
  renderDailyDate(); 
  renderContextualInstallPrompt(); // Surface install prompt on milestone completion
}

/* COUPLE COMPATIBILITY MATCH GAME MODE ENGINE */
function findCompatibilityMatches() { 
  const prefs=[1,2].map(n=>({time:document.getElementById(`p${n}Time`).value,budget:document.getElementById(`p${n}Budget`).value})); 
  const root=document.getElementById('compatResults'); if(!root) return; root.innerHTML='';
  const pool=activeDeck.length?activeDeck:fullDeck;
  const ranked=pool.map(item=>{
    const est=estimate(item);
    let score=0;
    prefs.forEach(p=>{
      if(p.time==='any'||p.time===est.time)score+=2;
      if(p.budget==='any'||p.budget===est.budget)score+=2;
    });
    return {item,score};
  }).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title)).slice(0,5);

  if(!ranked.length){root.innerHTML='<div class="empty-state">No ideas available. Select categories or add ideas.</div>';return;}
  ranked.forEach(({item,score},i)=>{
    const row=document.createElement('div');row.className='compat-result';
    const title=document.createElement('strong');title.textContent=`${i+1}. ${item.icon||'💖'} ${item.title}`;
    const desc=document.createElement('small');desc.textContent=`${item.category} · ${score}/8 compatibility match`;
    const button=document.createElement('button');button.className='restore-btn';button.style.marginTop='8px';button.textContent='Choose this date';
    button.onclick=()=>{
      window.currentWinner=item;
      showModal('💞','Couple Match Winner',item.title,item.detail,item.icon);
    };
    row.append(title,desc,button);root.appendChild(row);
  }); 
}

function validActivity(item) { return !!item && typeof item==='object' && typeof item.id==='string' && item.id.length<=120 && typeof item.title==='string' && item.title.trim().length>0 && item.title.length<=100 && typeof item.detail==='string' && item.detail.trim().length>0 && item.detail.length<=500 && ['baking','game','movie','TV show'].includes(item.category) && (item.icon===undefined || (typeof item.icon==='string' && item.icon.length<=12)); }
function validateActivityArray(value) { return Array.isArray(value) && value.length<=1000 && value.every(validActivity); }

const savedFavorites = readStorage(PERSONAL.favorites, []);
let favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(id => typeof id === "string") : []);
let dateHistory = readStorage(PERSONAL.history, []);
if (!Array.isArray(dateHistory)) dateHistory = [];
dateHistory = dateHistory.filter(h => h && typeof h === "object" && typeof h.title === "string" && typeof h.date === "string");
let voteState = readStorage(PERSONAL.votes, { index:0, player:1, ratings:{}, phase:'main', candidates:[], batch:[] });
function isFavorite(id) { return favorites.has(id); }
function toggleFavorite(id) { favorites.has(id) ? favorites.delete(id) : favorites.add(id); safeSetItem(PERSONAL.favorites, JSON.stringify([...favorites])); renderLibrary(); if(document.getElementById('card-vote')?.classList.contains('active-mode')) renderVoting(); }
function estimate(item) {
  const c=item.category, title=(item.title+' '+item.detail).toLowerCase();
  let time=c==='baking'?'long':c==='game'?'medium':'medium';
  if(/danish|laminated|layered|lattice|bread pudding|triple-feature|back-to-back|two episodes|first two episodes/.test(title)) time='long';
  let budget=c==='game'?'free':c==='movie'||c==='TV show'?'low':'low';
  if(/peach|blackberry|raspberry|cream cheese|chocolate|pumpkin/.test(title)) budget='medium';
  let energy=c==='game'?'medium':c==='baking'?'medium':'low';
  if(/expedition|travel|mountain|ocean|fortress|redstone/.test(title)) energy='high';
  return {time,budget,energy};
}
function matchesFilters(item) {
  const est=estimate(item);
  const timeFilterEl = document.getElementById('timeFilter');
  const budgetFilterEl = document.getElementById('budgetFilter');
  const energyFilterEl = document.getElementById('energyFilter');
  const t = timeFilterEl ? timeFilterEl.value : 'any';
  const b = budgetFilterEl ? budgetFilterEl.value : 'any';
  const e = energyFilterEl ? energyFilterEl.value : 'any';

  const timeOK=t==='any'||est.time===t||(t==='medium'&&est.time==='short');
  const budgetOK=b==='any'||est.budget===b||(b==='medium'&&est.budget==='high');
  return timeOK&&budgetOK&&(e==='any'||est.energy===e);
}
function surpriseMe() {
  let pool=activeDeck.filter(matchesFilters); 
  const modeEl = document.getElementById('surpriseMode');
  const mode = modeEl ? modeEl.value : 'all';
  if(mode==='favorites') pool=pool.filter(x=>isFavorite(x.id));
  if(mode==='new') pool=pool.filter(x=>!dateHistory.some(h=>h.id===x.id));
  if(!pool.length) { showModal('🤔','No matching dates','Try changing your filters','There are no ideas matching those settings. Select more categories or loosen a filter.','🔎'); return; }
  const chosen=pool[Math.floor(Math.random()*pool.length)]; showModal('🎉','Your Surprise Date!',chosen.title,chosen.detail,chosen.icon); window.currentWinner=chosen;
}
function renderVoting() {
  const root=document.getElementById('voteContent'); if(!root) return;
  const allIdeas=activeDeck.filter(matchesFilters);
  if(!allIdeas.length) { root.innerHTML='<div class="empty-state">No eligible ideas. Adjust categories or filters.</div>'; return; }
  if(!voteState || typeof voteState!=='object') voteState={index:0,player:1,ratings:{},phase:'main',candidates:[],batch:[]};
  if(!voteState.phase) voteState.phase='main';
  if(!voteState.ratings) voteState.ratings={};
  if(!Array.isArray(voteState.candidates)) voteState.candidates=[];
  if(!Array.isArray(voteState.batch)) voteState.batch=[];
  if(voteState.phase==='main' && (!voteState.batch.length || !voteState.batch.some(id=>allIdeas.some(x=>x.id===id)))) {
    voteState.batch=shuffle([...allIdeas]).slice(0,5).map(x=>x.id);
    voteState.index=0; voteState.player=1; voteState.ratings={};
    safeSetItem(PERSONAL.votes,JSON.stringify(voteState));
  }
  const pool=voteState.phase==='runoff'
    ? voteState.candidates.map(id=>allIdeas.find(x=>x.id===id)).filter(Boolean)
    : voteState.batch.map(id=>allIdeas.find(x=>x.id===id)).filter(Boolean);
  if(!pool.length) { voteState={index:0,player:1,ratings:{},phase:'main',candidates:[],batch:[]}; safeSetItem(PERSONAL.votes,JSON.stringify(voteState)); root.innerHTML='<div class="empty-state">No eligible ideas. Adjust categories or filters.</div>'; return; }
  if(voteState.index>=pool.length) { voteState.index=0; voteState.player=1; voteState.ratings={}; }
  const item=pool[voteState.index]; const ratings=voteState.ratings[item.id]||{};
  root.innerHTML='';
  const phaseNote=document.createElement('p'); phaseNote.style.cssText='color:var(--muted);font-size:.8rem;margin:0 0 8px';
  phaseNote.textContent=voteState.phase==='runoff' ? `⚖️ Final revote · Idea ${voteState.index+1} of ${pool.length}` : `Round 1 · Voting on ${pool.length} ideas (up to 5) · Idea ${voteState.index+1} of ${pool.length}`; root.appendChild(phaseNote);
  const card=document.createElement('div'); card.className='swipe-card'; card.style.cursor='default'; card.innerHTML=`<div class="icon">${item.icon}</div><div class="cat-badge">${item.category}</div><div class="title"></div><div class="detail"></div>`; card.querySelector('.title').textContent=item.title; card.querySelector('.detail').textContent=item.detail; root.appendChild(card);
  const prompt=document.createElement('p'); prompt.style.cssText='color:var(--gold);font-weight:800;margin:8px 0'; prompt.textContent=`Player ${voteState.player}: rate this date`; root.appendChild(prompt);
  const select=document.createElement('select'); select.className='vote-select'; select.innerHTML='<option value="">Choose your vote…</option><option value="yes">❤️ Yes, let’s do it</option><option value="maybe">👍 Maybe / willing</option><option value="no">❌ No thanks (veto)</option>'; select.value=ratings['p'+voteState.player]||''; root.appendChild(select);
  const btn=document.createElement('button'); btn.className='primary-btn'; btn.style.marginTop='10px'; btn.textContent=voteState.player===1?'Save vote & pass phone':'Save both votes'; btn.onclick=()=>{
    if(!select.value) { alert('Choose a vote first.'); return; }
    voteState.ratings[item.id]=voteState.ratings[item.id]||{};
    voteState.ratings[item.id]['p'+voteState.player]=select.value;
    if(voteState.player===1) { voteState.player=2; safeSetItem(PERSONAL.votes,JSON.stringify(voteState)); renderVoting(); return; }
    const r=voteState.ratings[item.id]||{};
    safeSetItem(PERSONAL.votes,JSON.stringify(voteState));
    if(r.p1==='yes'&&r.p2==='yes') {
      window.currentWinner=item;
      voteState={index:0,player:1,ratings:{},phase:'main',candidates:[],batch:[]};
      safeSetItem(PERSONAL.votes,JSON.stringify(voteState));
      showModal('💚','Perfect Match!',item.title,item.detail,item.icon);
      return;
    }
    voteState.index++; voteState.player=1;
    if(voteState.index < pool.length) {
      safeSetItem(PERSONAL.votes,JSON.stringify(voteState)); renderVoting(); return;
    }
    if(voteState.phase==='main') {
      const ranked=pool.map((idea,order)=>{
        const votes=voteState.ratings[idea.id]||{};
        const vetoed=votes.p1==='no'||votes.p2==='no';
        const score=(votes.p1==='yes'?2:votes.p1==='maybe'?1:0)+(votes.p2==='yes'?2:votes.p2==='maybe'?1:0);
        return {idea,order,vetoed,score};
      });
      let finalists=ranked.filter(x=>!x.vetoed).sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,3);
      if(!finalists.length) finalists=ranked.sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,3);
      voteState={index:0,player:1,ratings:{},phase:'runoff',candidates:finalists.map(x=>x.idea.id),batch:voteState.batch};
      safeSetItem(PERSONAL.votes,JSON.stringify(voteState));
      alert(`No unanimous yes yet. The top ${finalists.length} ideas are ready for a fresh revote!`);
      renderVoting(); return;
    }
    const finalistNames=pool.map(x=>x.title).join(' • ');
    voteState={index:0,player:1,ratings:{},phase:'main',candidates:[],batch:[]};
    safeSetItem(PERSONAL.votes,JSON.stringify(voteState));
    showModal('🤝','No Unanimous Winner','Neither of you gave the same idea a definite yes.',`Your finalists were: ${finalistNames}. Restart voting to try again.`, '💬');
  }; root.appendChild(btn);
  const reset=document.createElement('button'); reset.className='primary-btn'; reset.style.cssText='margin-top:8px;background:#3b234a;color:white'; reset.textContent='🔄 Restart voting'; reset.onclick=()=>{voteState={index:0,player:1,ratings:{},phase:'main',candidates:[],batch:[]};safeSetItem(PERSONAL.votes,JSON.stringify(voteState));renderVoting();}; root.appendChild(reset);
}
function saveCompletedDate(item, rating1, rating2, note) {
  if(!item) return;
  dateHistory.unshift({id:item.id,title:item.title,icon:item.icon,category:item.category,detail:item.detail,date:new Date().toISOString(),rating1:Number(rating1)||0,rating2:Number(rating2)||0,note:note||''});
  safeSetItem(PERSONAL.history,JSON.stringify(dateHistory)); renderHistory(); renderDailyDate();
}

function renderAnalyticsDashboard() {
  const dash = document.getElementById('analyticsDashboard');
  if (!dash) return;
  if (!dateHistory.length) {
    dash.innerHTML = '';
    return;
  }
  
  const totalDates = dateHistory.length;
  let totalRatingSum = 0;
  let ratingCount = 0;
  const catCounts = { baking: 0, game: 0, movie: 0, "TV show": 0 };

  dateHistory.forEach(h => {
    if (catCounts[h.category] !== undefined) catCounts[h.category]++;
    const r1 = Number(h.rating1) || 0;
    const r2 = Number(h.rating2) || 0;
    if (r1 > 0) { totalRatingSum += r1; ratingCount++; }
    if (r2 > 0) { totalRatingSum += r2; ratingCount++; }
  });

  const avgRating = ratingCount > 0 ? (totalRatingSum / ratingCount).toFixed(1) : '5.0';

  dash.innerHTML = `
    <div class="stats-card">
      <div class="eyebrow" style="margin-bottom:8px">📊 Couple's Analytics</div>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="val">${totalDates}</div>
          <div class="lbl">Dates Completed</div>
        </div>
        <div class="stat-box">
          <div class="val">⭐ ${avgRating}</div>
          <div class="lbl">Avg Couple Rating</div>
        </div>
      </div>
      <div style="font-size:.78rem; color:var(--gold); font-weight:800; margin-bottom:6px;">Category Breakdown</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-label"><span>🥧 Baking</span><span>${catCounts.baking}</span></div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${(catCounts.baking / totalDates) * 100}%"></div></div>
      </div>
      <div class="stat-bar-wrap" style="margin-top:6px;">
        <div class="stat-bar-label"><span>🧱 Games</span><span>${catCounts.game}</span></div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${(catCounts.game / totalDates) * 100}%"></div></div>
      </div>
      <div class="stat-bar-wrap" style="margin-top:6px;">
        <div class="stat-bar-label"><span>🎬 Movies</span><span>${catCounts.movie}</span></div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${(catCounts.movie / totalDates) * 100}%"></div></div>
      </div>
      <div class="stat-bar-wrap" style="margin-top:6px;">
        <div class="stat-bar-label"><span>📺 TV Shows</span><span>${catCounts["TV show"]}</span></div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${(catCounts["TV show"] / totalDates) * 100}%"></div></div>
      </div>
    </div>
  `;
}

/* DATE GOAL & MILESTONE TRACKER */
function renderGoalAndMilestoneTracker() {
  const goalLabel = document.getElementById('dateGoalStatus');
  const goalBar = document.getElementById('dateGoalBar');
  const milestoneEl = document.getElementById('milestoneCountdown');
  if (!goalBar || !goalLabel) return;

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const datesThisWeek = dateHistory.filter(h => {
    const d = new Date(h.date);
    return d >= startOfWeek;
  }).length;

  const weeklyGoal = 1;
  const progressPercent = Math.min(100, Math.round((datesThisWeek / weeklyGoal) * 100));

  goalLabel.textContent = `${datesThisWeek} / ${weeklyGoal} Completed`;
  goalBar.style.width = `${progressPercent}%`;

  if (appSettings.anniversaryDate) {
    const anniv = new Date(appSettings.anniversaryDate);
    const today = new Date();
    anniv.setFullYear(today.getFullYear());
    if (anniv < today) anniv.setFullYear(today.getFullYear() + 1);

    const diffDays = Math.ceil((anniv - today) / (1000 * 60 * 60 * 24));
    if (milestoneEl) milestoneEl.textContent = `🎉 ${diffDays} day${diffDays === 1 ? '' : 's'} until your Anniversary!`;
  }
}

function renderHistory() {
  renderAnalyticsDashboard();
  renderGoalAndMilestoneTracker();
  const list=document.getElementById('historyList'); if(!list) return; list.innerHTML='';
  const stats=document.getElementById('historyStats'); 
  if (stats) stats.textContent=`${dateHistory.length} completed date${dateHistory.length===1?'':'s'} logged in scrapbook`;
  if(!dateHistory.length) { list.innerHTML='<div class="empty-state">No dates logged yet. Complete a game and save your winner to build your scrapbook!</div>'; return; }
  dateHistory.forEach((h,i)=>{
    const row=document.createElement('article'); row.className='library-item';
    const icon=document.createElement('div'); icon.className='library-icon'; icon.textContent=h.icon||'💖';
    const content=document.createElement('div'); const title=document.createElement('div'); title.className='library-title'; title.textContent=h.title;
    const meta=document.createElement('div'); meta.className='library-category'; meta.textContent=`${h.category} · ${new Date(h.date).toLocaleDateString()} · ⭐ P1: ${h.rating1||'-'} | P2: ${h.rating2||'-'}`;
    const detail=document.createElement('div'); detail.className='library-detail'; detail.textContent=h.note||h.detail;
    const rate=document.createElement('div'); rate.className='library-actions'; const edit=document.createElement('button'); edit.className='restore-btn'; edit.textContent='⭐ Rate / memory'; edit.onclick=()=>{const a=prompt('Player 1 rating (1–5):',h.rating1||'');if(a===null)return;const b=prompt('Player 2 rating (1–5):',h.rating2||'');if(b===null)return;const n=prompt('Memory or note:',h.note||'')||'';dateHistory[i].rating1=a;dateHistory[i].rating2=b;dateHistory[i].note=n;safeSetItem(PERSONAL.history,JSON.stringify(dateHistory));renderHistory();};
    const del=document.createElement('button'); del.className='delete-btn'; del.textContent='Remove'; del.onclick=()=>{if(confirm('Remove this history entry?')){dateHistory.splice(i,1);safeSetItem(PERSONAL.history,JSON.stringify(dateHistory));renderHistory();}}; rate.append(edit,del); content.append(title,meta,detail,rate); row.append(icon,content); list.appendChild(row);
  });
}
function exportBackup() {
  const timeFilterEl = document.getElementById('timeFilter');
  const budgetFilterEl = document.getElementById('budgetFilter');
  const energyFilterEl = document.getElementById('energyFilter');
  const data={
    version:2,
    customDeck,
    deletedBuiltins:[...deletedBuiltins],
    favorites:[...favorites],
    dateHistory,
    settings:appSettings,
    dailyDate:readStorage(EXTRA_STORAGE.daily,null),
    selectedCategories:[...document.querySelectorAll('.category-choice:checked')].map(x=>x.value),
    filters:{
      time: timeFilterEl ? timeFilterEl.value : 'any',
      budget: budgetFilterEl ? budgetFilterEl.value : 'any',
      energy: energyFilterEl ? energyFilterEl.value : 'any'
    }
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='date-night-decider-backup.json'; a.click(); URL.revokeObjectURL(url);
}
function importBackupFile(event) {
  const file=event.target.files&&event.target.files[0]; if(!file)return;
  if(file.size>5*1024*1024){alert('Backup is too large (maximum 5 MB).');event.target.value='';return;}
  const reader=new FileReader();
  reader.onload=()=>{try{
    const d=JSON.parse(reader.result);
    if(!d || typeof d!=='object' || !validateActivityArray(d.customDeck||[])) throw new Error('Invalid custom deck');
    if(d.favorites!==undefined && (!Array.isArray(d.favorites)||d.favorites.some(x=>typeof x!=='string'))) throw new Error('Invalid favorites');
    if(d.dateHistory!==undefined && (!Array.isArray(d.dateHistory)||d.dateHistory.length>10000||d.dateHistory.some(h=>!h||typeof h.title!=='string'||typeof h.date!=='string'))) throw new Error('Invalid history');
    if(d.selectedCategories!==undefined && (!Array.isArray(d.selectedCategories)||d.selectedCategories.some(x=>!['baking','game','movie','TV show'].includes(x)))) throw new Error('Invalid categories');
    if(d.customDeck)customDeck=d.customDeck;
    if(Array.isArray(d.deletedBuiltins))deletedBuiltins=new Set(d.deletedBuiltins.filter(x=>typeof x==='string'&&masterDeck.some(b=>b.id===x)));
    if(d.dailyDate && typeof d.dailyDate.id==='string')safeSetItem(EXTRA_STORAGE.daily,JSON.stringify(d.dailyDate));
    if(d.favorites)favorites=new Set(d.favorites);
    if(d.dateHistory)dateHistory=d.dateHistory;
    saveDecks();safeSetItem(PERSONAL.favorites,JSON.stringify([...favorites]));safeSetItem(PERSONAL.history,JSON.stringify(dateHistory));
    if(d.selectedCategories){document.querySelectorAll('.category-choice').forEach(x=>x.checked=d.selectedCategories.includes(x.value));safeSetItem(STORAGE.categories,JSON.stringify(d.selectedCategories));}
    if(d.filters){
      const tEl = document.getElementById('timeFilter');
      const bEl = document.getElementById('budgetFilter');
      const eEl = document.getElementById('energyFilter');
      if (tEl) tEl.value=['any','short','medium','long'].includes(d.filters.time)?d.filters.time:'any';
      if (bEl) bEl.value=['any','free','low','medium'].includes(d.filters.budget)?d.filters.budget:'any';
      if (eEl) eEl.value=['any','low','medium','high'].includes(d.filters.energy)?d.filters.energy:'any';
      saveFilters();
    }
    if(d.settings && typeof d.settings==='object'){appSettings={...appSettings,...d.settings};applyTheme(appSettings.theme);saveFeedbackSettings(appSettings.feedback);}
    refreshDecks();initMatcher();initDraft();initWheel();renderLibrary();renderHistory();renderDailyDate();alert('Backup restored!');
  }catch(e){alert('That backup file is invalid or incomplete. Your existing data was not intentionally cleared.');}}
  reader.readAsText(file);event.target.value='';
}

function showCompletionPrompt(item) {
  if(!item)return; const completed=confirm(`Did you complete this date?\n\n${item.title}\n\nPress OK to save it to Date Night History.`); if(!completed)return;
  const a=prompt('Player 1 rating (1–5):','5'); if(a===null)return; const b=prompt('Player 2 rating (1–5):','5'); if(b===null)return; const note=prompt('Add a memory (optional):','')||''; saveCompletedDate(item,a,b,note);
}

/* CONFETTI */
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const particles = Array.from({length:60}, () => ({x:canvas.width/2,y:canvas.height/2,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12-2,color:["#ff4365","#ffc857","#48bb78","#ffffff"][Math.floor(Math.random()*4)],size:Math.random()*6+4,life:90}));
  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height); let alive=false;
    particles.forEach(p => { if(p.life>0) { p.x+=p.vx; p.y+=p.vy; p.vy+=.2; p.life--; alive=true; ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.size,p.size); } });
    if(alive) requestAnimationFrame(render);
  }
  render();
}
function completeCurrentDate() { 
  if(window.currentWinner) showCompletionPrompt(window.currentWinner); 
  closeModal(); 
  renderContextualInstallPrompt();
}
function showModal(icon, eyebrow, name, detail, customIcon) {
  playSound('win');
  triggerHaptic('success');
  triggerConfetti();
  const iconEl = document.getElementById("modalIcon");
  const eyebrowEl = document.getElementById("modalEyebrow");
  const nameEl = document.getElementById("modalIdeaName");
  const detailEl = document.getElementById("modalIdeaDetail");
  const modalEl = document.getElementById("decisionModal");
  if (iconEl) iconEl.textContent=customIcon||icon;
  if (eyebrowEl) eyebrowEl.textContent=eyebrow;
  if (nameEl) nameEl.textContent=name;
  if (detailEl) detailEl.textContent=detail;
  if (modalEl) modalEl.classList.add("show");
}
function closeModal() { 
  const modalEl = document.getElementById("decisionModal");
  if (modalEl) modalEl.classList.remove("show"); 
  initMatcher(); initDraft(); initWheel(); 
}

/* INIT */
const savedCategoriesRaw = readStorage(STORAGE.categories, ["baking", "game", "movie", "TV show"]);
const savedCategories = (Array.isArray(savedCategoriesRaw) ? savedCategoriesRaw : ["baking", "game", "movie", "TV show"]).map(category => legacyCategoryMap[category] || category).filter(category => ["baking", "game", "movie", "TV show"].includes(category));
document.querySelectorAll(".category-choice").forEach(input => input.checked = savedCategories.includes(input.value));
safeSetItem(STORAGE.categories, JSON.stringify(savedCategories));

const savedFilters = readStorage(STORAGE.filters, { time: "any", budget: "any", energy: "any" });
const timeFilterEl = document.getElementById("timeFilter");
const budgetFilterEl = document.getElementById("budgetFilter");
const energyFilterEl = document.getElementById("energyFilter");
if (timeFilterEl) timeFilterEl.value = ["any","short","medium","long"].includes(savedFilters.time) ? savedFilters.time : "any";
if (budgetFilterEl) budgetFilterEl.value = ["any","free","low","medium"].includes(savedFilters.budget) ? savedFilters.budget : "any";
if (energyFilterEl) energyFilterEl.value = ["any","low","medium","high"].includes(savedFilters.energy) ? savedFilters.energy : "any";

safeSetItem(STORAGE.custom, JSON.stringify(customDeck));
refreshDecks();
initMatcher(); initDraft(); initWheel(); renderLibrary(); renderHistory(); renderVoting();
applyTheme(appSettings.theme || 'dark');
const feedbackEl=document.getElementById('feedbackSelect'); if(feedbackEl)feedbackEl.value=appSettings.feedback||'both';
renderDailyDate();
renderGoalAndMilestoneTracker();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(err => console.info('Offline install support unavailable in this context.', err)));
}
