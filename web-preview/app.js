/**
 * राष्ट्रनीति (RashtraNiti) Game Engine
 * “एक आम आदमी से प्रधानमंत्री तक”
 */

// Sound synthesis for interactive feedback
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playClick() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  },
  playVictory() {
    try {
      this.init();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.12));
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + (i * 0.12));
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i * 0.12) + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + (i * 0.12));
        osc.stop(this.ctx.currentTime + (i * 0.12) + 0.35);
      });
    } catch(e) {}
  },
  playAlert() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.setValueAtTime(220, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch(e) {}
  }
};

// Central Game State
const GameState = {
  isHindi: true,
  currentLevel: 1, // 1 to 12
  gameDay: 1,
  electionCountdownDays: 30,

  player: {
    name: "अर्जुन शर्मा",
    age: 32,
    gender: "पुरुष",
    state: "उत्तर प्रदेश",
    district: "वाराणसी",
    constituency: "वाराणसी उत्तर",
    education: "स्नातकोत्तर (Master's)",
    occupation: "सामाजिक कार्यकर्ता",
    stats: {
      leadership: 45,
      communication: 50,
      politicalKnowledge: 40,
      publicTrust: 55,
      strategy: 45,
      administration: 40,
      finance: 45,
      crisisManagement: 40
    },
    personalMoney: 150000,
    energy: 100,
    reputation: 50
  },

  party: {
    name: "जन उत्थान पार्टी",
    shortName: "JUP",
    symbol: "दीपक (Lamp)",
    flagColorHex: "#FF671F",
    slogan: "जन सेवा ही राष्ट्र सेवा",
    priorities: ["शिक्षा", "रोजगार", "स्वास्थ्य"],
    funds: 500000,
    membersCount: 2500,
    volunteersCount: 450,
    mediaAttention: 30,
    overallPopularity: 42,
    electionReadiness: 35,
    wonSeatsNational: 0,
    demographics: {
      youth: 52,
      rural: 48,
      urban: 45,
      farmers: 54,
      workers: 50
    }
  },

  constituencies: [
    { id: "c1", name: "वाराणसी उत्तर", district: "वाराणसी", state: "उत्तर प्रदेश", voters: 340000, playerSupport: 46.2, oppSupport: 39.8, isHome: true, topIssue: "शहरी विकास व रोजगार", isUnlocked: true },
    { id: "c2", name: "गोरखपुर ग्रामीण", district: "गोरखपुर", state: "उत्तर प्रदेश", voters: 310000, playerSupport: 34.0, oppSupport: 48.5, isHome: false, topIssue: "सिंचाई व MSP", isUnlocked: true },
    { id: "c3", name: "पटना साहिब", district: "पटना", state: "बिहार", voters: 390000, playerSupport: 28.5, oppSupport: 44.0, isHome: false, topIssue: "उच्च शिक्षा व IT पार्क", isUnlocked: false },
    { id: "c4", name: "इंदौर मध्य", district: "इंदौर", state: "मध्य प्रदेश", voters: 280000, playerSupport: 32.0, oppSupport: 46.0, isHome: false, topIssue: "स्वच्छता व औद्योगिक गलियारा", isUnlocked: false },
    { id: "c5", name: "जयपुर ग्रामीण", district: "जयपुर", state: "राजस्थान", voters: 320000, playerSupport: 25.0, oppSupport: 42.0, isHome: false, topIssue: "पेयजल आपूर्ति व पर्यटन", isUnlocked: false }
  ],

  campaignActions: [
    { id: "door_to_door", title: "घर-घर संपर्क (Door-to-Door)", cost: 15000, energy: 20, days: 2, trust: 4, pop: 2, ready: 3, icon: "🚶", desc: "नागरिकों से सीधा संवाद और उनकी स्थानीय समस्याओं का समाधान।" },
    { id: "public_meeting", title: "जनसभा (Public Meeting)", cost: 35000, energy: 25, days: 2, trust: 2, pop: 4, ready: 4, icon: "👥", desc: "नुक्कड़ सभा व कार्यकर्ताओं के साथ संवाद।" },
    { id: "rally", title: "विशाल जन रैली (Public Rally)", cost: 120000, energy: 35, days: 3, trust: 2, pop: 6, ready: 5, icon: "📢", desc: "बड़ा मंच, हजारों कार्यकर्ताओं की उपस्थिति और शक्ति प्रदर्शन।" },
    { id: "town_hall", title: "टाउन हॉल बैठक (Town Hall)", cost: 50000, energy: 25, days: 2, trust: 3, pop: 4, ready: 4, icon: "🎙️", desc: "छात्रों व व्यापारियों के तीखे सवालों के सीधे जवाब।" },
    { id: "debate", title: "सार्वजनिक बहस (Public Debate)", cost: 20000, energy: 30, days: 1, trust: 3, pop: 5, ready: 4, icon: "⚖️", desc: "विपक्षी प्रत्याशियों के साथ नीतिगत खुली बहस।" },
    { id: "manifesto", title: "घोषणापत्र प्रस्तुति (Manifesto)", cost: 40000, energy: 20, days: 2, trust: 3, pop: 3, ready: 6, icon: "📖", desc: "दृष्टिपत्र और 5 वर्षों की विकास योजना की घोषणा।" },
    { id: "digital", title: "डिजिटल अभियान (Digital Campaign)", cost: 60000, energy: 10, days: 1, trust: 1, pop: 5, ready: 4, icon: "📱", desc: "सोशल मीडिया विज्ञापन और युवा मतदाताओं तक सीधी पहुंच।" },
    { id: "media_ad", title: "मीडिया विज्ञापन (Media Campaign)", cost: 150000, energy: 15, days: 2, trust: 2, pop: 7, ready: 5, icon: "📺", desc: "स्थानीय अखबारों और टीवी चैनलों पर अभियान।" },
    { id: "volunteers", title: "कार्यकर्ता महाभियान (Volunteer Drive)", cost: 30000, energy: 20, days: 3, trust: 2, pop: 2, ready: 9, icon: "🤝", desc: "बूथ स्तर पर 200 नए कार्यकर्ताओं का प्रशिक्षण व तैनाती।" },
    { id: "community", title: "सामुदायिक संवाद (Community Outreach)", cost: 25000, energy: 15, days: 2, trust: 4, pop: 3, ready: 4, icon: "🌾", desc: "किसान संगठनों व नागरिक समाज के साथ विचार-विमर्श।" }
  ],

  nationalBudget: {
    revenue: 3200000, // In Crores
    allocations: {
      "शिक्षा (Education)": 135000,
      "स्वास्थ्य (Healthcare)": 95000,
      "बुनियादी ढांचा (Infra)": 1100000,
      "कृषि कल्याण (Agri)": 140000,
      "रक्षा (Defence)": 625000,
      "तकनीक व विज्ञान (Tech)": 85000,
      "परिवहन (Transport)": 280000,
      "सामाजिक कल्याण (Welfare)": 220000
    }
  },

  parliamentBills: [
    {
      id: "bill_1",
      title: "राष्ट्रीय शिक्षा आधुनिकीकरण एवं AI शोध विधेयक 2026",
      desc: "प्रत्येक जिले में डिजिटल उत्कृष्ट विद्यालय और विश्वविद्यालयों में AI शोध प्रयोगशालाओं के गठन का प्रावधान।",
      status: "प्रस्तावित (Pending)",
      requiredVotes: 272,
      govtVotes: 0,
      oppVotes: 0
    },
    {
      id: "bill_2",
      title: "भारत गति-शक्ति राष्ट्रीय एक्सप्रेसवे विस्तार विधेयक",
      desc: "ग्रामीण क्षेत्रों को सीधे राष्ट्रीय एक्सप्रेसवे से जोड़ने और रसद लागत 8% तक घटाने का लक्ष्य।",
      status: "प्रस्तावित (Pending)",
      requiredVotes: 272,
      govtVotes: 0,
      oppVotes: 0
    }
  ],

  ministers: [
    { name: "राजेश मल्होत्रा", portfolio: "गृह मंत्रालय (Home Affairs)", comp: 82 },
    { name: "श्रीमती सुनंदा राव", portfolio: "वित्त मंत्रालय (Finance)", comp: 88 },
    { name: "डॉ. विक्रम साराभाई (काल्पनिक)", portfolio: "विज्ञान व तकनीक (Technology)", comp: 95 },
    { name: "बलबीर सिंह चीमा", portfolio: "कृषि मंत्रालय (Agriculture)", comp: 78 },
    { name: "अमित देसाई", portfolio: "सड़क व बुनियादी ढांचा (Infrastructure)", comp: 84 },
    { name: "डॉ. वीना नायर", portfolio: "स्वास्थ्य व परिवार कल्याण (Healthcare)", comp: 90 },
    { name: "प्रो. आनंद कुमार", portfolio: "शिक्षा मंत्रालय (Education)", comp: 86 },
    { name: "कर्नल राघवेंद्र राठौड़", portfolio: "रक्षा मंत्रालय (Defence)", comp: 91 }
  ],

  quiz: {
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    submitted: false,
    questions: [
      {
        cat: "भारतीय संविधान",
        q: "भारत का संविधान किस तिथि को पूर्ण रूप से लागू हुआ था?",
        options: ["15 अगस्त 1947", "26 नवम्बर 1949", "26 जनवरी 1950", "2 अक्टूबर 1950"],
        correct: 2,
        exp: "26 जनवरी 1950 को भारतीय संविधान पूर्ण रूप से लागू हुआ और भारत एक संप्रभु लोकतांत्रिक गणराज्य बना।"
      },
      {
        cat: "संसद व लोकतंत्र",
        q: "लोकसभा में साधारण बहुमत सिद्ध करने के लिए न्यूनतम कितनी सीटों की आवश्यकता होती है?",
        options: ["250 सीटें", "272 सीटें", "300 सीटें", "543 सीटें"],
        correct: 1,
        exp: "कुल 543 निर्वाचित लोकसभा सीटों में से 272 सीटें साधारण बहुमत (50% + 1) का आंकड़ा होती हैं।"
      },
      {
        cat: "अर्थव्यवस्था व बजट",
        q: "वार्षिक वित्तीय विवरण (बजट) संसद में संविधान के किस अनुच्छेद के तहत प्रस्तुत किया जाता है?",
        options: ["अनुच्छेद 110", "अनुच्छेद 112", "अनुच्छेद 123", "अनुच्छेद 360"],
        correct: 1,
        exp: "संविधान के अनुच्छेद 112 के अनुसार राष्ट्रपति प्रत्येक वित्तीय वर्ष के लिए वार्षिक वित्तीय विवरण संसद के दोनों सदनों के समक्ष रखवाते हैं।"
      },
      {
        cat: "चुनाव आयोग",
        q: "भारत निर्वाचन आयोग का प्रावधान संविधान के किस भाग व अनुच्छेद में है?",
        options: ["भाग 15, अनुच्छेद 324", "भाग 18, अनुच्छेद 352", "भाग 3, अनुच्छेद 19", "भाग 4, अनुच्छेद 40"],
        correct: 0,
        exp: "अनुच्छेद 324 में स्वतंत्र एवं निष्पक्ष चुनावों के संचालन हेतु निर्वाचन आयोग का प्रावधान है।"
      },
      {
        cat: "प्रशासन",
        q: "अविश्वास प्रस्ताव केवल किस सदन में प्रस्तुत किया जा सकता है?",
        options: ["केवल राज्यसभा में", "केवल लोकसभा में", "दोनों में से किसी भी सदन में", "संयुक्त अधिवेशन में"],
        correct: 1,
        exp: "मंत्रिपरिषद सामूहिक रूप से लोकसभा के प्रति उत्तरदायी होती है (अनुच्छेद 75(3)), इसलिए अविश्वास प्रस्ताव केवल लोकसभा में लाया जा सकता है।"
      }
    ]
  },

  achievements: [
    { id: "first_camp", title: "पहला अभियान", desc: "पहली बार जनसंपर्क या जनसभा आयोजित की।", unlocked: false },
    { id: "founder", title: "दल संस्थापक", desc: "आधिकारिक तौर पर राजनीतिक पार्टी का गठन किया।", unlocked: true },
    { id: "first_win", title: "पहली चुनावी विजय", desc: "स्थानीय निर्वाचन क्षेत्र में प्रथम जीत दर्ज की।", unlocked: false },
    { id: "mp", title: "संसद में प्रवेश", desc: "लोकसभा चुनाव जीतकर सांसद बने।", unlocked: false },
    { id: "majority", title: "पूर्ण बहुमत (272+ सीटें)", desc: "ऐतिहासिक जनादेश के साथ सरकार बनाई।", unlocked: false },
    { id: "pm", title: "भारत के प्रधानमंत्री", desc: "प्रधानमंत्री पद की शपथ ली।", unlocked: false }
  ]
};

