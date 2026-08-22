import { SupportedLanguageCode } from '../data/languages';

export interface ChatSessionState {
  hasCollectedBirthDetails: boolean;
  birthDetails: {
    dob?: string;
    tob?: string;
    pob?: string;
    name?: string;
  };
  pendingQuestion?: string;
  topic?: string;
  preferredLanguage: SupportedLanguageCode;
  conversationHistoryCount?: number;
  lastTopic?: string;
}

/**
 * Parses if the user message contains date/time/place details
 */
export function extractBirthDetails(text: string): { dob?: string; tob?: string; pob?: string; isBirthInfo: boolean } {
  const t = text.trim();

  // Check for dates
  const dateMatch = t.match(/\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}|\d{4})\b/i);

  // Check for time
  const timeMatch = t.match(/\b(\d{1,2}[:.]\d{2}\s*(am|pm)?|\d{1,2}\s*(am|pm)|সকাল\s*\d+|রাত\s*\d+|দুপুর\s*\d+|ভোর\s*\d+)\b/i);

  // Check for places
  const hasPlace = /\b(dhaka|delhi|kolkata|mumbai|chittagong|sylhet|khulna|rajshahi|barisal|cumilla|bogura|pune|bangalore|chennai|hyderabad|ahmedabad|surat|london|new york|india|bangladesh|village|thana|জেলা|ঢাকা|কলকাতা|சென்னை|హైదరాబాద్)\b/i.test(t) ||
    t.split(',').length >= 2;

  const isBirthInfo = Boolean(dateMatch || timeMatch || (hasPlace && /\d/.test(t)));

  return {
    dob: dateMatch ? dateMatch[0] : undefined,
    tob: timeMatch ? timeMatch[0] : undefined,
    pob: hasPlace ? 'Noted' : undefined,
    isBirthInfo
  };
}

export function detectLanguageFromText(text: string, fallback: SupportedLanguageCode = 'hi'): SupportedLanguageCode {
  if (/[\u0980-\u09FF]/.test(text) || /\b(amar|amr|kobe|hobe|biye|bibaho|chakri|taka|pabo|kemon|shob|korbo|bhalo|somporko|bidesh|rog|shastho|bacha|shontaan|babsah|porashona|kichu|bolun|bhai|dada|guruji|acharyaji)\b/i.test(text)) {
    return 'bn';
  }
  if (/[\u0B80-\u0BFF]/.test(text) || /\b(vanakkam|kalyanam|thirumanam|velai|eppothu|nalla|ennaku)\b/i.test(text)) {
    return 'ta';
  }
  if (/[\u0C00-\u0C7F]/.test(text) || /\b(namaskaram|pellli|udyogam|eppudu|naku|ela|untundi)\b/i.test(text)) {
    return 'te';
  }
  if (/[\u0A80-\u0AFF]/.test(text) || /\b(kem|cho|lagn|nokri|kare|thase|maro)\b/i.test(text)) {
    return 'gu';
  }
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(ahe|kadhi|hoil|lagna|nokri|maza|kasa)\b/i.test(text)) return 'mr';
    return 'hi';
  }
  if (/\b(mera|meri|kab|hoga|shadi|vivah|naukri|paise|kaisa|rahega|batao|bataiye|punditji)\b/i.test(text)) {
    return 'hi';
  }
  return fallback;
}

/**
 * Main Humanized Vedic Astrology Consultation Engine
 */
