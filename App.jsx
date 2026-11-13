import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import {
  Trophy,
  Play,
  Users,
  QrCode,
  Zap,
  Snowflake,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  X,
  RotateCcw,
  Download,
  Settings,
  ShieldCheck,
  Radio,
  ArrowRight,
  Flame,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';

// ============================================================================
// OPTIONAL: PASTE YOUR FIREBASE CONFIG HERE FOR PERMANENT DEPLOYMENT
// ============================================================================
const DEFAULT_FIREBASE_CONFIG = null;
/* Example:
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
*/

// ============================================================================
// COMPLETE 20-QUESTION BANK (CHAPTER 5: SOCIALIST-ORIENTED MARKET ECONOMY)
// 8 Easy (40%), 8 Medium (40%), 4 Hard (20%)
// ============================================================================
const QUIZ_QUESTIONS = [
  {
    id: 1,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      "Which landmark reform launched in 1986 initiated Vietnam's transition from a centrally planned economy to a socialist-oriented market economy?",
    options: [
      'Đổi Mới (Renovation)',
      'Five-Year Heavy Industry Plan',
      'ASEAN Free Trade Accession',
      'State Enterprise Equitization Law',
    ],
    correctAnswer: 'Đổi Mới (Renovation)',
    explanation:
      'Introduced in 1986, Đổi Mới dismantled central planning, introduced market mechanisms, encouraged private enterprise, and opened Vietnam to global trade.',
  },
  {
    id: 2,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      "Which legal milestone formally recognizes Vietnam's economy as a socialist-oriented market economy with multiple forms of ownership and economic sectors?",
    options: [
      'The 2013 Constitution (Article 51)',
      'The 1992 Enterprise Decree',
      'The 2005 Commercial Code',
      'The 1986 Sixth Party Congress Resolution',
    ],
    correctAnswer: 'The 2013 Constitution (Article 51)',
    explanation:
      'Article 51 of the 2013 Constitution formally codifies Vietnam’s multi-sector socialist-oriented market economy.',
  },
  {
    id: 3,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      'What is the primary difference between general "Institutions" and "Economic Institutions" according to Chapter 5?',
    options: [
      'Their scope of regulation',
      'The government agency that drafts them',
      'Their mandatory expiration timeline',
      'The financial penalties imposed for violations',
    ],
    correctAnswer: 'Their scope of regulation',
    explanation:
      'General institutions govern all political, social, and economic activities in society, whereas economic institutions specifically regulate economic behavior, business operations, and economic relations.',
  },
  {
    id: 4,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      'According to Chapter 5 (Slide 19), how many main reasons explain why Vietnam must continuously improve its socialist-oriented market economic institutions?',
    options: ['3 main reasons', '2 main reasons', '4 main reasons', '5 main reasons'],
    correctAnswer: '3 main reasons',
    explanation:
      'The three reasons are: (1) current institutions are not synchronous, (2) the institutional system is incomplete, and (3) the system is ineffective and lacks market factors/types of markets.',
  },
  {
    id: 5,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      'Because land in Vietnam is exclusively owned by the "entire people" with the State acting as representative owner, what right do citizens and businesses hold?',
    options: [
      'Land Use Rights (LURs)',
      'Absolute private freehold ownership',
      'Unrestricted mineral extraction rights',
      'Permanent exemption from state land recovery',
    ],
    correctAnswer: 'Land Use Rights (LURs)',
    explanation:
      'Under Vietnamese law, land belongs to the entire people; citizens and enterprises hold legally protected Land Use Rights (LURs).',
  },
  {
    id: 6,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      "Which four economic sectors operate together under the law in Vietnam's socialist-oriented market economy?",
    options: [
      'State, Collective, Private, and Foreign-Invested',
      'Central, Provincial, Municipal, and Household',
      'Industrial, Agricultural, Service, and Digital',
      'Public, Cooperative, Joint-Venture, and Multinational',
    ],
    correctAnswer: 'State, Collective, Private, and Foreign-Invested',
    explanation:
      'Vietnam recognizes State, Collective, Private, and Foreign-Invested sectors as equal, cooperative, and competitive under the law.',
  },
  {
    id: 7,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      'According to Section 3.2.1, which four core "market factors" must institutional improvements ensure operate synchronously?',
    options: [
      'Prices, commodities, competition, and supply & demand',
      'Capital, technology, labor, and real estate',
      'Taxes, interest rates, exchange rates, and inflation',
      'Producers, consumers, commercial banks, and regulators',
    ],
    correctAnswer: 'Prices, commodities, competition, and supply & demand',
    explanation:
      'Prices, commodities, competition, and supply & demand are the four fundamental market factors identified in Chapter 5.',
  },
  {
    id: 8,
    difficulty: 'Easy',
    timeLimit: 20,
    question:
      "Improving the political system's capacity to develop economic institutions focuses on which three interconnected pillars?",
    options: [
      "Party leadership, State economic management, and People's mastery role",
      'National Assembly legislation, Supreme Court rulings, and Local Councils',
      'State-owned enterprises, Trade unions, and Business associations',
      'Central planning boards, Tax authorities, and Customs agencies',
    ],
    correctAnswer: "Party leadership, State economic management, and People's mastery role",
    explanation:
      'Section 3.4 highlights strengthening Party leadership capacity, improving State economic management, and promoting the People’s mastery role.',
  },
  {
    id: 9,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'According to the 2023 VCCI report cited in Section 2.2.2, approximately what percentage of businesses reported that legal regulations still overlap and create implementation obstacles?',
    options: ['About 67%', 'About 42%', 'About 25%', 'About 85%'],
    correctAnswer: 'About 67%',
    explanation:
      'About 67% of surveyed businesses in the 2023 VCCI report cited overlapping legal rules across Enterprise, Investment, Land, Bidding, and Planning laws.',
  },
  {
    id: 10,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'According to the 2023 PCI report referenced in Section 2.2.2, what share of businesses still face difficulties due to unconnected administrative procedures?',
    options: ['42%', '67%', '18%', '75%'],
    correctAnswer: '42%',
    explanation:
      'The 2023 PCI report found that 42% of businesses still struggle with fragmented, unconnected administrative procedures.',
  },
  {
    id: 11,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'Which real-world conflict between two laws is cited in Section 2.2.4 as stalling renewable energy projects in Vietnam?',
    options: [
      'The 2020 Environmental Protection Law vs. the 2014 Construction Law on EIA timing',
      'The Enterprise Law vs. the Labor Code on minimum wage adjustments',
      'The Intellectual Property Law vs. the Customs Law on software imports',
      'The Bidding Law vs. the Commercial Law on retail pricing',
    ],
    correctAnswer:
      'The 2020 Environmental Protection Law vs. the 2014 Construction Law on EIA timing',
    explanation:
      'The 2020 Environmental Protection Law requires an EIA before an investment license, whereas the 2014 Construction Law places it after project approval.',
  },
  {
    id: 12,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'According to Chapter 5 (Slide 28), what is identified as the direct motivation driving socio-economic actors to participate in economic activities?',
    options: [
      'Economic benefit',
      'Administrative directives from local authorities',
      'Voluntary charitable obligation',
      'International trade sanctions',
    ],
    correctAnswer: 'Economic benefit',
    explanation:
      'Chapter 5 identifies legitimate economic benefit as the direct motivation propelling socio-economic actors to innovate, raise income, and drive growth.',
  },
  {
    id: 13,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'To prevent waste and corruption in State-Owned Enterprises (SOEs), what guiding principle must govern state capital investments (Section 3.1.4)?',
    options: [
      'Operating on commercial, market-driven principles rather than state subsidies',
      'Guaranteeing full budget bailouts regardless of financial losses',
      'Prohibiting private enterprises from entering SOE-dominated sectors',
      'Setting fixed administrative prices for all SOE outputs',
    ],
    correctAnswer:
      'Operating on commercial, market-driven principles rather than state subsidies',
    explanation:
      'State capital investments in SOEs must operate under transparent, market-driven commercial discipline instead of relying on subsidies.',
  },
  {
    id: 14,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'In Vietnam’s international economic integration strategy (Section 3.3.3), what does "Multilateralization" specifically mean?',
    options: [
      'Expanding cooperation beyond bilateral ties to join multi-nation forums and trade blocs (WTO, ASEAN, CPTPP)',
      'Signing exclusively one-on-one trade agreements with neighboring countries',
      'Concentrating all export supply chains into a single major foreign market',
      'Eliminating all domestic regulatory standards for foreign imports',
    ],
    correctAnswer:
      'Expanding cooperation beyond bilateral ties to join multi-nation forums and trade blocs (WTO, ASEAN, CPTPP)',
    explanation:
      'Multilateralization means participating actively in regional and global multi-nation institutions and trade blocs rather than relying only on bilateral links.',
  },
  {
    id: 15,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      'Why must Vietnam "internalize international treaties" (nội luật hóa) after joining new-generation FTAs like CPTPP, EVFTA, and RCEP?',
    options: [
      'To avoid trade remedies, ensure legal certainty for FDI, and utilize preferential tariff Rules of Origin',
      'To replace the national Constitution entirely with foreign commercial law',
      'To restrict domestic private companies from accessing export tax incentives',
      'To raise non-tariff barriers against fellow ASEAN member states',
    ],
    correctAnswer:
      'To avoid trade remedies, ensure legal certainty for FDI, and utilize preferential tariff Rules of Origin',
    explanation:
      'Harmonizing domestic laws with FTA rules shields Vietnamese exports from sanctions, reassures investors, and unlocks preferential tariffs.',
  },
  {
    id: 16,
    difficulty: 'Medium',
    timeLimit: 20,
    question:
      "How does Section 3.1.7 characterize the relationship between 'cooperation' and 'competition' among Vietnam's economic sectors?",
    options: [
      'Both coexist under the law: cooperation shares resources while healthy competition drives innovation and efficiency',
      'Cooperation eliminates the need for competition across all strategic industries',
      'Only private firms compete with each other while state enterprises only cooperate',
      'Competition is restricted solely to consumer goods and excluded from capital markets',
    ],
    correctAnswer:
      'Both coexist under the law: cooperation shares resources while healthy competition drives innovation and efficiency',
    explanation:
      'Economic sectors both cooperate (sharing supply chains, capital, and technology) and compete under the law to boost productivity and quality.',
  },
  {
    id: 17,
    difficulty: 'Hard',
    timeLimit: 30,
    question:
      'Based on Sections 2.3 and 2.4, what is the essential analytical distinction between an institutional system that is "incomplete" versus one that is "ineffective"?',
    options: [
      '"Incomplete" means missing rules for new actors/assets/relations, whereas "ineffective" means existing rules fail in enforcement',
      '"Incomplete" applies only to central ministries, whereas "ineffective" applies only to provincial governments',
      '"Incomplete" refers to shortages of foreign capital, whereas "ineffective" refers to outdated factory technology',
      '"Incomplete" affects only private startups, whereas "ineffective" affects only state-owned monopolies',
    ],
    correctAnswer:
      '"Incomplete" means missing rules for new actors/assets/relations, whereas "ineffective" means existing rules fail in enforcement',
    explanation:
      'Incompleteness denotes legal gaps where rules do not yet exist for emerging economic relations, while ineffectiveness means existing rules are poorly enforced in practice.',
  },
  {
    id: 18,
    difficulty: 'Hard',
    timeLimit: 30,
    question:
      'According to Chapter 5 (Slide 10, cited in Section 2.3), "Ownership" is a dialectical unity of which two contents, and what happens when institutional coverage is incomplete?',
    options: [
      'Economic content (benefits derived) and legal content (rights & obligations); without legal rules, economic benefits lack security',
      'Tangible content (physical land) and intangible content (brand logos); without rules, logos lose market value',
      'Individual content and collective content; without rules, collective cooperatives automatically become private firms',
      'Market content and planned content; without rules, the State cannot collect corporate income taxes',
    ],
    correctAnswer:
      'Economic content (benefits derived) and legal content (rights & obligations); without legal rules, economic benefits lack security',
    explanation:
      'Ownership unites economic content (realizing economic benefit) and legal content (legally defined rights/obligations). Without complete legal institutions, economic benefits lack protection.',
  },
  {
    id: 19,
    difficulty: 'Hard',
    timeLimit: 30,
    question:
      "Which two extreme policy errors does Vietnam's approach to linking economic growth with social progress and equity (Section 3.3.1) explicitly reject?",
    options: [
      'Waiting until the economy becomes wealthy before addressing equity, and egalitarianism (bình quân chủ nghĩa) that sacrifices efficiency',
      'Attracting foreign direct investment and equitizing inefficient state-owned enterprises',
      'Establishing a multi-tiered social security net and expanding public access to healthcare and education',
      'Using market prices to allocate resources and enforcing anti-monopoly competition laws',
    ],
    correctAnswer:
      'Waiting until the economy becomes wealthy before addressing equity, and egalitarianism (bình quân chủ nghĩa) that sacrifices efficiency',
    explanation:
      'Vietnam integrates social equity into every step of growth—rejecting both "grow first, distribute later" and egalitarianism that destroys productivity incentives.',
  },
  {
    id: 20,
    difficulty: 'Hard',
    timeLimit: 30,
    question:
      'According to the synthesis in Sections 2.3 and 2.5, all three institutional flaws (lack of synchronization, incompleteness, and ineffectiveness) converge on which two overarching consequences?',
    options: [
      "Weakening the link between economic effort and economic benefit, and limiting the State's capacity to reconcile benefit conflicts",
      "Triggering immediate hyperinflation and depleting the nation's foreign exchange reserves",
      'Eliminating the collective economy and turning private enterprises into state monopolies',
      'Halting all international exports and forcing withdrawal from new-generation FTAs',
    ],
    correctAnswer:
      "Weakening the link between economic effort and economic benefit, and limiting the State's capacity to reconcile benefit conflicts",
    explanation:
      'All three institutional flaws erode the direct incentive between effort and economic benefit (Slide 28) while impairing the State’s ability to harmonize and arbitrate conflicting interests (Slide 33).',
  },
];

const OPTION_STYLES = [
  {
    bg: 'bg-rose-600 hover:bg-rose-500 border-rose-400',
    badge: 'A',
    shape: '▲',
  },
  {
    bg: 'bg-blue-600 hover:bg-blue-500 border-blue-400',
    badge: 'B',
    shape: '◆',
  },
  {
    bg: 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-slate-950',
    badge: 'C',
    shape: '●',
  },
  {
    bg: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400',
    badge: 'D',
    shape: '■',
  },
];

const AVATARS = ['🚀', '🦁', '🦊', '🐼', '⚡', '🔥', '🎯', '🏆', '🦉', '🐉', '🌟', '💎'];

// Helper to extract Firebase config from raw JS snippet or JSON string
function parseFirebaseConfigInput(rawText) {
  if (!rawText || !rawText.trim()) return null;
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && parsed.apiKey && parsed.projectId) return parsed;
  } catch (_) {
    // Fallback regex extraction for JS object literal copied from Firebase Console
  }
  const keys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  const extracted = {};
  for (const key of keys) {
    const regex = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`);
    const match = rawText.match(regex);
    if (match && match[1]) {
      extracted[key] = match[1].trim();
    }
  }
  if (extracted.apiKey && extracted.projectId) {
    return extracted;
  }
  return null;
}

function encodeConfigToHash(config) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(config)));
  } catch {
    return '';
  }
}

function decodeConfigFromHash(hashStr) {
  try {
    if (!hashStr) return null;
    const match = hashStr.match(/fb=([A-Za-z0-9+/=]+)/);
    if (!match) return null;
    const json = decodeURIComponent(atob(match[1]));
    const parsed = JSON.parse(json);
    if (parsed && parsed.apiKey && parsed.projectId) return parsed;
  } catch {
    return null;
  }
  return null;
}

export default function App() {
  // Parse room & firebase config from URL on load
  const initialUrlParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = (params.get('room') || 'ECON2026').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const hashCfg = decodeConfigFromHash(window.location.hash);
    let savedCfg = null;
    try {
      const raw = localStorage.getItem('econarena_firebase_cfg');
      if (raw) savedCfg = JSON.parse(raw);
    } catch {}
    return {
      roomCode: roomParam || 'ECON2026',
      firebaseConfig: hashCfg || savedCfg || DEFAULT_FIREBASE_CONFIG,
    };
  }, []);

  const [firebaseConfig, setFirebaseConfig] = useState(initialUrlParams.firebaseConfig);
  const [roomCode, setRoomCode] = useState(initialUrlParams.roomCode);
  const [view, setView] = useState('join'); // 'join' | 'waiting' | 'playing' | 'finished' | 'host'

  // Firebase state
  const [db, setDb] = useState(null);
  const [firebaseError, setFirebaseError] = useState('');
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [firebaseInputText, setFirebaseInputText] = useState('');

  // Room & Players realtime state
  const [roomStatus, setRoomStatus] = useState('waiting'); // 'waiting' | 'active' | 'ended'
  const [players, setPlayers] = useState([]);
  const [customBaseUrl, setCustomBaseUrl] = useState(() => {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    return url.toString();
  });

  // Student local session state
  const [playerId, setPlayerId] = useState(() => {
    let id = sessionStorage.getItem('econarena_pid');
    if (!id) {
      id = 'p_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('econarena_pid', id);
    }
    return id;
  });
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_QUESTIONS[0].timeLimit);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  // Power-ups (1 use each per game)
  const [used5050, setUsed5050] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [freezeRemaining, setFreezeRemaining] = useState(0);

  // Host UI helpers
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrFullscreen, setShowQrFullscreen] = useState(false);

  const timerRef = useRef(null);

  // Initialize Firebase when config exists
  useEffect(() => {
    if (!firebaseConfig) {
      setDb(null);
      return;
    }
    try {
      const appName = `econarena-${firebaseConfig.projectId}`;
      const existing = getApps().find((a) => a.name === appName);
      const app = existing || initializeApp(firebaseConfig, appName);
      const firestore = getFirestore(app);
      setDb(firestore);
      setFirebaseError('');
      try {
        localStorage.setItem('econarena_firebase_cfg', JSON.stringify(firebaseConfig));
      } catch {}
    } catch (err) {
      setFirebaseError(err.message || 'Failed to initialize Firebase');
      setDb(null);
    }
  }, [firebaseConfig]);

  // Construct live Join URL (embeds room code + Firebase config in hash so QR works on any phone!)
  const joinUrl = useMemo(() => {
    try {
      const url = new URL(customBaseUrl || window.location.origin);
      url.searchParams.set('room', roomCode);
      if (firebaseConfig) {
        url.hash = `fb=${encodeConfigToHash(firebaseConfig)}`;
      }
      return url.toString();
    } catch {
      return `${window.location.origin}/?room=${roomCode}`;
    }
  }, [customBaseUrl, roomCode, firebaseConfig]);

  const qrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(
      joinUrl
    )}`;
  }, [joinUrl]);

  // Subscribe to Room status & Players list (Firestore OR Local BroadcastChannel fallback)
  useEffect(() => {
    if (!roomCode) return;

    if (db) {
      const roomDocRef = doc(db, 'quiz_rooms', roomCode);
      const unsubRoom = onSnapshot(
        roomDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setRoomStatus(data.status || 'waiting');
          } else {
            setDoc(roomDocRef, {
              roomCode,
              status: 'waiting',
              createdAt: Date.now(),
            }).catch(() => {});
          }
        },
        (err) => {
          setFirebaseError(`Firestore permission/connection error: ${err.message}`);
        }
      );

      const playersColRef = collection(db, 'quiz_rooms', roomCode, 'players');
      const unsubPlayers = onSnapshot(playersColRef, (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.score || 0) - (a.score || 0) || (a.joinedAt || 0) - (b.joinedAt || 0));
        setPlayers(list);
      });

      return () => {
        unsubRoom();
        unsubPlayers();
      };
    } else {
      // Local fallback mode (works across browser tabs on same device)
      const storageKey = `econarena_local_${roomCode}`;
      const syncFromLocal = () => {
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            setRoomStatus(parsed.status || 'waiting');
            const list = Object.values(parsed.players || {});
            list.sort(
              (a, b) => (b.score || 0) - (a.score || 0) || (a.joinedAt || 0) - (b.joinedAt || 0)
            );
            setPlayers(list);
          } else {
            setRoomStatus('waiting');
            setPlayers([]);
          }
        } catch {}
      };

      syncFromLocal();
      const interval = setInterval(syncFromLocal, 700);
      window.addEventListener('storage', syncFromLocal);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', syncFromLocal);
      };
    }
  }, [db, roomCode]);

  // Automatically transition waiting students into Question 1 when Host clicks START!
  useEffect(() => {
    if (view === 'waiting' && roomStatus === 'active') {
      startLocalQuizRun();
    }
  }, [view, roomStatus]);

  // Sync player record to Firestore or LocalStorage
  const syncPlayerProgress = async (overrideData = {}) => {
    const payload = {
      id: playerId,
      nickname: nickname.trim() || 'Student',
      avatar,
      score,
      correctCount,
      currentQuestion: currentQIndex + 1,
      totalQuestions: QUIZ_QUESTIONS.length,
      streak,
      finished: view === 'finished',
      updatedAt: Date.now(),
      ...overrideData,
    };

    if (db) {
      try {
        await setDoc(doc(db, 'quiz_rooms', roomCode, 'players', playerId), payload, {
          merge: true,
        });
      } catch (e) {
        console.error('Sync player failed:', e);
      }
    } else {
      const storageKey = `econarena_local_${roomCode}`;
      try {
        const raw = localStorage.getItem(storageKey);
        const state = raw ? JSON.parse(raw) : { status: roomStatus, players: {} };
        state.players[playerId] = { ...(state.players[playerId] || {}), ...payload };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {}
    }
  };

  // Student joins the room
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    const initialPayload = {
      id: playerId,
      nickname: nickname.trim(),
      avatar,
      score: 0,
      correctCount: 0,
      currentQuestion: 0,
      totalQuestions: QUIZ_QUESTIONS.length,
      streak: 0,
      finished: false,
      joinedAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (db) {
      await setDoc(doc(db, 'quiz_rooms', roomCode, 'players', playerId), initialPayload, {
        merge: true,
      });
    } else {
      const storageKey = `econarena_local_${roomCode}`;
      const raw = localStorage.getItem(storageKey);
      const state = raw ? JSON.parse(raw) : { status: 'waiting', players: {} };
      state.players[playerId] = initialPayload;
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    if (roomStatus === 'active') {
      startLocalQuizRun();
    } else {
      setView('waiting');
    }
  };

  const startLocalQuizRun = () => {
    setCurrentQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setUsed5050(false);
    setUsedFreeze(false);
    setHiddenOptions([]);
    setFreezeRemaining(0);
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setTimeLeft(QUIZ_QUESTIONS[0].timeLimit);
    setView('playing');
  };

  // Host Controls
  const handleHostStartQuiz = async () => {
    if (db) {
      await setDoc(
        doc(db, 'quiz_rooms', roomCode),
        { status: 'active', startedAt: Date.now() },
        { merge: true }
      );
    } else {
      const storageKey = `econarena_local_${roomCode}`;
      const raw = localStorage.getItem(storageKey);
      const state = raw ? JSON.parse(raw) : { status: 'active', players: {} };
      state.status = 'active';
      localStorage.setItem(storageKey, JSON.stringify(state));
      setRoomStatus('active');
    }
  };

  const handleHostResetRoom = async () => {
    if (db) {
      const playersSnap = await getDocs(collection(db, 'quiz_rooms', roomCode, 'players'));
      const deletes = [];
      playersSnap.forEach((d) => deletes.push(deleteDoc(d.ref)));
      await Promise.all(deletes);
      await setDoc(doc(db, 'quiz_rooms', roomCode), {
        roomCode,
        status: 'waiting',
        createdAt: Date.now(),
      });
    } else {
      const storageKey = `econarena_local_${roomCode}`;
      localStorage.setItem(storageKey, JSON.stringify({ status: 'waiting', players: {} }));
      setRoomStatus('waiting');
      setPlayers([]);
    }
  };

  // Countdown Timer Effect during Gameplay
  useEffect(() => {
    if (view !== 'playing' || isAnswerLocked) return;

    timerRef.current = setInterval(() => {
      if (freezeRemaining > 0) {
        setFreezeRemaining((prev) => Math.max(0, prev - 1));
        return;
      }
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSelectAnswer(null); // Time expired
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [view, currentQIndex, isAnswerLocked, freezeRemaining]);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  // Handle Answer Submission
  const handleSelectAnswer = async (option) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setSelectedOption(option);
    clearInterval(timerRef.current);

    const isCorrect = option === currentQ.correctAnswer;
    let earned = 0;
    let newScore = score;
    let newCorrect = correctCount;
    let newStreak = streak;

    if (isCorrect) {
      const speedRatio = timeLeft / currentQ.timeLimit;
      const speedBonus = Math.round(500 * speedRatio);
      const streakBonus = Math.min(streak * 100, 500);
      earned = 1000 + speedBonus + streakBonus;
      newScore = score + earned;
      newCorrect = correctCount + 1;
      newStreak = streak + 1;
    } else {
      newStreak = 0;
    }

    setLastPointsEarned(earned);
    setScore(newScore);
    setCorrectCount(newCorrect);
    setStreak(newStreak);

    await syncPlayerProgress({
      score: newScore,
      correctCount: newCorrect,
      streak: newStreak,
      currentQuestion: currentQIndex + 1,
      finished: currentQIndex + 1 >= QUIZ_QUESTIONS.length,
    });
  };

  // Advance to Next Question or Finish
  const handleNextQuestion = async () => {
    if (currentQIndex + 1 < QUIZ_QUESTIONS.length) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setTimeLeft(QUIZ_QUESTIONS[nextIdx].timeLimit);
      setSelectedOption(null);
      setIsAnswerLocked(false);
      setHiddenOptions([]);
      setFreezeRemaining(0);
      setLastPointsEarned(0);
    } else {
      setView('finished');
      await syncPlayerProgress({
        currentQuestion: QUIZ_QUESTIONS.length,
        finished: true,
      });
    }
  };

  // Power-Up 1: 50/50
  const activate5050 = () => {
    if (used5050 || isAnswerLocked) return;
    const wrongOptions = currentQ.options.filter((opt) => opt !== currentQ.correctAnswer);
    const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5);
    setHiddenOptions(shuffled.slice(0, 2));
    setUsed5050(true);
  };

  // Power-Up 2: Time Freeze (5 seconds)
  const activateFreeze = () => {
    if (usedFreeze || isAnswerLocked) return;
    setFreezeRemaining(5);
    setUsedFreeze(true);
  };

  // Save Firebase config from modal
  const handleSaveFirebaseConfig = () => {
    const parsed = parseFirebaseConfigInput(firebaseInputText);
    if (!parsed) {
      alert(
        'Invalid Firebase config! Please paste the firebaseConfig object containing apiKey and projectId from your Firebase Console.'
      );
      return;
    }
    setFirebaseConfig(parsed);
    setShowFirebaseModal(false);
    setFirebaseInputText('');
  };

  // Export Leaderboard CSV
  const handleExportResultsCsv = () => {
    const headers = ['Rank', 'Nickname', 'Score', 'Correct Answers', 'Total Questions', 'Accuracy (%)'];
    const rows = players.map((p, idx) => {
      const acc = Math.round(((p.correctCount || 0) / QUIZ_QUESTIONS.length) * 100);
      return [idx + 1, `"${p.nickname}"`, p.score || 0, p.correctCount || 0, QUIZ_QUESTIONS.length, `${acc}%`];
    });
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EconArena_Results_${roomCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const myRank = useMemo(() => {
    const idx = players.findIndex((p) => p.id === playerId);
    return idx >= 0 ? idx + 1 : '-';
  }, [players, playerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col">
      {/* TOP NAVIGATION BAR */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight flex items-center gap-2">
                ECONARENA LIVE
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                  20 QUESTIONS
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Chapter 5: Socialist-Oriented Market Economy in Vietnam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Connection Status Badge */}
            <button
              onClick={() => setShowFirebaseModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                db
                  ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
              }`}
              title="Configure Firebase Realtime Sync"
            >
              {db ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  Cloud Live ({firebaseConfig?.projectId})
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  Local Demo (Connect Firebase)
                </>
              )}
            </button>

            {/* Student View Switch */}
            <button
              onClick={() => setView('join')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                view !== 'host'
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              Student Arena
            </button>

            {/* Host / Teacher Control Switch */}
            <button
              onClick={() => setView('host')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                view === 'host'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Host / Teacher Control
            </button>
          </div>
        </div>
      </header>

      {/* WARNING BANNER IF LOCAL MODE */}
      {!db && (
        <div className="bg-amber-500/15 border-b border-amber-400/30 px-4 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-center gap-2 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Running in <strong>Same-Browser Demo Mode</strong>. To let students scan the QR code from
            their phones, deploy this site online and connect your free Firebase config.
          </span>
          <button
            onClick={() => setShowFirebaseModal(true)}
            className="underline font-bold text-amber-300 hover:text-white"
          >
            Setup Firebase Now →
          </button>
        </div>
      )}

      {firebaseError && (
        <div className="bg-rose-500/20 border-b border-rose-400/40 px-4 py-2 text-xs text-rose-200 text-center">
          {firebaseError}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* ===================================================================== */}
        {/* VIEW 1: HOST / TEACHER CONTROL CENTER                                 */}
        {/* ===================================================================== */}
        {view === 'host' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: QR CODE & ROOM CONTROLS */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    Host Master Panel
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Status:{' '}
                    <strong
                      className={
                        roomStatus === 'active'
                          ? 'text-emerald-400 uppercase'
                          : 'text-amber-300 uppercase'
                      }
                    >
                      {roomStatus}
                    </strong>
                  </span>
                </div>

                {/* Room Code Input */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Classroom Room PIN
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) =>
                      setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                    }
                    className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-2.5 font-black text-xl tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                    placeholder="ECON2026"
                  />
                </div>

                {/* QR Code Display */}
                <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-slate-950 shadow-inner mb-4">
                  <img
                    src={qrImageUrl}
                    alt="Scan to Join Quiz"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                  <p className="mt-2 font-black text-lg tracking-wider text-slate-900">
                    PIN: {roomCode}
                  </p>
                  <p className="text-xs text-slate-500 font-medium text-center">
                    Scan with phone camera to enter nickname & join lobby
                  </p>
                  <button
                    onClick={() => setShowQrFullscreen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Project Fullscreen QR
                  </button>
                </div>

                {/* Editable Public URL */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Public Hosted Domain URL (Auto-updates QR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
                      placeholder="https://your-quiz-domain.vercel.app"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(joinUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* MASTER START / RESET BUTTONS */}
                <div className="space-y-3">
                  {roomStatus !== 'active' ? (
                    <button
                      onClick={handleHostStartQuiz}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-98 animate-pulse-fast"
                    >
                      <Play className="w-6 h-6 fill-slate-950" />
                      START QUIZ FOR ALL PLAYERS ({players.length})
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center">
                      <p className="font-black text-emerald-300 text-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        QUIZ IS LIVE! ALL DEVICES UNLOCKED
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Scores below update automatically as students answer each of the 20 questions.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleHostResetRoom}
                      className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Lobby & Scores
                    </button>
                    <button
                      onClick={handleExportResultsCsv}
                      className="py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV Results
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME LEADERBOARD & LOBBY */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-amber-400" />
                      Real-Time Classroom Leaderboard
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Live rankings update instantaneously after every question submitted
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                    <Users className="w-4 h-4 text-indigo-300" />
                    <span className="font-black text-sm text-white">
                      {players.length} {players.length === 1 ? 'Player' : 'Players'} Connected
                    </span>
                  </div>
                </div>

                {players.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-white/10 rounded-2xl">
                    <QrCode className="w-14 h-14 text-slate-600 mb-3" />
                    <p className="font-bold text-slate-300 text-lg">
                      Waiting for students to scan QR code...
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mt-1">
                      Once students enter their nicknames on their phones, they will appear right
                      here. Click <strong>START QUIZ FOR ALL PLAYERS</strong> when ready!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                    {players.map((p, index) => {
                      const isTop3 = index < 3;
                      const rankColors = [
                        'bg-gradient-to-r from-amber-500/25 to-yellow-500/10 border-amber-400/50',
                        'bg-gradient-to-r from-slate-300/20 to-slate-400/5 border-slate-300/40',
                        'bg-gradient-to-r from-amber-700/25 to-orange-700/10 border-amber-600/40',
                      ];
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isTop3
                              ? rankColors[index]
                              : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                                index === 0
                                  ? 'bg-amber-400 text-slate-950'
                                  : index === 1
                                  ? 'bg-slate-200 text-slate-950'
                                  : index === 2
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              #{index + 1}
                            </div>
                            <span className="text-2xl shrink-0">{p.avatar || '🎓'}</span>
                            <div className="min-w-0">
                              <p className="font-extrabold text-base text-white truncate flex items-center gap-2">
                                {p.nickname}
                                {p.finished && (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    Finished
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                <span>
                                  Progress:{' '}
                                  <strong className="text-slate-200">
                                    Q{p.currentQuestion || 0}/{QUIZ_QUESTIONS.length}
                                  </strong>
                                </span>
                                <span>
                                  Correct:{' '}
                                  <strong className="text-emerald-300">{p.correctCount || 0}</strong>
                                </span>
                                {(p.streak || 0) >= 2 && (
                                  <span className="inline-flex items-center gap-0.5 text-amber-300 font-bold">
                                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                                    {p.streak}x
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <p className="font-black text-xl text-amber-300">
                              {(p.score || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                              points
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: STUDENT JOIN SCREEN                                           */}
        {/* ===================================================================== */}
        {view === 'join' && (
          <div className="max-w-md mx-auto mt-6">
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Join Live Quiz</h2>
                <p className="text-sm text-slate-400 mt-1">
                  20 Questions • Speed Bonus • Power-Ups • Live Leaderboard
                </p>
              </div>

              <form onSubmit={handleJoinRoom} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Room PIN
                  </label>
                  <input
                    type="text"
                    required
                    value={roomCode}
                    onChange={(e) =>
                      setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                    }
                    className="w-full bg-slate-950 border border-white/20 rounded-2xl px-4 py-3 text-center font-black text-2xl tracking-widest text-amber-300 focus:outline-none focus:border-indigo-400"
                    placeholder="ECON2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Choose Your Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-white/10">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`text-2xl py-1.5 rounded-xl transition ${
                          avatar === av
                            ? 'bg-indigo-600 scale-110 shadow-md'
                            : 'hover:bg-white/10 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Nickname / Full Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={24}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-slate-950 border border-white/20 rounded-2xl px-4 py-3.5 text-center font-extrabold text-lg text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Enter your name..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-black text-lg shadow-xl shadow-indigo-500/25 transition transform active:scale-98"
                >
                  ENTER GAME LOBBY →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: STUDENT WAITING ROOM                                          */}
        {/* ===================================================================== */}
        {view === 'waiting' && (
          <div className="max-w-xl mx-auto mt-8 text-center">
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
                {avatar}
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                You're In! Room {roomCode}
              </span>
              <h2 className="text-3xl font-black">{nickname}</h2>
              <p className="text-slate-300 text-sm mt-2">
                Waiting for the Host / Teacher to start the quiz for the whole class...
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Players Ready in Lobby ({players.length})
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {players.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold"
                    >
                      <span>{p.avatar}</span>
                      <span>{p.nickname}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 4: ACTIVE GAMEPLAY (20 QUESTIONS + POWER-UPS + LIVE RANKING)     */}
        {/* ===================================================================== */}
        {view === 'playing' && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* MAIN QUESTION ARENA */}
            <div className="lg:col-span-8 space-y-5">
              {/* Top HUD: Progress, Timer, Score */}
              <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600 font-black text-sm">
                    Question {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase ${
                      currentQ.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : currentQ.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>
                </div>

                {/* Countdown Timer */}
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-black text-xl border ${
                    freezeRemaining > 0
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : timeLeft <= 5
                      ? 'bg-rose-500/25 border-rose-400 text-rose-300 animate-pulse'
                      : 'bg-slate-950 border-white/15 text-white'
                  }`}
                >
                  {freezeRemaining > 0 ? (
                    <>
                      <Snowflake className="w-5 h-5 text-cyan-300 animate-spin" />
                      <span>FROZEN ({freezeRemaining}s)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span>{timeLeft}s</span>
                    </>
                  )}
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-4">
                  {streak >= 2 && (
                    <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      {streak} Streak
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Your Score</p>
                    <p className="font-black text-lg text-amber-300">{score.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Power-Ups Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Power-Ups (1 Use Per Game):
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={activate5050}
                    disabled={used5050 || isAnswerLocked}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition ${
                      used5050
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed line-through'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    50 / 50
                  </button>

                  <button
                    onClick={activateFreeze}
                    disabled={usedFreeze || isAnswerLocked}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition ${
                      usedFreeze
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed line-through'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                    }`}
                  >
                    <Snowflake className="w-4 h-4" />
                    Time Freeze (+5s)
                  </button>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-extrabold leading-snug text-white mb-6">
                  {currentQ.question}
                </h3>

                {/* 4 Answer Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((opt, idx) => {
                    const style = OPTION_STYLES[idx];
                    const isHidden = hiddenOptions.includes(opt);
                    const isCorrect = opt === currentQ.correctAnswer;
                    const isChosen = opt === selectedOption;

                    if (isHidden) {
                      return (
                        <div
                          key={opt}
                          className="h-24 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 flex items-center justify-center text-xs font-bold text-slate-600"
                        >
                          Eliminated by 50/50
                        </div>
                      );
                    }

                    let revealClass = style.bg;
                    if (isAnswerLocked) {
                      if (isCorrect) {
                        revealClass =
                          'bg-emerald-500 border-emerald-200 text-slate-950 ring-4 ring-emerald-400/50 scale-[1.02]';
                      } else if (isChosen) {
                        revealClass = 'bg-rose-700 border-rose-300 opacity-90';
                      } else {
                        revealClass = 'bg-slate-800/70 border-white/10 opacity-45';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={isAnswerLocked}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`min-h-[92px] p-4 rounded-2xl border-b-4 text-left font-extrabold text-base md:text-lg transition-all flex items-center gap-3.5 shadow-lg ${revealClass}`}
                      >
                        <span className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center text-sm font-black shrink-0">
                          {style.shape}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {isAnswerLocked && isCorrect && (
                          <CheckCircle2 className="w-6 h-6 text-slate-950 shrink-0" />
                        )}
                        {isAnswerLocked && isChosen && !isCorrect && (
                          <XCircle className="w-6 h-6 text-white shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Post-Answer Feedback & Explanation */}
                {isAnswerLocked && (
                  <div className="mt-6 pt-5 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      {selectedOption === currentQ.correctAnswer ? (
                        <p className="font-black text-lg text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Correct! +{lastPointsEarned.toLocaleString()} points
                        </p>
                      ) : (
                        <p className="font-black text-lg text-rose-400 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          {selectedOption === null ? "Time's Up!" : 'Incorrect!'}
                        </p>
                      )}
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        <strong>Explanation:</strong> {currentQ.explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center gap-2 shrink-0 shadow-xl transition"
                    >
                      {currentQIndex + 1 < QUIZ_QUESTIONS.length ? (
                        <>
                          Next Question
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Final Podium
                          <Trophy className="w-4 h-4 text-amber-500" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* LIVE MINI LEADERBOARD SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-5 shadow-2xl sticky top-20">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 text-amber-300">
                    <Trophy className="w-4 h-4" />
                    Live Standings
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10">
                    Your Rank: #{myRank}
                  </span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {players.map((p, idx) => {
                    const isMe = p.id === playerId;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs border ${
                          isMe
                            ? 'bg-indigo-600/30 border-indigo-400 font-bold'
                            : 'bg-slate-950/60 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-black text-slate-400 w-5">#{idx + 1}</span>
                          <span className="text-base">{p.avatar}</span>
                          <span className="truncate text-white font-bold">
                            {p.nickname} {isMe && '(You)'}
                          </span>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="font-black text-amber-300">
                            {(p.score || 0).toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Q{p.currentQuestion || 0}/20
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 5: FINAL PODIUM & FULL CLASSROOM LEADERBOARD                     */}
        {/* ===================================================================== */}
        {view === 'finished' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-8 text-center shadow-2xl">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3" />
              <h2 className="text-3xl md:text-4xl font-black">Quiz Completed!</h2>
              <p className="text-slate-300 text-sm mt-1">
                You scored <strong className="text-amber-300">{score.toLocaleString()} pts</strong> (
                {correctCount}/{QUIZ_QUESTIONS.length} correct) • Current Rank:{' '}
                <strong className="text-emerald-300">#{myRank}</strong>
              </p>

              {/* Top 3 Podium */}
              {players.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 items-end">
                  {/* 2nd Place */}
                  {players[1] && (
                    <div className="bg-slate-800/80 border border-slate-300/30 rounded-2xl p-5 order-2 md:order-1">
                      <span className="text-3xl">{players[1].avatar}</span>
                      <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-xs">
                        2ND PLACE
                      </div>
                      <p className="font-black text-lg mt-2 truncate">{players[1].nickname}</p>
                      <p className="font-black text-xl text-slate-200">
                        {(players[1].score || 0).toLocaleString()} pts
                      </p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {players[0] && (
                    <div className="bg-gradient-to-b from-amber-500/30 to-slate-900 border-2 border-amber-400 rounded-2xl p-6 order-1 md:order-2 shadow-xl shadow-amber-500/10">
                      <Crown className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                      <span className="text-4xl">{players[0].avatar}</span>
                      <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                        1ST PLACE CHAMPION
                      </div>
                      <p className="font-black text-xl mt-2 truncate">{players[0].nickname}</p>
                      <p className="font-black text-2xl text-amber-300">
                        {(players[0].score || 0).toLocaleString()} pts
                      </p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {players[2] && (
                    <div className="bg-slate-800/80 border border-amber-600/40 rounded-2xl p-5 order-3">
                      <span className="text-3xl">{players[2].avatar}</span>
                      <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-amber-600 text-white font-black text-xs">
                        3RD PLACE
                      </div>
                      <p className="font-black text-lg mt-2 truncate">{players[2].nickname}</p>
                      <p className="font-black text-xl text-amber-400">
                        {(players[2].score || 0).toLocaleString()} pts
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Full Rankings Table */}
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg">Full Live Leaderboard</h3>
                <button
                  onClick={handleExportResultsCsv}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
              <div className="space-y-2">
                {players.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      p.id === playerId
                        ? 'bg-indigo-600/25 border-indigo-400'
                        : 'bg-slate-950/60 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm w-7 text-slate-400">#{idx + 1}</span>
                      <span className="text-xl">{p.avatar}</span>
                      <div>
                        <p className="font-extrabold text-sm">
                          {p.nickname} {p.id === playerId && '(You)'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {p.correctCount || 0}/{QUIZ_QUESTIONS.length} correct •{' '}
                          {p.finished ? 'Completed' : `On Q${p.currentQuestion || 1}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-lg text-amber-300">
                      {(p.score || 0).toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* FULLSCREEN QR PROJECTOR MODAL FOR CLASSROOM SCREEN                    */}
      {/* ===================================================================== */}
      {showQrFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6">
          <button
            onClick={() => setShowQrFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider mb-4">
            Scan With Your Phone Camera To Join
          </span>
          <div className="bg-white p-6 rounded-3xl shadow-2xl">
            <img src={qrImageUrl} alt="Fullscreen QR" className="w-80 h-80 md:w-96 md:h-96" />
          </div>
          <p className="mt-5 font-black text-3xl md:text-4xl tracking-widest text-amber-300">
            ROOM PIN: {roomCode}
          </p>
          <p className="text-slate-400 text-sm mt-2">
            {players.length} {players.length === 1 ? 'player' : 'players'} currently in lobby
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FIREBASE CONFIGURATION MODAL                                          */}
      {/* ===================================================================== */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Connect Firebase Firestore (Multi-Device Live Sync)
              </h3>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Paste your <strong>firebaseConfig</strong> object from Firebase Console (Project
              Settings → General → Your Apps → Web App). Once saved, the QR code automatically
              embeds your configuration so students connect immediately on their phones!
            </p>
            <textarea
              rows={7}
              value={firebaseInputText}
              onChange={(e) => setFirebaseInputText(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "your-app.firebaseapp.com",\n  projectId: "your-app",\n  storageBucket: "your-app.appspot.com",\n  messagingSenderId: "123456",\n  appId: "1:123456:web:abc"\n};`}
              className="w-full bg-slate-950 border border-white/15 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFirebaseConfig}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
              >
                Save & Connect Cloud Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