const LevelTitles = {
  1: "आम नागरिक (Common Citizen)",
  2: "दल संस्थापक (Party Founder)",
  3: "स्थानीय प्रत्याशी (Local Candidate)",
  4: "जनप्रतिनिधि (Elected Representative)",
  5: "राज्यस्तरीय नेता (State Politician)",
  6: "विधानसभा चुनाव (State Election)",
  7: "राष्ट्रीय नेता (National Politician)",
  8: "सांसद (Member of Parliament)",
  9: "सरकार गठन (Govt Formation)",
  10: "प्रधानमंत्री (Prime Minister)",
  11: "राष्ट्र संचालन (Governance)",
  12: "अगला आम चुनाव (Next Election)"
};

// UI Controllers
function showBanner(text) {
  const b = document.getElementById("info-banner");
  document.getElementById("banner-text").textContent = text;
  b.classList.remove("hidden");
}

function hideBanner() {
  document.getElementById("info-banner").classList.add("hidden");
}

function formatINR(val) {
  if (val >= 10000000) return "₹" + (val / 10000000).toFixed(2) + " Cr";
  if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
  if (val >= 1000) return "₹" + (val / 1000).toFixed(1) + " K";
  return "₹" + val;
}

function updateTopBar() {
  document.getElementById("top-level-num").textContent = GameState.currentLevel;
  document.getElementById("top-level-title").textContent = LevelTitles[GameState.currentLevel].split(" ")[0];
  document.getElementById("top-day-tracker").textContent = `दिन ${GameState.gameDay} • चुनाव में ${GameState.electionCountdownDays} दिन शेष`;
  document.getElementById("res-funds").textContent = formatINR(GameState.party.funds);
  document.getElementById("res-trust").textContent = `${GameState.player.stats.publicTrust}%`;
  document.getElementById("res-energy").textContent = `${GameState.player.energy}%`;
}