export function processHumanAstrologerChat(
  userMessage: string,
  stateOrName?: any,
  astrologerNameOrState?: any,
  isTarot: boolean = false
): { reply: string; replyText: string; updatedState: ChatSessionState; updatedSessionState: ChatSessionState } {
  const text = (userMessage || '').trim();

  // Normalize parameters
  let state: ChatSessionState = {
    hasCollectedBirthDetails: false,
    birthDetails: {},
    preferredLanguage: 'hi',
    conversationHistoryCount: 0
  };
  let astrologerName = 'महर्षि आर्यभट्ट';

  if (stateOrName && typeof stateOrName === 'object') {
    state = { ...state, ...stateOrName };
    if (typeof astrologerNameOrState === 'string') {
      astrologerName = astrologerNameOrState;
    }
  } else if (typeof stateOrName === 'string') {
    astrologerName = stateOrName;
    if (astrologerNameOrState && typeof astrologerNameOrState === 'object') {
      state = { ...state, ...astrologerNameOrState };
    }
  }

  const lang: SupportedLanguageCode = state.preferredLanguage || detectLanguageFromText(text, 'bn');
  const historyCount = (state.conversationHistoryCount || 0) + 1;

  // Extract any birth details if present
  const extracted = extractBirthDetails(text);
  const newState: ChatSessionState = { 
    ...state, 
    preferredLanguage: lang,
    conversationHistoryCount: historyCount,
    hasCollectedBirthDetails: state.hasCollectedBirthDetails || extracted.isBirthInfo
  };

  if (extracted.isBirthInfo) {
    newState.birthDetails = {
      ...newState.birthDetails,
      dob: extracted.dob || newState.birthDetails.dob,
      tob: extracted.tob || newState.birthDetails.tob,
      pob: extracted.pob || newState.birthDetails.pob
    };
  }

  // Detect detailed human topic
  const topic = detectDeepTopic(text) || state.lastTopic || 'general';
  newState.lastTopic = topic;

  // Generate genuinely humanized, conversational reading
  const responseText = generateHumanVedicConsultation(topic, text, lang, astrologerName, historyCount, newState.hasCollectedBirthDetails);

  return {
    reply: responseText,
    replyText: responseText,
    updatedState: newState,
    updatedSessionState: newState
  };
}

/**
 * Deep Topic Classifier
 */
function detectDeepTopic(query: string): string {
  const q = query.toLowerCase();

  // 1. Casual greetings & intro
  if (/^(hi|hello|hey|namaste|nomoshkar|kemon|kemon acho|ki obostha|apni ke|who are you|shunchen|sunchen)$/i.test(q.trim())) {
    return 'greeting';
  }

  // 2. Love, Ex-partner, Relationship, Breakup
  if (q.includes('breakup') || q.includes('patchup') || q.includes('phire ashbe') || q.includes('prem') || q.includes('love') || q.includes('valobashe') || q.includes('bhalobashe') || q.includes('সম্পর্ক') || q.includes('ভালোবাসে') || q.includes('gf') || q.includes('bf') || q.includes('crush')) {
    return 'love_relation';
  }

  // 3. Marriage, Wedding Timing, Life Partner, Kundli Milan
  if (q.includes('biye') || q.includes('marriage') || q.includes('shadi') || q.includes('vivah') || q.includes('বিয়ে') || q.includes('বিবাহ') || q.includes('বিয়ে') || q.includes('bou') || q.includes('shami') || q.includes('husband') || q.includes('wife') || q.includes('patro') || q.includes('patri')) {
    return 'marriage';
  }

  // 4. Govt Job, BCS, UPSC, Competitive Exams
  if (q.includes('govt job') || q.includes('bcs') || q.includes('sarkari') || q.includes('সরকারি চাকরি') || q.includes('upsc') || q.includes('wbcs') || q.includes('bank job') || q.includes('police') || q.includes('primary') || q.includes('exam') || q.includes('porikkha')) {
    return 'govt_job';
  }

  // 5. General Career, Promotion, Job Switch, Workplace
  if (q.includes('chakri') || q.includes('job') || q.includes('career') || q.includes('naukri') || q.includes('promotion') || q.includes('salary') || q.includes('boss') || q.includes('চাকরি') || q.includes('কর্ম')) {
    return 'career';
  }

  // 6. Business, Startup, Profit, Trade, Dukaan
  if (q.includes('business') || q.includes('babsha') || q.includes('byabsha') || q.includes('ব্যবসা') || q.includes('startup') || q.includes('trade') || q.includes('dukan') || q.includes('দোকান') || q.includes('invest') || q.includes('share market')) {
    return 'business';
  }

  // 7. Money, Wealth, Debt, Loans, Financial Crisis
  if (q.includes('taka') || q.includes('money') || q.includes('wealth') || q.includes('loan') || q.includes('debt') || q.includes('rin') || q.includes('ধার') || q.includes('টাকা') || q.includes('অর্থ') || q.includes('poisha') || q.includes('khoroch') || q.includes('dhan')) {
    return 'finance';
  }

  // 8. Foreign Travel, Student Visa, PR, Abroad
  if (q.includes('bidesh') || q.includes('foreign') || q.includes('visa') || q.includes('abroad') || q.includes('canada') || q.includes('usa') || q.includes('uk') || q.includes('australia') || q.includes('study abroad') || q.includes('বিদেশ') || q.includes('ভিসা')) {
    return 'foreign';
  }

  // 9. Childbirth, Pregnancy, Santana Yoga
  if (q.includes('baccha') || q.includes('bacha') || q.includes('baby') || q.includes('child') || q.includes('shontan') || q.includes('shontaan') || q.includes('সন্তান') || q.includes('গর্ভ') || q.includes('pregnancy')) {
    return 'childbirth';
  }

  // 10. Health, Illness, Mental Peace, Depression
  if (q.includes('shastho') || q.includes('health') || q.includes('rog') || q.includes('osukh') || q.includes('bimar') || q.includes('tension') || q.includes('chinta') || q.includes('depression') || q.includes('স্বাস্থ্য') || q.includes('অসুখ') || q.includes('মানসিক')) {
    return 'health';
  }

  // 11. Shani Sade Sati, Manglik, Kaal Sarp, Doshas
  if (q.includes('shani') || q.includes('sade sati') || q.includes('sadesati') || q.includes('manglik') || q.includes('mangal') || q.includes('kaal sarp') || q.includes('কাল সর্প') || q.includes('মাঙ্গলিক') || q.includes('শনি') || q.includes('দোষ')) {
    return 'doshas';
  }

  // 12. Gemstones, Rudraksha, Lucky Colors
  if (q.includes('gemstone') || q.includes('stone') || q.includes('rotn') || q.includes('ratna') || q.includes('rudraksha') || q.includes('রত্ন') || q.includes('রুদ্রাক্ষ') || q.includes(' আংটি') || q.includes('পাথর')) {
    return 'gemstones';
  }

  return 'general';
}

/**
 * Truly Natural, Humanized Conversational Astrologer Generator
 */
function generateHumanVedicConsultation(
  topic: string,
  userQuery: string,
  lang: SupportedLanguageCode,
  astrologerName: string,
  turnCount: number,
  hasBirthDetails: boolean
): string {
  // Conversational openings (Varied & Empathetic)
  const bengaliOpenings = [
    `নমস্কার, আপনার প্রশ্নটি আমি অত্যন্ত মনোযোগ সহকারে দেখলাম।`,
    `হ্যাঁ, আপনার মনের ব্যাকুলতা ও এই বিষয়ে জানার আগ্রহ আমি বুঝতে পারছি।`,
    `খুবই গুরুত্বপূর্ণ একটি বিষয় নিয়ে আপনি জানতে চেয়েছেন। গ্রহের অবস্থান লক্ষ্য করে যা দেখা যাচ্ছে—`,
    `আপনার এই প্রশ্নের উত্তরে জ্যোতিষ শাস্ত্রীয় গ্রহচক্র ও বর্তমান গোচর পর্যালোচনা করে বলছি—`,
    `শান্ত হোন, জীবনের এমন সময়ে সঠিক দিকনির্দেশনা পাওয়া খুবই প্রয়োজন।`
  ];

  const opening = bengaliOpenings[turnCount % bengaliOpenings.length];

  // Specific Deep Topics
  if (topic === 'greeting') {
    if (lang === 'bn') {
      return `নমস্কার! 🙏 আমি ${astrologerName}। আপনি ভালো আছেন তো?\n\nআপনার জীবন, বিবাহ, চাকরি, ক্যারিয়ার, আর্থিক স্থিতি বা প্রেম সংক্রান্ত যেকোনো বিষয় নিয়ে দ্বিধাহীনভাবে কথা বলতে পারেন। আজ আপনার মনে কোন বিষয়টি নিয়ে সবচেয়ে বেশি চিন্তা চলছে বলুন?`;
    } else if (lang === 'hi') {
      return `नमस्ते! 🙏 मैं ${astrologerName}। आप कैसे हैं?\n\nआप अपने जीवन, विवाह, करियर, नौकरी, धन या पारिवारिक स्थिति से जुड़ा कोई भी सवाल पूछ सकते हैं। बताइए आज आपके मन में क्या चल रहा है?`;
    } else {
      return `Namaste! 🙏 I am ${astrologerName}. How are you doing today?\n\nPlease feel free to discuss anything about your career, marriage, relationships, finance, or future roadmap. What is on your mind today?`;
    }
  }

  if (topic === 'love_relation') {
    if (lang === 'bn') {
      return `${opening}\n\nপ্রেম ও সম্পর্কের ক্ষেত্রে জন্মকুণ্ডলীর **৫ম ভাব (প্রেম-রোমান্স)** ও **শুক্র-চন্দ্রের সংযোগ** প্রধান ভূমিকা পালন করে।\n\nবর্তমান গ্রহ গোচরে রাহু বা কেতুর সূক্ষ্ম প্রভাবে আপনাদের মধ্যে সাময়িক ভুল বোঝাবুঝি বা দূরত্বের সৃষ্টি হয়েছে। তবে আশার কথা হলো—\n\n• **সম্পর্কের মোড় ঘোরার সময়**: আগামী **৪৫ থেকে ৬০ দিনের মধ্যে** সঙ্গীর মনোভাবে ইতিবাচক পরিবর্তন ও পুনরায় ঘনিষ্ঠ যোগাযোগ তৈরি হওয়ার জোরালো সম্ভাবনা রয়েছে।\n• **ভালোবাসার ভিত্তি**: সম্পর্কটিতে আন্তরিক টান রয়েছে, শুধু অহংকার বা তৃতীয় কোনো ব্যক্তির কথার প্রভাব এড়িয়ে চলা জরুরি।\n\n🌿 **বৈদিক প্রতিকার**:\n১. প্রতি সোমবার শিবলিঙ্গে সামান্য কাঁচা দুধ ও জল অর্পণ করে *"ওঁ নমঃ শিবায়"* জপ করুন।\n২. শুক্রবার সামান্য সাদা মিষ্টি বা মিছরি দরিদ্র কাউকে দান করুন।\n\nআপনার সঙ্গীর নাম বা জন্মতারিখ জানা থাকলে আরও সূক্ষ্ম মিলন বিচার করে দিতে পারি।`;
    } else if (lang === 'hi') {
      return `${opening}\n\nप्रेम संबंधों में कुंडली का **पंचम भाव** और **शुक्र देव** की स्थिति सबसे महत्वपूर्ण होती है।\n\nवर्तमान गोचर के अनुसार राहु-केतु के प्रभाव से कुछ गलतफहमियां या संवादहीनता बनी हुई है।\n\n• **समय**: अगले **४५ से ६० दिनों में** स्थिति में सकारात्मक सुधार और बातचीत शुरू होने के प्रबल योग हैं।\n• **सलाह**: आपसी अहंकार को बीच में न आने दें।\n\n🌿 **उपाय**: सोमवार को शिवलिंग पर जल और कच्चा दूध अर्पित करें तथा शुक्रवार को सफेद वस्तुओं का दान करें।`;
    } else {
      return `${opening}\n\nIn relationship matters, the **5th House of Romance** and the placement of **Venus & Moon** govern emotional bonding.\n\nPlanetary transits indicate a temporary phase of miscommunication influenced by Rahu's aspect. However:\n\n• **Reconciliation Window**: A strong positive breakthrough is visible within the next **45 to 60 days**.\n• **Relationship Core**: The emotional bond is genuine; patience and honest communication will dissolve external misunderstandings.\n\n🌿 **Remedies**: Offer water and raw milk to Lord Shiva on Mondays and practice forgiveness.`;
    }
  }

  if (topic === 'marriage') {
    if (lang === 'bn') {
      return `${opening}\n\nবিবাহ ও দাম্পত্য সুখের ক্ষেত্রে কুণ্ডলীর **৭ম ভাব (দাম্পত্য ক্ষেত্র)** এবং দেবগুরু **বৃহস্পতি ও শুক্রের** কৃপা সবচেয়ে তাৎপর্যপূর্ণ।\n\nআপনার গ্রহের অবস্থান বিশ্লেষণ করে যা স্পষ্ট দেখতে পাচ্ছি:\n\n• **শুভ বিবাহের সময়কাল**: আপনার জন্মকুণ্ডলীতে বৃহস্পতির শুভ গোচরে আগামী **৮ থেকে ১৪ মাসের মধ্যে (২০২৬-এর শেষ থেকে ২০২৭-এর প্রথমার্ধ)** সানাই বাজার ও শুভ সম্বন্ধ পাকা হওয়ার অত্যন্ত জোরালো যোগ তৈরি হয়েছে।\n• **জীবনসঙ্গীর বৈশিষ্ট্য**: আপনার জীবনসঙ্গী হবেন সুশিক্ষিত, ধৈর্যশীল, রুচিশীল এবং পারিবারিক মূল্যবোধসম্পন্ন ব্যক্তিত্ব। কর্মক্ষেত্রে তিনি কোনো প্রতিষ্ঠিত পেশা বা ব্যবসার সাথে যুক্ত থাকবেন।\n• **প্রেম না পারিবারিক**: আপনার ক্ষেত্রে পারিবারিকভাবে সমর্থিত বা পরিচিত মহলের মাধ্যমেই বিয়ের সম্বন্ধ চূড়ান্ত হওয়ার যোগ বেশি।\n\n🌿 **বৈদিক প্রতিকার**:\n১. প্রতি বৃহস্পতিবার শ্রী বিষ্ণুর উদ্দেশ্যে হলুদ ফুল ও এক চিমটি হলুদ গুঁড়ো জলে মিশিয়ে স্নান করুন।\n২. *"ওঁ বৃহস্পতয়ে নমঃ"* মন্ত্রটি প্রতিদিন ১০৮ বার পাঠ করলে শুভ সম্বন্ধ দ্রুত চলে আসে।`;
    } else if (lang === 'hi') {
      return `${opening}\n\nविवाह के मामले में कुंडली का **सप्तम भाव** तथा **देवगुरु बृहस्पति और शुक्र** की दृष्टि सबसे प्रमुख होती है।\n\n• **विवाह का समय**: आने वाले **८ से १४ महीनों के भीतर** शुभ विवाह का पक्का योग बन रहा है।\n• **जीवनसाथी**: आपका जीवनसाथी संस्कारी, शिक्षित और सहयोगी स्वभाव का होगा।\n• **उपाय**: गुरुवार को केले के वृक्ष में जल दें और हल्दी का तिलक लगाएं। ॐ नमो भगवते वासुदेवाय का नित्य जप करें।`;
    } else {
      return `${opening}\n\nMarriage and matrimonial harmony are governed by the **7th House** and the divine blessings of **Jupiter and Venus**.\n\n• **Marriage Timing**: A very powerful matrimonial transit window is opening in the next **8 to 14 months**.\n• **Spouse Traits**: Your future life partner will be cultured, supportive, and emotionally grounded with good familial backing.\n• **Remedy**: Worship Lord Vishnu on Thursdays and chant the Brihaspati mantra for swift alignment.`;
    }
  }

  if (topic === 'govt_job') {
    if (lang === 'bn') {
      return `${opening}\n\nসরকারি চাকরি, প্রশাসনিক পদ (BCS / WBCS / UPSC / Banking) এবং উচ্চ সামাজিক সম্মানের কারক গ্রহ হলেন **সূর্যদেব** এবং কর্মস্থানের **১০ম ভাব**।\n\nগ্রহসমাহার পর্যালোচনা করে যা দেখা যাচ্ছে:\n\n• **সফলতার সময়কাল**: আপনার কুণ্ডলীতে ১০ম ভাবে রবি ও মঙ্গলের ইতিবাচক প্রভাবে আগামী **৬ থেকে ১০ মাসের মধ্যে** অনুষ্ঠিত যেকোনো প্রতিযোগিতামূলক পরীক্ষায় অভূতপূর্ব ফলাফল ও চূড়ান্ত তালিকায় নাম আসার প্রবল যোগ রয়েছে।\n• **সতর্কতা**: অলসতা বা শেষ মুহূর্তের আত্মতুষ্টি পরিহার করতে হবে। আপনার মেধা যথেষ্ট, কেবল ধারাবাহিকতা রক্ষা করতে হবে।\n\n🌿 **সূর্যদেবের আশীর্বাদ পাওয়ার উপায়**:\n১. প্রতিদিন সকালে একটি তামার পাত্রে জল, সামান্য লাল চন্দন ও লাল ফুল নিয়ে উদিত সূর্যকে অর্ঘ্য দিন এবং *"ওঁ ঘৃণিঃ সূর্যায় নমঃ"* পাঠ করুন।\n২. পিতা ও গুরুজনদের সম্মান ও আশীর্বাদ গ্রহণ করুন।`;
    } else {
      return `${opening}\n\nGovernment service, competitive exams (BCS / UPSC / SSC / Banking), and administrative authority are ruled by the **Sun** and the **10th House (Karma Bhava)**.\n\n• **Success Timeline**: A golden planetary phase for competitive examinations is active over the next **6 to 10 months**.\n• **Key Strategy**: Consistency in revision is vital. Avoid mental distractions.\n\n🌿 **Remedies**: Offer Arghya (water) to the rising Sun daily from a copper vessel with the Aditya Hridayam Stotram.`;
    }
  }

  if (topic === 'career') {
    if (lang === 'bn') {
      return `${opening}\n\nকর্মজীবন ও পেশাগত অগ্রগতির ক্ষেত্রে **১০ম ভাব (দশম ভাব)** এবং **দশা লর্ড** অত্যন্ত গুরুত্বপূর্ণ।\n\n• **পদোন্নতি ও ইনক্রিমেন্ট**: বর্তমান গ্রহের সঞ্চার অনুসারে আগামী **৩ থেকে ৬ মাসের মধ্যে** আপনার বর্তমান কর্মক্ষেত্রে ভালো পদোন্নতি (Promotion), প্রজেক্ট লিড বা আকর্ষণীয় প্যাকেজে নতুন জব অফার পাওয়ার শুভ যোগ রয়েছে।\n• **অফিস পলিটিক্স**: সহকর্মীদের সাথে অপ্রয়োজনীয় তর্কে জড়াবেন না, নিজের কাজ দিয়ে জবাব দিন।\n\n🌿 **পেশাগত উন্নতির প্রতিকার**:\n১. কর্মক্ষেত্রে বের হওয়ার আগে মুখে একটু মিষ্টি বা তুলসী পাতা দিয়ে বের হবেন।\n২. শনিবার দরিদ্র কাউকে অন্ন বা সরিষার তেল দান করলে কর্মক্ষেত্রের সমস্ত বাধা কেটে যায়।`;
    } else {
      return `${opening}\n\nProfessional growth and promotions are driven by your **10th House Lord** and D10 Dashamsha chart.\n\n• **Career Breakthrough**: A significant career advancement or favorable job switch is indicated within the next **3 to 6 months**.\n• **Remedy**: Feed birds or street animals on Saturdays and maintain ethical integrity at the workplace.`;
    }
  }

  if (topic === 'business') {
    if (lang === 'bn') {
      return `${opening}\n\nব্যবসা, বাণিজ্য ও স্বাধীন উদ্যোগের প্রধান চালিকাশক্তি হলো **বুধদেব (বুদ্ধি ও ট্রেডিং)** এবং **৭ম ও ১১শ ভাব (লাভ স্থান)**।\n\n• **ব্যবসার সম্ভাবনা**: চাকরি থেকে ব্যবসা করার ইচ্ছা আপনার মধ্যে প্রবল। বর্তমান সময়টি নতুন স্টার্টআপ বা স্বাধীন ব্যবসা শুরু করার জন্য অনুকুল।\n• **লাভজনক ক্ষেত্র**: তথ্যপ্রযুক্তি, ফুড/রেস্টুরেন্ট, কনসালটেন্সি, ই-কমার্স বা সাপ্লাই চেন ব্যবসায় আপনি অসাধারণ সাফল্য পেতে পারেন।\n• **অংশীদারি (Partnership)**: পার্টনারশিপে কোনো কাজ করলে সমস্ত চুক্তিপত্র স্পষ্টভাবে লিখিত রাখবেন।\n\n🌿 **শ্রী লক্ষ্মী-কুবের প্রতিকার**:\nঘরে বা ব্যবসা প্রতিষ্ঠানে একটি 'শ্রীযন্ত্র' স্থাপন করুন এবং শুক্রবার ঘিয়ের প্রদীপ প্রজ্জ্বলন করুন।`;
    } else {
      return `${opening}\n\nBusiness acumen and trade are steered by **Mercury (Budha)** and the **11th House of Gains**.\n\n• **Entrepreneurial Outlook**: Your chart shows strong independent trading capabilities.\n• **Key Sectors**: Tech, retail, consultancy, and digital services are highly auspicious.\n• **Remedy**: Place a Shree Yantra at your workspace and chant Kanakadhara Stotram on Fridays.`;
    }
  }

  if (topic === 'finance') {
    if (lang === 'bn') {
      return `${opening}\n\nআর্থিক সমৃদ্ধি, সঞ্চয় ও ঋণমুক্তির ক্ষেত্রে কুণ্ডলীর **২য় ভাব (ধন ভাব)** এবং **১১শ ভাব (আয় ভাব)** নির্দেশক।\n\n• **ধনলাভের শুভ সময়**: আগামী কয়েক মাসে আপনার আয়ের একাধিক নতুন উৎস (Multiple Income Streams) তৈরি হওয়ার সম্ভাবনা রয়েছে। পুরানো কোনো আটকে থাকা টাকা বা বকেয়া ফেরত পাওয়ার যোগ আসছে।\n• **ঋণমুক্তি**: আগামী ৬-৮ মাসের মধ্যে পরিকল্পিতভাবে ঋণের বোঝা উল্লেখযোগ্যভাবে লাঘব করতে পারবেন।\n\n🌿 **ধন যোগ জাগ্রত করার উপায়**:\n১. ঘরের উত্তর-পূর্ব দিক সবসময় পরিষ্কার ও আলোকিত রাখুন।\n২. শুক্রবার মা লক্ষ্মীর চরণে ক্ষীর বা মিষ্টান্ন ভোগ নিবেদন করুন।`;
    } else {
      return `${opening}\n\nFinancial stability and wealth accumulation are governed by the **2nd (Dhana)** and **11th (Labha)** houses.\n\n• **Financial Recovery**: New avenues of cash flow and clearance of old dues will materialize over the coming **4 to 8 months**.\n• **Remedy**: Keep your cash locker in the North direction and practice charitable giving on Fridays.`;
    }
  }

  if (topic === 'foreign') {
    if (lang === 'bn') {
      return `${opening}\n\nবিদেশ যাত্রা, ভিসা, উচ্চশিক্ষা ও প্রবাসে বসবাসের কারক হলো **৯ম ভাব (ভাগ্য ও দূরপাল্লার ভ্রমণ)**, **১২শ ভাব (বিদেশ স্থান)** এবং **রাহু-বৃহস্পতির সংযোগ**।\n\n• **ভিসা ও যাত্রা যোগ**: আপনার কুণ্ডলীতে বিদেশ গমনের অত্যন্ত সুস্পষ্ট যোগ বিদ্যমান। আগামী **৫ থেকে ৯ মাসের মধ্যে** ভিসা অনুমোদন বা বিদেশযাত্রার কাগজপত্রে সবুজ সংকেত পাওয়ার দারুণ সম্ভাবনা রয়েছে।\n\n🌿 **প্রতিকার**: নিয়মিত পাখিদের শস্যদানা ও জল খেতে দিন। এটি বিদেশ সংক্রান্ত সমস্ত কাগজপত্র দ্রুত প্রস্তুত হতে সাহায্য করে।`;
    } else {
      return `${opening}\n\nForeign relocation and visa approval are governed by the **9th & 12th houses** along with Rahu's transit.\n\n• **Visa Timeline**: High probability of visa sanction and foreign movement within **5 to 9 months**.\n• **Remedy**: Feed birds and chant the Rahu Beej Mantra on Wednesday evenings.`;
    }
  }

  if (topic === 'doshas') {
    if (lang === 'bn') {
      return `${opening}\n\nশনিদেবের সাড়ে সাতি বা মাঙ্গলিক দোষকে ভয় পাওয়ার কোনো কারণ নেই। শনিদেব হলেন ন্যায়ের প্রতীক—তিনি ধৈর্য ও আত্মশুদ্ধির শিক্ষা দেন।\n\n• **বর্তমান পরিস্থিতি**: আপনার গ্রহদশার প্রভাবে মানসিক চাপ বা কাজে সামান্য বিলম্ব হতে পারে, তবে কোনো স্থায়ী ক্ষতি হবে না।\n\n🌿 **সহজ ও খাঁটি বৈদিক প্রতিকার**:\n১. প্রতি শনিবার অশ্বত্থ (পিপল) গাছের গোড়ায় সর্ষের তেলের প্রদীপ জ্বালান।\n২. কালো কুকুর বা কোনো অভাবী মানুষকে শনিবার রুটি বা খাবার দিন।\n৩. হনুমান চালিসা বা মহামৃত্যুঞ্জয় মন্ত্র প্রতিদিন পাঠ করুন—সমস্ত অমঙ্গল দূর হয়ে যাবে।`;
    } else {
      return `${opening}\n\nSaturn's transit (Sade Sati) and Mangal aspects are meant for spiritual discipline, not fear.\n\n🌿 **Vedic Remedies**:\n1. Light a mustard oil lamp under a Peepal tree on Saturday evenings.\n2. Recite the Hanuman Chalisa daily.\n3. Feed black dogs or birds on Saturdays for peace and protection.`;
    }
  }

  if (topic === 'gemstones') {
    if (lang === 'bn') {
      return `${opening}\n\nরত্নধারণের মূল উদ্দেশ্য হলো কুণ্ডলীর শুভ কারক গ্রহকে অতিরিক্ত তেজ ও শক্তি প্রদান করা।\n\n• **মূল রত্ন সুপারিশ**: আপনার ভাগ্য ও জ্ঞানের জন্য **পোখরাজ (হলুদ রত্ন)** অথবা বুদ্ধিমত্তা ও ব্যবসার উন্নতির জন্য **পান্না (Emerald)** অত্যন্ত ফলপ্রসূ হতে পারে।\n• **রুদ্রাক্ষ**: আধ্যাত্মিক শান্তি ও সার্বিক নিরাপত্তার জন্য একটি **৫-মুখী পঞ্চমুখী রুদ্রাক্ষ** ধারণ করা সর্বশ্রেষ্ঠ ও নিরাপদ।\n\n🌿 **সতর্কতা**: কোনো খাঁটি রত্ন ধারণ করার আগে উপযুক্ত তিথিতে শোধন ও প্রাণপ্রতিষ্ঠা করিয়ে নেওয়া বাঞ্ছনীয়।`;
    } else {
      return `${opening}\n\nGemstones amplify the benefic energies of your chart's yogakaraka planets.\n\n• **Recommended**: **Yellow Sapphire** for luck and expansion, or **Emerald** for intellect and business.\n• **Rudraksha**: A 5-Mukhi Nepali Rudraksha is universally auspicious for mental tranquility and vitality.`;
    }
  }

  // General Fallback
  if (lang === 'bn') {
    return `${opening}\n\nআপনার কুণ্ডলীতে বর্তমানে শুভ গ্রহের গোচর ধীরে ধীরে অনুকূল হচ্ছে। কোনো বিষয়ে অতিরিক্ত হতাশা বা দুঃশ্চিন্তা করবেন না।\n\nআপনার যদি কোনো সুনির্দিষ্ট বিষয় (যেমন: বিয়ের সুনির্দিষ্ট মাস, চাকরির অফার, কোনো নির্দিষ্ট ব্যক্তির সাথে ভবিষ্যৎ) নিয়ে জানার থাকে, তবে স্পষ্টভাবে লিখে জানান—আমি বিস্তারিত গণনা করে জানিয়ে দিচ্ছি! 🙏✨`;
  } else if (lang === 'hi') {
    return `${opening}\n\nआपकी कुंडली में ग्रहों की स्थिति धीरे-धीरे अनुकूल हो रही है। किसी भी बात को लेकर अत्यधिक तनाव न लें।\n\nयदि आपके मन में कोई विशेष प्रश्न है, तो कृपया बताएं—मैं शास्त्रीय गणना के साथ आपको पूरा मार्गदर्शन दूंगा। 🙏✨`;
  } else {
    return `${opening}\n\nYour planetary transits are progressively aligning in your favor. Maintain disciplined focus and trust divine timing.\n\nIf you have any specific query regarding marriage timing, career path, or relationship clarity, feel free to ask! 🙏✨`;
  }
}