function updateHomeMetrics() {
  document.getElementById("home-player-name").textContent = GameState.player.name;
  document.getElementById("home-party-line").textContent = `${GameState.party.name} (${GameState.party.shortName}) • ${GameState.party.symbol}`;
  document.getElementById("home-level-tag").textContent = `स्तर ${GameState.currentLevel}: ${LevelTitles[GameState.currentLevel].split("(")[0]}`;

  document.getElementById("m-funds").textContent = formatINR(GameState.party.funds);
  document.getElementById("m-trust").textContent = `${GameState.player.stats.publicTrust}%`;
  document.getElementById("m-pop").textContent = `${GameState.party.overallPopularity}%`;
  document.getElementById("m-volunteers").textContent = GameState.party.volunteersCount;
  document.getElementById("m-readiness").textContent = `${GameState.party.electionReadiness}%`;
  document.getElementById("m-seats").textContent = `${GameState.party.wonSeatsNational} / 543`;

  // Demographics
  const d = GameState.party.demographics;
  document.getElementById("demo-youth-val").textContent = d.youth + "%";
  document.getElementById("demo-youth-bar").style.width = d.youth + "%";
  document.getElementById("demo-rural-val").textContent = d.rural + "%";
  document.getElementById("demo-rural-bar").style.width = d.rural + "%";
  document.getElementById("demo-urban-val").textContent = d.urban + "%";
  document.getElementById("demo-urban-bar").style.width = d.urban + "%";
  document.getElementById("demo-farmers-val").textContent = d.farmers + "%";
  document.getElementById("demo-farmers-bar").style.width = d.farmers + "%";
  document.getElementById("demo-workers-val").textContent = d.workers + "%";
  document.getElementById("demo-workers-bar").style.width = d.workers + "%";

  // Objective
  const objEl = document.getElementById("home-objective-text");
  if (GameState.currentLevel <= 2) {
    objEl.textContent = "घर-घर संपर्क और जनसभाएं आयोजित कर चुनावी तैयारी 40%+ करें।";
  } else if (GameState.currentLevel === 3) {
    objEl.textContent = "स्थानीय निर्वाचन क्षेत्र में प्रचार कर प्रथम चुनावी विजय हासिल करें।";
  } else if (GameState.currentLevel >= 4 && GameState.currentLevel <= 7) {
    objEl.textContent = "विधानसभा व लोकसभा चुनाव में पार्टी के लिए अधिकतम सीटें जीतें।";
  } else if (GameState.currentLevel >= 8) {
    objEl.textContent = "बहुमत (272 सीटें) के साथ सरकार चलाएं, बजट पारित करें व संकट संभालें।";
  }
}

function switchScreen(screenId) {
  SoundFX.playClick();
  document.querySelectorAll(".game-screen").forEach(s => s.classList.remove("active", "hidden"));
  document.querySelectorAll(".game-screen").forEach(s => s.classList.add("hidden"));

  const target = document.getElementById("screen-" + screenId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("active");
  }

  // Update nav active
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === screenId);
  });

  if (screenId === "home") updateHomeMetrics();
  if (screenId === "campaign") renderCampaignActions();
  if (screenId === "map") renderConstituencies();
  if (screenId === "cabinet") renderMinisters();
  if (screenId === "budget") renderBudget();
  if (screenId === "parliament") renderParliament();
  if (screenId === "quiz") renderQuiz();
  if (screenId === "profile") renderProfile();
}

// 10 Campaign Actions Rendering
function renderCampaignActions() {
  document.getElementById("camp-funds").textContent = formatINR(GameState.party.funds);
  document.getElementById("camp-energy").textContent = `${GameState.player.energy}%`;
  document.getElementById("camp-readiness").textContent = `${GameState.party.electionReadiness}%`;

  const container = document.getElementById("campaign-actions-container");
  container.innerHTML = "";

  GameState.campaignActions.forEach(act => {
    const canAfford = GameState.party.funds >= act.cost && GameState.player.energy >= act.energy;
    const div = document.createElement("div");
    div.className = "action-card";
    div.innerHTML = `
      <div class="action-card-header">
        <div class="action-title-group">
          <span class="action-icon">${act.icon}</span>
          <div>
            <strong>${act.title}</strong>
            <div class="action-costs">व्यय: ₹${act.cost.toLocaleString('en-IN')} • ऊर्जा: ${act.energy}% • समय: ${act.days} दिन</div>
          </div>
        </div>
        <button class="btn-camp-exec" ${canAfford ? "" : "disabled"}>
          ${canAfford ? "आयोजित करें" : "संसाधन कम"}
        </button>
      </div>
      <p class="action-desc">${act.desc}</p>
    `;

    div.querySelector(".btn-camp-exec").onclick = () => executeCampaignAction(act);
    container.appendChild(div);
  });
}

function executeCampaignAction(act) {
  if (GameState.party.funds < act.cost || GameState.player.energy < act.energy) return;

  SoundFX.playClick();
  GameState.party.funds -= act.cost;
  GameState.player.energy -= act.energy;
  GameState.electionCountdownDays = Math.max(0, GameState.electionCountdownDays - act.days);

  GameState.player.stats.publicTrust = Math.min(100, GameState.player.stats.publicTrust + act.trust);
  GameState.party.overallPopularity = Math.min(100, GameState.party.overallPopularity + act.pop);
  GameState.party.electionReadiness = Math.min(100, GameState.party.electionReadiness + act.ready);
  GameState.party.volunteersCount += 25;

  // Unlock first campaign achievement
  const ach = GameState.achievements.find(a => a.id === "first_camp");
  if (ach) ach.unlocked = true;

  updateTopBar();
  renderCampaignActions();
  showBanner(`सफल! ${act.title} संपन्न हुआ। जनविश्वास +${act.trust}%, तैयारी +${act.ready}%`);
}

// Map Rendering
function renderConstituencies() {
  const container = document.getElementById("constituency-items-container");
  container.innerHTML = "";

  GameState.constituencies.forEach(c => {
    const div = document.createElement("div");
    div.className = "const-item";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${c.name}</strong> (${c.district}, ${c.state})
        </div>
        ${c.isHome ? `<span class="badge-win" style="background:var(--indian-green); font-size:10px;">गृह क्षेत्र</span>` : ""}
      </div>
      <div style="font-size:11px; margin-top:4px; display:flex; justify-content:space-between;">
        <span class="text-saffron">आपकी पार्टी: ${c.playerSupport}%</span>
        <span class="text-red">प्रतिद्वंद्वी: ${c.oppSupport}%</span>
      </div>
      <div class="progress-bar mt-8"><div class="fill bg-saffron" style="width:${c.playerSupport}%;"></div></div>
      <div style="font-size:11px; color:var(--gold-accent); margin-top:4px;">स्थानीय मुद्दा: ${c.topIssue}</div>
    `;
    container.appendChild(div);
  });
}

// Advance Day
function advanceDay() {
  SoundFX.playClick();
  GameState.gameDay += 1;
  GameState.electionCountdownDays = Math.max(0, GameState.electionCountdownDays - 1);
  GameState.player.energy = Math.min(100, GameState.player.energy + 40);

  // Daily donations from volunteers & public
  const donation = (GameState.party.membersCount * 5) + (GameState.party.overallPopularity * 250);
  GameState.party.funds += donation;

  updateTopBar();
  showBanner(`नया दिन ${GameState.gameDay} प्रारंभ! पार्टी सदस्यता व सूक्ष्म चंदे से ${formatINR(donation)} प्राप्त हुए।`);

  // Random crisis trigger on day multiples of 4
  if (GameState.gameDay % 4 === 0) {
    setTimeout(triggerSuddenCrisis, 500);
  }
}

// Sudden Crisis / Natural Disaster Trigger
function triggerSuddenCrisis() {
  SoundFX.playAlert();
  const modal = document.getElementById("crisis-modal");
  modal.classList.remove("hidden");

  const isDisaster = (GameState.gameDay % 8 === 0);
  const title = isDisaster ? "भीषण बाढ़ संकट: गंगा बेसिन" : "मीडिया ट्रायल: विपक्षी दल का तीखा आरोप";
  const desc = isDisaster
    ? "लगातार मूसलाधार बारिश से 4 जिलों में 500 से अधिक गांव जलमग्न हो गए हैं। लगभग 3 लाख नागरिक प्रभावित हैं।"
    : "एक प्रमुख समाचार चैनल पर मुख्य डिबेट में विपक्षी प्रवक्ता ने आरोप लगाया है कि आपकी योजनाएं केवल चुनावी जुमला हैं।";

  document.getElementById("crisis-title").textContent = title;
  document.getElementById("crisis-desc").textContent = desc;

  const choicesContainer = document.getElementById("crisis-choices-container");
  choicesContainer.innerHTML = "";

  const choices = isDisaster ? [
    { title: "सेना/NDRF व ₹2,000 करोड़ का त्वरित राहत पैकेज", cost: 0, trust: 12, pop: 8, res: "बचाव कार्य युद्धस्तर पर शुरू हुए और 80,000 नागरिकों को सुरक्षित निकाला गया।" },
    { title: "स्थानीय प्रशासन द्वारा राहत और सीमित वित्तीय सहायता", cost: 0, trust: -4, pop: -5, res: "राहत सामग्री में देरी से स्थानीय नागरिकों में असंतोष फैला।" },
    { title: "स्वयं प्रभावित क्षेत्र का हवाई दौरा व डिजिटल राहत कोष", cost: 50000, trust: 6, pop: 10, res: "आपकी प्रत्यक्ष उपस्थिति से कार्यकर्ताओं में ऊर्जा आई।" }
  ] : [
    { title: "आंकड़ों व विस्तृत ब्लूप्रिंट के साथ तत्काल लाइव प्रेस वार्ता", cost: 35000, trust: 8, pop: 6, res: "पत्रकारों के सभी तकनीकी प्रश्नों का स्पष्ट उत्तर दिया गया।" },
    { title: "आरोपों को नजरअंदाज कर जमीनी जनसंपर्क जारी रखना", cost: 0, trust: -2, pop: -3, res: "चैनल ने आपकी चुप्पी को कमजोरी के रूप में प्रस्तुत किया।" },
    { title: "युवा विंग द्वारा सोशल मीडिया पर तथ्यपरक वीडियो अभियान", cost: 20000, trust: 5, pop: 8, res: "शॉर्ट वीडियोज ने ट्रेंड किया और विपक्ष के दावों की हवा निकल गई।" }
  ];

  choices.forEach(ch => {
    const card = document.createElement("div");
    card.className = "crisis-choice-card";
    card.innerHTML = `
      <div class="crisis-choice-title">${ch.title}</div>
      <div class="crisis-choice-fx">लागत: ₹${ch.cost.toLocaleString('en-IN')} • जनविश्वास: ${ch.trust >= 0 ? '+' : ''}${ch.trust}%</div>
    `;
    card.onclick = () => {
      SoundFX.playClick();
      modal.classList.add("hidden");
      GameState.party.funds = Math.max(0, GameState.party.funds - ch.cost);
      GameState.player.stats.publicTrust = Math.max(0, Math.min(100, GameState.player.stats.publicTrust + ch.trust));
      GameState.party.overallPopularity = Math.max(0, Math.min(100, GameState.party.overallPopularity + ch.pop));
      updateTopBar();

      // Show outcome modal
      const outModal = document.getElementById("outcome-modal");
      document.getElementById("outcome-text").textContent = ch.res;
      outModal.classList.remove("hidden");
    };
    choicesContainer.appendChild(card);
  });
}

// Election Counting Simulation
function conductElectionDay() {
  SoundFX.playClick();
  switchScreen("election");

  const spinner = document.getElementById("counting-spinner");
  const resultCard = document.getElementById("election-result-card");
  const triggerBtn = document.getElementById("btn-count-votes");

  triggerBtn.disabled = true;
  resultCard.classList.add("hidden");
  spinner.classList.remove("hidden");

  setTimeout(() => {
    spinner.classList.add("hidden");
    triggerBtn.disabled = false;

    // Realistic Election Probability formula
    const homeConst = GameState.constituencies[0];
    const playerFactor = (GameState.player.stats.publicTrust * 0.4 + GameState.player.stats.leadership * 0.3) / 100;
    const partyFactor = (GameState.party.overallPopularity * 0.5 + GameState.party.electionReadiness * 0.4) / 100;
    const rawPlayer = (playerFactor * 35) + (partyFactor * 40) + (Math.random() * 8 - 4);
    const rawOpp = homeConst.oppSupport + (Math.random() * 6 - 3);
    const rawOther = 15.0;

    const total = rawPlayer + rawOpp + rawOther;
    const playerPct = Math.round((rawPlayer / total) * 100);
    const oppPct = Math.round((rawOpp / total) * 100);
    const otherPct = Math.max(0, 100 - (playerPct + oppPct));

    const totalVotes = Math.round(homeConst.voters * 0.68);
    const playerVotes = Math.round(totalVotes * (playerPct / 100));
    const oppVotes = Math.round(totalVotes * (oppPct / 100));
    const otherVotes = totalVotes - (playerVotes + oppVotes);

    const isWin = playerVotes > oppVotes;
    const margin = Math.abs(playerVotes - oppVotes);

    if (isWin) {
      SoundFX.playVictory();
      GameState.party.wonSeatsNational += 1;
      GameState.achievements.find(a => a.id === "first_win").unlocked = true;

      // Level progression promotion
      if (GameState.currentLevel < 3) {
        GameState.currentLevel = 4; // Elected representative
      } else if (GameState.currentLevel === 4) {
        GameState.currentLevel = 8; // MP
        GameState.achievements.find(a => a.id === "mp").unlocked = true;
      }
    }

    resultCard.classList.remove("hidden");
    resultCard.innerHTML = `
      <div class="result-header">
        <strong>परिणाम: ${homeConst.name}</strong>
        <span class="${isWin ? 'badge-win' : 'badge-lost'}">${isWin ? 'विजयी (WIN)' : 'पराजित (LOST)'}</span>
      </div>
      <div class="demo-item">
        <div class="demo-label"><span>${GameState.party.name} (${GameState.party.shortName})</span> <strong>${playerPct}% (${playerVotes.toLocaleString('en-IN')} मत)</strong></div>
        <div class="progress-bar"><div class="fill bg-saffron" style="width:${playerPct}%;"></div></div>
      </div>
      <div class="demo-item">
        <div class="demo-label"><span>मुख्य विपक्षी दल</span> <strong>${oppPct}% (${oppVotes.toLocaleString('en-IN')} मत)</strong></div>
        <div class="progress-bar"><div class="fill bg-blue" style="width:${oppPct}%;"></div></div>
      </div>
      <div class="demo-item">
        <div class="demo-label"><span>अन्य / निर्दलीय</span> <strong>${otherPct}% (${otherVotes.toLocaleString('en-IN')} मत)</strong></div>
        <div class="progress-bar"><div class="fill bg-slate" style="width:${otherPct}%;"></div></div>
      </div>
      <p style="font-size:12px; margin-top:12px; font-weight:700; color:${isWin ? 'var(--emerald-success)' : 'var(--crimson-danger)'};">
        ${isWin ? `जीत का अंतर: ${margin.toLocaleString('en-IN')} मतों से ऐतिहासिक विजय!` : `हार का अंतर: ${margin.toLocaleString('en-IN')} मतों से पीछे रहे।`}
      </p>
    `;

    updateTopBar();
    showBanner(isWin ? "शानदार विजय! जनसमर्थन से आप विजयी घोषित किए गए।" : "कड़ा मुकाबला! कुछ ही मतों से अंतर रह गया। संगठन मजबूत करें।");
  }, 1200);
}

// Ministers Rendering
function renderMinisters() {
  const container = document.getElementById("ministers-container");
  container.innerHTML = "";

  GameState.ministers.forEach(m => {
    const div = document.createElement("div");
    div.className = "minister-card";
    div.innerHTML = `
      <div>
        <div class="minister-name">${m.name}</div>
        <div class="minister-port">${m.portfolio}</div>
      </div>
      <span class="badge-win" style="background:var(--border-card); color:var(--emerald-success);">दक्षता: ${m.comp}%</span>
    `;
    container.appendChild(div);
  });
}

// Budget Rendering
function renderBudget() {
  const b = GameState.nationalBudget;
  const container = document.getElementById("budget-items-container");
  container.innerHTML = "";

  let totalExp = 0;
  Object.keys(b.allocations).forEach(cat => {
    const amt = b.allocations[cat];
    totalExp += amt;

    const div = document.createElement("div");
    div.className = "budget-item";
    div.innerHTML = `
      <div>
        <div style="font-size:12px; font-weight:600;">${cat}</div>
        <div style="font-size:13px; font-weight:800; color:var(--saffron-light);">₹${amt.toLocaleString('en-IN')} Cr</div>
      </div>
      <div class="b-ctrls">
        <button class="btn-b-adj btn-dec" data-cat="${cat}">-</button>
        <button class="btn-b-adj btn-inc" data-cat="${cat}">+</button>
      </div>
    `;

    div.querySelector(".btn-dec").onclick = () => {
      if (b.allocations[cat] > 10000) {
        b.allocations[cat] -= 10000;
        renderBudget();
      }
    };
    div.querySelector(".btn-inc").onclick = () => {
      b.allocations[cat] += 10000;
      renderBudget();
    };

    container.appendChild(div);
  });

  const deficit = Math.max(0, totalExp - b.revenue);
  document.getElementById("b-total-exp").textContent = `₹${totalExp.toLocaleString('en-IN')} करोड़`;
  document.getElementById("b-deficit").textContent = `₹${deficit.toLocaleString('en-IN')} करोड़`;
}

// Parliament Floor Rendering
function renderParliament() {
  const container = document.getElementById("parliament-bills-container");
  container.innerHTML = "";

  GameState.parliamentBills.forEach(bill => {
    const div = document.createElement("div");
    div.className = "bill-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <strong style="color:var(--saffron-light); font-size:13px; flex:1;">${bill.title}</strong>
        <span class="badge-win" style="background:${bill.status.includes('Passed') ? 'var(--emerald-success)' : bill.status.includes('Defeated') ? 'var(--crimson-danger)' : 'var(--gold-accent)'}; color:#fff; font-size:10px;">${bill.status}</span>
      </div>
      <p style="font-size:11px; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${bill.desc}</p>
      ${bill.status.includes('Pending') ? `
        <div class="bill-votes-row">
          <button class="btn-vote-aye">पक्ष में मत (Aye)</button>
          <button class="btn-vote-no">विपक्ष में मत (No)</button>
        </div>
      ` : `
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:8px;">
          <span class="text-green">पक्ष: ${bill.govtVotes} मत</span>
          <span class="text-red">विपक्ष: ${bill.oppVotes} मत</span>
        </div>
      `}
    `;

    if (bill.status.includes('Pending')) {
      div.querySelector(".btn-vote-aye").onclick = () => {
        SoundFX.playClick();
        bill.govtVotes = 285;
        bill.oppVotes = 15;
        bill.status = "पारित (Passed)";
        showBanner("विधेयक ध्वनि मत एवं मतविभाजन से संसद में पारित हुआ!");
        renderParliament();
      };
      div.querySelector(".btn-vote-no").onclick = () => {
        SoundFX.playClick();
        bill.govtVotes = 30;
        bill.oppVotes = 270;
        bill.status = "अस्वीकृत (Defeated)";
        showBanner("विधेयक बहुमत न मिलने के कारण सदन द्वारा अस्वीकृत हुआ।");
        renderParliament();
      };
    }

    container.appendChild(div);
  });
}

// Quiz Rendering
function renderQuiz() {
  const qObj = GameState.quiz;
  const curQ = qObj.questions[qObj.currentIndex];

  document.getElementById("quiz-score-val").textContent = `${qObj.score} अंक`;
  document.getElementById("quiz-step-tag").textContent = `प्रश्न ${qObj.currentIndex + 1} / ${qObj.questions.length}`;
  document.getElementById("quiz-category").textContent = curQ.cat;
  document.getElementById("quiz-question-text").textContent = curQ.q;

  const optContainer = document.getElementById("quiz-options-container");
  optContainer.innerHTML = "";

  curQ.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt-btn";
    if (qObj.selectedOption === idx) btn.classList.add("selected");
    if (qObj.submitted) {
      if (idx === curQ.correct) btn.classList.add("correct");
      else if (qObj.selectedOption === idx) btn.classList.add("wrong");
    }

    btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> <span>${opt}</span>`;
    btn.onclick = () => {
      if (!qObj.submitted) {
        SoundFX.playClick();
        qObj.selectedOption = idx;
        renderQuiz();
      }
    };
    optContainer.appendChild(btn);
  });

  const expBox = document.getElementById("quiz-explanation");
  const submitBtn = document.getElementById("btn-submit-quiz");

  if (qObj.submitted) {
    expBox.classList.remove("hidden");
    expBox.textContent = `संवैधानिक व्याख्या: ${curQ.exp}`;
    submitBtn.textContent = "अगला प्रश्न ➔";
    submitBtn.onclick = () => {
      SoundFX.playClick();
      qObj.currentIndex = (qObj.currentIndex + 1) % qObj.questions.length;
      qObj.selectedOption = null;
      qObj.submitted = false;
      renderQuiz();
    };
  } else {
    expBox.classList.add("hidden");
    submitBtn.textContent = "उत्तर जमा करें (+10 अंक)";
    submitBtn.onclick = () => {
      if (qObj.selectedOption === null) return;
      SoundFX.playClick();
      qObj.submitted = true;
      if (qObj.selectedOption === curQ.correct) {
        SoundFX.playVictory();
        qObj.score += 10;
        GameState.player.stats.politicalKnowledge = Math.min(100, GameState.player.stats.politicalKnowledge + 3);
        GameState.player.stats.leadership = Math.min(100, GameState.player.stats.leadership + 2);
        showBanner("सही उत्तर! +10 ज्ञान अंक व राजनीतिक समझ में वृद्धि।");
      } else {
        SoundFX.playAlert();
        showBanner("उत्तर गलत है। सही व्याख्या का अध्ययन करें।");
      }
      renderQuiz();
    };
  }
}

// Profile & Achievements Rendering
function renderProfile() {
  document.getElementById("prof-name").textContent = GameState.player.name;
  document.getElementById("prof-occ").textContent = `${GameState.player.occupation} • ${GameState.player.education}`;
  document.getElementById("prof-lead").textContent = GameState.player.stats.leadership;
  document.getElementById("prof-comm").textContent = GameState.player.stats.communication;
  document.getElementById("prof-admin").textContent = GameState.player.stats.administration;
  document.getElementById("prof-crisis").textContent = GameState.player.stats.crisisManagement;

  const container = document.getElementById("achievements-container");
  container.innerHTML = "";

  GameState.achievements.forEach(ach => {
    const div = document.createElement("div");
    div.className = `ach-card ${ach.unlocked ? 'unlocked' : ''}`;
    div.innerHTML = `
      <span class="ach-icon">${ach.unlocked ? '🏆' : '🔒'}</span>
      <div>
        <div style="font-size:13px; font-weight:700; color:${ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)'};">${ach.title}</div>
        <div style="font-size:11px; color:var(--text-secondary);">${ach.desc}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Attach Event Listeners on DOM Load
window.addEventListener("DOMContentLoaded", () => {
  // Opening to Player Creation
  document.getElementById("btn-start-journey").onclick = () => {
    SoundFX.playClick();
    document.getElementById("screen-opening").classList.remove("active");
    document.getElementById("screen-opening").classList.add("hidden");
    document.getElementById("screen-player-creation").classList.remove("hidden");
    document.getElementById("screen-player-creation").classList.add("active");
  };

  // Player Creation to Party Creation
  document.getElementById("btn-to-party-creation").onclick = () => {
    SoundFX.playClick();
    GameState.player.name = document.getElementById("player-name").value || "अर्जुन शर्मा";
    GameState.player.age = parseInt(document.getElementById("player-age").value) || 32;
    GameState.player.gender = document.getElementById("player-gender").value;
    GameState.player.state = document.getElementById("player-state").value;
    GameState.player.constituency = document.getElementById("player-constituency").value || "वाराणसी उत्तर";
    GameState.player.occupation = document.getElementById("player-occupation").value;

    document.getElementById("screen-player-creation").classList.remove("active");
    document.getElementById("screen-player-creation").classList.add("hidden");
    document.getElementById("screen-party-creation").classList.remove("hidden");
    document.getElementById("screen-party-creation").classList.add("active");
  };

  // Party Creation Finish -> Home
  document.getElementById("btn-finish-party").onclick = () => {
    SoundFX.playClick();
    GameState.party.name = document.getElementById("party-name").value || "जन उत्थान पार्टी";
    GameState.party.shortName = document.getElementById("party-shortname").value || "JUP";
    GameState.party.slogan = document.getElementById("party-slogan").value || "जन सेवा ही राष्ट्र सेवा";
    GameState.currentLevel = 2; // Party Founder

    // Reveal top bar and bottom nav
    document.getElementById("top-bar").classList.remove("hidden");
    document.getElementById("bottom-nav").classList.remove("hidden");

    switchScreen("home");
    showBanner("बधाई! पार्टी का गठन संपन्न हुआ। अब अपना पहला चुनावी अभियान चलाएं।");
  };

  // Navigation Items
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.onclick = () => switchScreen(btn.dataset.screen);
  });

  // Home Quick Action Buttons
  document.getElementById("btn-quick-campaign").onclick = () => switchScreen("campaign");
  document.getElementById("btn-quick-map").onclick = () => switchScreen("map");
  document.getElementById("btn-quick-election").onclick = () => conductElectionDay();
  document.getElementById("btn-quick-parliament").onclick = () => switchScreen("parliament");

  // Top Bar Advance Day & Lang Toggle
  document.getElementById("btn-advance-day").onclick = advanceDay;
  document.getElementById("btn-lang-toggle").onclick = () => {
    SoundFX.playClick();
    GameState.isHindi = !GameState.isHindi;
    document.getElementById("btn-lang-toggle").textContent = GameState.isHindi ? "EN" : "हिन्दी";
    showBanner(GameState.isHindi ? "भाषा: हिन्दी चयनित" : "Language set to English");
  };

  document.getElementById("btn-banner-close").onclick = hideBanner;
  document.getElementById("btn-close-outcome").onclick = () => {
    SoundFX.playClick();
    document.getElementById("outcome-modal").classList.add("hidden");
  };

  // Election Vote Counting Trigger
  document.getElementById("btn-count-votes").onclick = conductElectionDay;

  // Cabinet & PM Dashboard Tabs
  document.getElementById("tab-ministers").onclick = () => {
    SoundFX.playClick();
    document.getElementById("tab-ministers").classList.add("active");
    document.getElementById("tab-pm-stats").classList.remove("active");
    document.getElementById("view-ministers").classList.remove("hidden");
    document.getElementById("view-pm-stats").classList.add("hidden");
  };
  document.getElementById("tab-pm-stats").onclick = () => {
    SoundFX.playClick();
    document.getElementById("tab-pm-stats").classList.add("active");
    document.getElementById("tab-ministers").classList.remove("active");
    document.getElementById("view-pm-stats").classList.remove("hidden");
    document.getElementById("view-ministers").classList.add("hidden");
  };
  document.getElementById("btn-open-budget-view").onclick = () => switchScreen("budget");
  document.getElementById("btn-back-to-cabinet").onclick = () => switchScreen("cabinet");

  // Save Game local storage
  document.getElementById("btn-save-game").onclick = () => {
    SoundFX.playClick();
    try {
      localStorage.setItem("rashtraniti_save", JSON.stringify(GameState));
      showBanner("खेल की प्रगति सफलतापूर्वक सहेजी गई (Saved locally)!");
    } catch(e) {
      showBanner("प्रगति सहेजने में त्रुटि।");
    }
  };

  // Symbol selector chips
  document.querySelectorAll(".btn-symbol").forEach(btn => {
    btn.onclick = () => {
      SoundFX.playClick();
      document.querySelectorAll(".btn-symbol").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      GameState.party.symbol = btn.dataset.symbol;
    };
  });

  // Color Swatches
  document.querySelectorAll(".swatch").forEach(s => {
    s.onclick = () => {
      SoundFX.playClick();
      document.querySelectorAll(".swatch").forEach(sw => sw.classList.remove("active"));
      s.classList.add("active");
      GameState.party.flagColorHex = s.dataset.color;
    };
  });

  // Priority Chips
  document.querySelectorAll(".chip").forEach(ch => {
    ch.onclick = () => {
      SoundFX.playClick();
      ch.classList.toggle("active");
    };
  });
});
