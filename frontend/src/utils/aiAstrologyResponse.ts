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

export function detectLanguageFromText(text: string, fallback: SupportedLanguageCode = 'bn'): SupportedLanguageCode {
  if (/[\u0980-\u09FF]/.test(text) || /\b(amar|amr|kobe|hobe|biye|bibaho|chakri|taka|pabo|kemon|shob|korbo|bhalo|somporko|bidesh|rog|shastho|bacha|shontaan|babsah|porashona)\b/i.test(text)) {
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
  if (/\b(mera|meri|kab|hoga|shadi|vivah|naukri|paise|kaisa|rahega|batao|bataiye)\b/i.test(text)) {
    return 'hi';
  }
  return fallback;
}

export function processHumanAstrologerChat(
  userMessage: string,
  state: ChatSessionState,
  astrologerName: string = 'পণ্ডিত মহারাজ',
  isTarot: boolean = false
): { reply: string; updatedState: ChatSessionState } {
  const text = userMessage.trim();
  const lang: SupportedLanguageCode = state.preferredLanguage || detectLanguageFromText(text, 'bn');

  const historyCount = (state.conversationHistoryCount || 0) + 1;
  const newState: ChatSessionState = { 
    ...state, 
    preferredLanguage: lang,
    conversationHistoryCount: historyCount
  };

  // 1. Check if user is giving birth details
  const extracted = extractBirthDetails(text);
  if (extracted.isBirthInfo || (!state.hasCollectedBirthDetails && (text.length > 5 && /\d/.test(text)))) {
    newState.hasCollectedBirthDetails = true;
    newState.birthDetails = {
      ...newState.birthDetails,
      dob: extracted.dob || newState.birthDetails.dob || '15/05/1998',
      tob: extracted.tob || newState.birthDetails.tob || '02:30 PM',
      pob: extracted.pob || newState.birthDetails.pob || 'Noted City'
    };

    const topic = newState.topic || detectTopic(text) || 'marriage';
    return {
      reply: getBirthDetailsAcknowledgedMessage(lang, astrologerName) + "\n\n" + getTopicSpecificReading(topic, lang, text, astrologerName),
      updatedState: newState
    };
  }

  // 2. If birth details NOT yet collected, politely request them
  if (!state.hasCollectedBirthDetails) {
    const topic = detectTopic(text);
    if (topic) newState.topic = topic;
    newState.pendingQuestion = text;

    return {
      reply: getAskBirthDetailsPrompt(lang, text),
      updatedState: newState
    };
  }

  // 3. User has already given birth details -> Give deep, context-specific tailored astrological analysis!
  const topic = detectTopic(text) || newState.topic || 'general';
  return {
    reply: getTopicSpecificReading(topic, lang, text, astrologerName),
    updatedState: newState
  };
}

function detectTopic(query: string): string {
  const q = query.toLowerCase();

  // Marriage / Love / Relationship
  if (q.includes('biye') || q.includes('marriage') || q.includes('shadi') || q.includes('kalyanam') || q.includes('pelli') || q.includes('lagn') || q.includes('বিয়ে') || q.includes('বিবাহ') || q.includes('বিয়ে')) {
    return 'marriage';
  }
  if (q.includes('love') || q.includes('prem') || q.includes('সম্পর্ক') || q.includes('পছন্দ') || q.includes('relationship') || q.includes('gf') || q.includes('bf') || q.includes('breakup') || q.includes('patchup') || q.includes('phire ashbe')) {
    return 'love_relation';
  }

  // Career / Job / Govt Job / Promotion
  if (q.includes('govt job') || q.includes('bcs') || q.includes('sarkari') || q.includes('সরকারি চাকরি') || q.includes('exam') || q.includes('porikkha')) {
    return 'govt_job';
  }
  if (q.includes('chakri') || q.includes('job') || q.includes('career') || q.includes('naukri') || q.includes('velai') || q.includes('udyogam') || q.includes('nokri') || q.includes('চাকরি') || q.includes('কর্ম')) {
    return 'career';
  }

  // Business / Startup / Trade
  if (q.includes('business') || q.includes('babsha') || q.includes('byabsha') || q.includes('ব্যবসা') || q.includes('vyapar') || q.includes('trade') || q.includes('dukan') || q.includes('দোকান')) {
    return 'business';
  }

  // Wealth / Money / Property / Stock Market
  if (q.includes('taka') || q.includes('money') || q.includes('dhan') || q.includes('paisa') || q.includes('panam') || q.includes('dabbu') || q.includes('টাকা') || q.includes('অর্থ') || q.includes('সম্পত্তি') || q.includes('share') || q.includes('crypto') || q.includes('lottery') || q.includes('লটারি')) {
    return 'finance_wealth';
  }

  // Foreign Travel / Visa / Settlement
  if (q.includes('bidesh') || q.includes('foreign') || q.includes('visa') || q.includes('canada') || q.includes('usa') || q.includes('uk') || q.includes('travel') || q.includes('বিদেশ') || q.includes('ভিসা')) {
    return 'foreign_travel';
  }

  // Childbirth / Progeny / Family
  if (q.includes('bacha') || q.includes('child') || q.includes('shontaan') || q.includes('baby') || q.includes('সন্তান') || q.includes('গর্ভ') || q.includes('progeny')) {
    return 'childbirth';
  }

  // Health / Disease / Mental Stress
  if (q.includes('health') || q.includes('rog') || q.includes('shastho') || q.includes('bimari') || q.includes('chinta') || q.includes('depression') || q.includes('স্বাস্থ্য') || q.includes('রোগ') || q.includes('অসুখ') || q.includes('মানসিক')) {
    return 'health';
  }

  // Doshas: Shani Sade Sati, Manglik, Kaal Sarp
  if (q.includes('shani') || q.includes('sade sati') || q.includes('সাড়ে সাতি') || q.includes('মঙ্গলী') || q.includes('manglik') || q.includes('kaal sarp') || q.includes('কাল সর্প') || q.includes('দোষ') || q.includes('dosha') || q.includes('rahu') || q.includes('ketu')) {
    return 'dosha_remedy';
  }

  // Gemstones & Rudraksha
  if (q.includes('gemstone') || q.includes('stone') || q.includes('ratna') || q.includes('রক্ত প্রবাল') || q.includes('পোখরাজ') || q.includes('পান্না') || q.includes('নীলা') || q.includes('রুদ্রাক্ষ') || q.includes('rudraksha') || q.includes('আংটি')) {
    return 'gemstones';
  }

  return 'general';
}

function getAskBirthDetailsPrompt(lang: SupportedLanguageCode, question: string): string {
  switch (lang) {
    case 'bn':
      return `নমস্কার! 🙏 আপনার প্রশ্নটি (${question}) আমি গভীর মনোযোগ দিয়ে শুনেছি।
      
বৈদিক জ্যোতিষশাস্ত্রের পরাশর সিদ্ধান্ত ও লগ্ন কুণ্ডলী নির্ভুলভাবে বিচার করে সুনির্দিষ্ট দিনক্ষণ ও প্রতিকার জানাতে আপনার **সঠিক জন্ম বিবরণ** প্রয়োজন:
📌 **১. জন্ম তারিখ (Date of Birth)**
📌 **২. জন্ম সময় (Time of Birth - যেমন: দুপুর ২:৩০ বা সকাল ৮টা)**
📌 **৩. জন্ম স্থান (City / জেলা)**

দয়া করে এই ৩টি তথ্য লিখে পাঠান, আমি এক মিনিটের মধ্যে আপনার জন্মছক কষে বিস্তারিত উত্তর দিচ্ছি! 🌟`;

    case 'hi':
      return `नमस्ते! 🙏 आपके प्रश्न का पूर्ण वैदिक समाधान निकालने के लिए आपकी जन्म कुंडली का अध्ययन आवश्यक है।
      
कृपया अपना सही जन्म विवरण साझा करें:
📌 **१. जन्म तिथि (DOB)**
📌 **२. जन्म समय (Time of Birth - जैसे दोपहर 2:30)**
📌 **३. जन्म स्थान (Birth City / जिला)**

यह विवरण भेजते ही मैं आपकी कुंडली का सूक्ष्म परीक्षण करके सटीक समय व उपाय बताऊंगा। 🌟`;

    case 'ta':
      return `வணக்கம்! 🙏 உங்கள் கேள்விக்கு துல்லியமான ஜோதிட விடை பெற உங்கள் பிறப்பு விவரங்களை பகிரவும்:
📌 **1. பிறந்த தேதி (Date of Birth)**
📌 **2. பிறந்த நேரம் (Time of Birth)**
📌 **3. பிறந்த இடம் (City / District)**`;

    case 'te':
      return `నమస్కారం! 🙏 మీ జాతక చక్రాన్ని కచ్చితంగా గణించడానికి మీ జనన వివరాలు పంపండి:
📌 **1. పుట్టిన తేదీ (DOB)**
📌 **2. పుట్టిన సమయం (Time of Birth)**
📌 **3. పుట్టిన ఊరు (City / Place)**`;

    case 'en':
    default:
      return `Namaste! 🙏 I have noted your question: "${question}".

To calculate your exact Lagna, planetary Dasha, and provide a 100% accurate timeframe, please share your **birth details**:
📌 **1. Date of Birth (DD-MM-YYYY)**
📌 **2. Time of Birth (e.g. 2:30 PM)**
📌 **3. Place of Birth (City / Country)**

I will analyze your planetary chart immediately upon receiving these details! 🌟`;
  }
}

function getBirthDetailsAcknowledgedMessage(lang: SupportedLanguageCode, name: string): string {
  switch (lang) {
    case 'bn':
      return `ধন্যবাদ! আপনার জন্ম বিবরণ লিপিবদ্ধ করা হয়েছে। 🙏\nআমি আপনার লগ্ন (D1), নবাংশ (D9), দশাংশ (D10) এবং বর্তমান বিংশোত্তরী মহাদশাচক্র বিচার করে বিশ্লেষণ করছি...`;
    case 'hi':
      return `धन्यवाद! आपका जन्म विवरण प्राप्त हुआ। 🙏\nमैं आपकी लग्न कुंडली (D1), नवमांश (D9), और विंशोत्तरी दशा का सूक्ष्म अध्ययन कर रहा हूँ...`;
    case 'ta':
      return `நன்றி! உங்கள் பிறந்த விவரங்கள் பெறப்பட்டன. நான் உங்கள் லக்னம் மற்றும் தசா-புக்தி அமைப்பை கணிக்கிறேன்... 🙏`;
    case 'te':
      return `ధన్యవాదాలు! మీ జనన వివరాలు నమోదయ్యాయి. మీ లగ్నం మరియు దశా చక్రాన్ని విశ్లేషిస్తున్నాను... 🙏`;
    case 'en':
    default:
      return `Thank you! Your birth details have been recorded. 🙏\nI am now casting your D1 Lagna, D9 Navamsha, and current Mahadasha timeline...`;
  }
}

function getTopicSpecificReading(topic: string, lang: SupportedLanguageCode, userText: string, astrologerName: string): string {
  const isBengali = lang === 'bn';
  const isHindi = lang === 'hi';

  // 1. Marriage
  if (topic === 'marriage') {
    if (isBengali) {
      return `💍 **বিবাহের সময় ও জীবনসঙ্গী বিচার (৭ম ভাব ও শুক্র বিশ্লেষণ):**
• **কবে বিয়ে হবে**: আপনার ৭ম ভাব (বিবাহ স্থান) ও বৃহস্পতির বর্তমান ট্রানজিট দেখে বোঝা যাচ্ছে আগামী **৮ থেকে ১৪ মাসের মধ্যে (বিশেষ করে নভেম্বর থেকে মে মাসের শুভ লগ্নে)** বিয়ের সবচেয়ে মজবুত যোগ তৈরি হয়েছে।
• **কেমন জীবনসঙ্গী পাবেন**: আপনার জীবনসঙ্গী হবে সংবেদনশীল, পারিবারিক মূল্যবোধসম্পন্ন এবং দায়িত্বশীল স্বভাবের। তার দিক থেকে সংসারে আর্থিক ও মানসিক সৌভাগ্য আসবে।
• **পারিবারিক নাকি পছন্দের বিয়ে**: আপনার শুক্র ও চন্দ্রের অবস্থান অনুসারে **পারিবারিক সম্মতিতেই পছন্দের মানুষের সাথে বিয়ে (Love-cum-Arranged)** হওয়ার যোগ ৮০% উজ্জ্বল।

🌟 **বিবাহে বাধা কাটাতে বৈদিক প্রতিকার (Remedies):**
১. প্রতি বৃহস্পতিবার স্নানের জলে সামান্য খাঁটি হলুদ মিশিয়ে স্নান করুন এবং বিষ্ণু সহস্রনাম শ্রবণ করুন।
২. শুক্রবার মা লক্ষ্মীকে ঘিয়ের প্রদীপ ও সাদা মিষ্টি নিবেদন করুন।`;
    }
    if (isHindi) {
      return `💍 **विवाह योग एवं जीवनसाथी विश्लेषण (सप्तम भाव):**
• **विवाह का समय**: आगामी **८ से १४ महीनों में** गुरु के गोचर से प्रबल विवाह योग बन रहा है।
• **जीवनसाथी का स्वभाव**: जीवनसाथी संस्कारी, समझदार और आर्थिक रूप से सहयोगी होगा।
• **उपाय**: गुरुवार को पीले वस्त्र पहनें और शुक्रवार को महालक्ष्मी को सफेद मिष्ठान्न अर्पित करें।`;
    }
    return `💍 **Marriage Timing & Spouse Prediction (7th House Analysis):**
• **Timeline**: Favorable Jupiter aspect opens an auspicious marriage window within the next **8 to 14 months**.
• **Spouse Traits**: Your partner will be loving, well-grounded, and bring financial stability to the household.
• **Remedy**: Wear yellow on Thursdays and offer white sweets to Goddess Lakshmi on Fridays.`;
  }

  // 2. Love & Relationships
  if (topic === 'love_relation') {
    if (isBengali) {
      return `💖 **প্রেম, রোমান্স ও সম্পর্ক বিশ্লেষণ (৫ম ভাব ও শুক্র বিচার):**
• **সম্পর্কের বর্তমান পরিস্থিতি**: আপনার ৫ম ভাবের অধিপতির ওপর কিছুটা রাহু বা পাপগ্রহের ছায়া থাকায় মাঝে মাঝে ভুল বোঝাবুঝি বা দূরত্বের সৃষ্টি হচ্ছে।
• **প্রেম কি টিকবে / মনের মানুষ কি ফিরে আসবে**: আগামী **৪৫ থেকে ৬০ দিনের মধ্যে** চন্দ্র ও শুক্রের অনুকূল গোচরের ফলে সম্পর্কের তিক্ততা দূর হয়ে পুনরায় সুসম্পর্ক ও ঘনিষ্ঠতা ফিরে আসার উজ্জ্বল সম্ভাবনা রয়েছে।
• **উপদেশ**: কোনো প্রকার রাগ বা সন্দেহের বশে হঠকারী সিদ্ধান্ত নেবেন না; শান্তভাবে আলোচনার পথ বেছে নিন।

🌟 **সম্পর্ক মধুর করার সহজ উপায়:**
১. প্রতি সোমবার শিবলিঙ্গে কাঁচা দুধ ও জল অর্পণ করে 'ওম নমঃ শিবায়' ১০৮ বার জপ করুন।
২. আপনার বেডরুমে একটি রোজ কোয়ার্টজ (Rose Quartz) পাথর বা স্ফটিক রাখুন।`;
    }
    return `💖 **Love & Relationship Harmony Analysis (5th House):**
• **Current Situation**: Minor misunderstandings due to temporary transit afflictions will clear within 45 to 60 days.
• **Future Outlook**: Venus alignment restores mutual intimacy and deep emotional reconciliation.
• **Remedy**: Chant 'Om Namah Shivaya' on Mondays and keep a Rose Quartz crystal in your room.`;
  }

  // 3. Govt Job / Competitive Exams
  if (topic === 'govt_job') {
    if (isBengali) {
      return `🏛️ **সরকারি চাকরি ও প্রতিযোগিতামূলক পরীক্ষা যোগ (১০ম ও সূর্য বিচার):**
• **সরকারি চাকরির যোগ**: আপনার জন্মছকে রবি (সূর্য) এবং বৃহস্পতি দেবের অবস্থান শক্তিশালী, যা প্রশাসনিক ক্ষমতা ও সরকারি স্বীকৃতির অনুকূল।
• **কবে সাফল্যের সম্ভাবনা**: আগামী **৬ থেকে ৯ মাসের মধ্যে** আপনি যে পরীক্ষা বা ইন্টারভিউ দেবেন, তাতে শীর্ষস্থান বা সিলেক্ট হওয়ার অতি শুভ যোগ দেখা যাচ্ছে।
• **কোন ক্ষেত্রে উন্নতি**: প্রশাসন, ব্যাংকিং, রেলওয়ে, শিক্ষকতা বা সরকারি পাবলিক সেক্টরে আপনার অগ্রগতি নিশ্চিত।

🌟 **সূর্যদেবের কৃপা লাভের বিশেষ প্রতিকার:**
১. প্রতিদিন ভোরে ঘুম থেকে উঠে একটি তামার পাত্রে সামান্য লাল চন্দন, গুড় ও জল মিশিয়ে উদীয়মান সূর্যকে অর্ঘ্য দিন।
২. রবিবার আমিষ খাবার এড়িয়ে চলুন এবং পিতা বা গুরুজনদের চরণ স্পর্শ করে আশীর্বাদ নিন।`;
    }
    return `🏛️ **Government Job & Competitive Exam Analysis (10th House & Sun):**
• **Prospects**: Strong Sun-Jupiter alignment shows a high probability of securing a prestigious government or public sector post within 6 to 9 months.
• **Remedy**: Offer water (Arghya) in a copper vessel to the rising Sun every morning while chanting the Surya Gayatri Mantra.`;
  }

  // 4. Career & General Job
  if (topic === 'career') {
    if (isBengali) {
      return `💼 **চাকরি, প্রমোশন ও কর্মক্ষেত্র বিশ্লেষণ (১০ম ও দশাংশ D10 বিচার):**
• **চাকরিতে প্রমোশন / পরিবর্তন**: আপনার বর্তমান দশা ও বুধের অবস্থান অনুযায়ী আগামী **৩ থেকে ৬ মাসের মধ্যে (বিশেষ করে ৩-৪ মাসের মধ্যে)** একটি বড় ইনক্রিমেন্ট, পদোন্নতি বা কাঙ্ক্ষিত কোম্পানিতে চাকরি পরিবর্তনের নিশ্চিত সুযোগ আসবে।
• **অফিস পলিটিক্স থেকে মুক্তি**: কর্মক্ষেত্রে যারা আপনার বিরুদ্ধে চক্রান্ত করছিল, তাদের প্রভাব দ্রুত বিনষ্ট হবে এবং উর্ধ্বতন কর্মকর্তারা আপনার কাজের ভূয়সী প্রশংসা করবেন।

🌟 **কর্মোন্নতির বৈদিক প্রতিকার:**
১. প্রতি শনিবার অশ্বত্থ গাছের গোড়ায় সর্ষের তেলের প্রদীপ জ্বালান।
২. প্রতিদিন কর্মস্থলে যাওয়ার আগে কপালে সামান্য চন্দনের তিলক লাগান।`;
    }
    return `💼 **Career & Promotion Outlook (10th House & D10 Dashamsha):**
• **Timeline**: Breakthrough job promotion or lucrative new offer arriving within **3 to 6 months**.
• **Remedy**: Light a mustard oil lamp under a Peepal tree on Saturday evenings for career stability.`;
  }

  // 5. Business & Trade
  if (topic === 'business') {
    if (isBengali) {
      return `🏢 **ব্যবসা নাকি চাকরি / নতুন ব্যবসার সম্ভাবনা (৭ম ও ১১শ ভাব বিচার):**
• **আপনার জন্য কোনটি সেরা**: আপনার জন্মছকে বুধ ও শুক্রের অবস্থান দেখে স্পষ্ট বোঝা যায় যে স্বাধীন ব্যবসা বা ট্রেডিংয়ে আপনি প্রভূত সাফল্য অর্জন করবেন।
• **নতুন ব্যবসা শুরুর শুভ সময়**: নতুন পার্টনারশিপ বা ইনভেস্টমেন্টের জন্য আগামী **অক্টোবর থেকে ফেব্রুয়ারি মাস** সবচেয়ে লাভজনক।
• **লাভের ক্ষেত্র**: আমদানি-রপ্তানি, আইটি/টেক, কনসালটেন্সি, বস্ত্র বা খাদ্যদ্রব্য সংক্রান্ত ব্যবসায় বহুগুণ মুনাফা হবে।

🌟 **ব্যবসার লক্ষ্মী বৃদ্ধির প্রতিকার:**
১. আপনার ক্যাশবাক্স বা লকারে একটি সিদ্ধ শ্রীযন্ত্র (Shree Yantra) স্থাপন করুন।
২. প্রতি বুধবার সকালে পাখিদের বা গরুকে সবুজ ঘাস/শাক খাওয়ান।`;
    }
    return `🏢 **Business & Entrepreneurship Forecast:**
• **Verdict**: Independent business and trade will yield high prosperity for you.
• **Auspicious Timing**: Launching new ventures between October and February will multiply returns.
• **Remedy**: Keep a consecrated Shree Yantra in your safe and feed green grass to cows on Wednesdays.`;
  }

  // 6. Wealth & Finance
  if (topic === 'finance_wealth') {
    if (isBengali) {
      return `💰 **আর্থিক স্থিতি, ধনযোগ ও ঋণমুক্তি বিচার (২য় ও ১১শ ভাব):**
• **ধনপ্রাপ্তির সময়**: আপনার জন্মছকে 'ধনযোগ' ও 'লক্ষ্মী যোগ' বিদ্যমান। আগামী **৪ থেকে ৮ মাসের মধ্যে** আটকে থাকা পাওনা টাকা উদ্ধার হবে এবং আয়ের একাধিক নতুন উৎস তৈরি হবে।
• **শেয়ার মার্কেট / বিনিয়োগ**: দীর্ঘমেয়াদী ইনভেস্টমেন্টে লাভ হবে; তবে কোনো প্রকার ফটকা বা অনভিজ্ঞ জুয়ায় ঝুঁকি নেবেন না।

🌟 **ধন বৃদ্ধির সিদ্ধ প্রতিকার:**
১. প্রতি শুক্রবার সন্ধ্যায় ঘরে কর্পূরের ধোঁয়া দিন এবং কনকধারা স্তোত্র পাঠ করুন।
২. একটি রুপার কয়েন বা রুপার টুকরো আপনার ওয়ালেটে সবসময় সাথে রাখুন।`;
    }
    return `💰 **Wealth & Financial Prosperity Forecast (2nd & 11th Houses):**
• **Outlook**: Strong Dhana Yogas indicate cash recovery and multi-stream earnings opening in 4 to 8 months.
• **Remedy**: Recite Kanakadhara Stotram on Fridays and carry a small pure silver piece in your wallet.`;
  }

  // 7. Foreign Travel & Visa
  if (topic === 'foreign_travel') {
    if (isBengali) {
      return `✈️ **বিদেশ যাত্রা, ভিসা ও স্থায়ী বসবাসের যোগ (৯ম ও ১২শ ভাব বিচার):**
• **ভিসা ও বিদেশ গমন**: আপনার জন্মছকের ১২শ ভাব (বিদেশ স্থান) এবং রাহুর অনুকূল অবস্থানের কারণে আপনার **বিদেশে উচ্চশিক্ষা, চাকরি বা স্থায়ীভাবে সেটেল হওয়ার (PR) অত্যন্ত প্রবল যোগ** রয়েছে।
• **শুভ সময়**: আগামী **৫ থেকে ১০ মাসের মধ্যে** আপনার ভিসা মঞ্জুর বা বিদেশযাত্রার টিকিট কনফার্ম হওয়ার সুবর্ণ সময়।

🌟 **বিদেশযাত্রার বাধা দূর করার প্রতিকার:**
১. হনুমান চালিসা প্রতিদিন পাঠ করুন এবং লাল রঙের মিষ্টি বিতরণ করুন।
২. জলে সামান্য কাঁচা দুধ ঢেলে বুধবার প্রবাহিত করুন।`;
    }
    return `✈️ **Foreign Settlement & Visa Opportunities (9th & 12th Houses):**
• **Prospects**: Strong 12th house alignment guarantees foreign education, job visa, or PR approval within **5 to 10 months**.
• **Remedy**: Chant Hanuman Chalisa daily and offer jaggery-sweets on Tuesdays.`;
  }

  // 8. Childbirth & Family
  if (topic === 'childbirth') {
    if (isBengali) {
      return `👶 **সন্তান ভাগ্য ও গর্ভধারণ যোগ (৫ম ভাব ও সপ্তাংশ D7 বিচার):**
• **সন্তান যোগ**: আপনার ৫ম ভাব (সন্তান স্থান) এবং দেবগুরু বৃহস্পতির দৃষ্টি শুভ। চিকিৎসকের পরামর্শের পাশাপাশি শাস্ত্রীয় মতে আগামী **৯ থেকে ১৫ মাসের মধ্যে** ঘরে নতুন অতিথি ও সন্তান সুখের অত্যন্ত মঙ্গলময় যোগ রয়েছে।
• **সন্তানের স্বাস্থ্য ও মেধা**: আপনার সন্তান হবে অত্যন্ত মেধাবী ও পরিবারে সৌভাগ্য আনয়নকারী।

🌟 **সন্তান প্রাপ্তির মহৌষধ প্রতিকার:**
১. বাড়িতে গোপাল মূর্তি স্থাপন করে তাকে মাখন ও মিছরি ভোগ দিন।
২. প্রতি বৃহস্পতিবার সন্তান গোপাল মন্ত্র পাঠ করুন: 'ওম ক্লীং দেবকীসুত গোবিন্দ বাসুদেব জগৎপতে'।`;
    }
    return `👶 **Childbirth & Family Expansion (5th House & D7 Saptamsha):**
• **Timeline**: Auspicious Jupiter transit opens a blessed pregnancy and progeny window in **9 to 15 months**.
• **Remedy**: Chant Santana Gopala Mantra on Thursdays and offer butter-mishri to Lord Krishna.`;
  }

  // 9. Health & Wellness
  if (topic === 'health') {
    if (isBengali) {
      return `🩺 **স্বাস্থ্য, রোগমুক্তি ও দীর্ঘায়ু বিচার (৬ষ্ঠ ও ৮ম ভাব):**
• **বর্তমান শারীরিক অবস্থা**: শনির ট্রানজিটের কারণে শরীর কিছুটা দুর্বল বা ক্লান্তি লাগতে পারে, বিশেষ করে পেটের সমস্যা, কোমর/হাঁটুর ব্যথা বা অনিদ্রার লক্ষণ দেখা দিতে পারে।
• **সুস্থতার সময়**: সঠিক খাদ্যাভ্যাস ও যোগাসনের মাধ্যমে আগামী **১-২ মাসের মধ্যে** রোগ ব্যাধি থেকে পূর্ণ মুক্তি মিলবে এবং জীবনীশক্তি ফিরে পাবেন।

🌟 **স্বাস্থ্য রক্ষার মহৌষধ প্রতিকার:**
১. প্রতিদিন সকালে স্নানের পর মহামৃত্যুঞ্জয় মন্ত্র ১১ বার জপ করুন।
২. তামার পাত্রে সারারাত রাখা জল সকালে খালি পেটে পান করুন।`;
    }
    return `🩺 **Health & Vitality Forecast (6th & 8th Houses):**
• **Guidance**: Minor fatigue or digestive sluggishness will vanish within 30-60 days with clean diet and gentle pranayama.
• **Remedy**: Recite the Mahamrityunjaya Mantra 11 times every morning.`;
  }

  // 10. Shani Sade Sati & Doshas
  if (topic === 'dosha_remedy') {
    if (isBengali) {
      return `🪐 **শনি সাড়ে সাতি, মাঙ্গলিক ও কাল সর্প দোষ নিবারণ:**
• **দোষের স্বরূপ**: গ্রহের বর্তমান অবস্থানের কারণে জীবনে হঠাৎ বাধা, বিলম্ব বা মানসিক চাপের সৃষ্টি হয়। তবে শাস্ত্র বলে—সঠিক উপায়ে গ্রহের শান্তি করলে এই দোষই মহা রাজযোগে রূপান্তরিত হয়।
• **শুভ ফল কবে থেকে**: নিয়মিত প্রতিকার পালন করলে আগামী **৩ মাসের মধ্যে** সমস্ত স্থবির কাজ দ্রুতগতিতে সম্পন্ন হতে শুরু করবে।

🌟 **দোষ কাটার সিদ্ধ প্রতিকার:**
১. প্রতি শনিবার সন্ধ্যায় একটি কাঁচা মাটির প্রদীপে সর্ষের তেল দিয়ে শনিদেবের উদ্দেশ্যে একটি লোহার পেরেক দান করুন।
২. অনাথ বা দুস্থ ব্যক্তিদের কালো কম্বল, ছাতা বা জুতো দান করুন।`;
    }
    return `🪐 **Shani Sade Sati & Planetary Dosha Remedies:**
• **Relief Timeline**: Active remedies will dismantle obstacles within 90 days, turning delays into solid success.
• **Remedy**: Donate black sesame seeds, umbrella, or footwear to the needy on Saturdays.`;
  }

  // 11. Gemstones & Lucky Charms
  if (topic === 'gemstones') {
    if (isBengali) {
      return `💎 **আপনার জন্য সবচেয়ে শুভ রত্ন ও রুদ্রাক্ষের সুপারিশ:**
• **ভাগ্যোন্নতির রত্ন**: আপনার লগ্ন ও রাশির শুভ গ্রহ অনুযায়ী **হলুদ পোখরাজ (Yellow Sapphire)** অথবা **খাঁটি পান্না (Emerald)** ধারণ করলে মেধা, অর্থ ও বাকপটুতা বহুগুণ বৃদ্ধি পাবে।
• **রুদ্রাক্ষ**: মানসিক শান্তি ও সর্ববিঘ্ন নাশের জন্য একটি **৫-মুখী বা ৭-মুখী পঞ্চমুখী রুদ্রাক্ষের মালা** ধারণ করা শ্রেষ্ঠ ফলদায়ক।
• **ধারণের নিয়ম**: শুক্লপক্ষের শুভ তিথিতে গঙ্গাজল ও কাঁচা দুধে শুদ্ধ করে সোনার বা রুপার আংটিতে অনামিকা বা তর্জনী আঙুলে পরবেন।`;
    }
    return `💎 **Personalized Lucky Gemstones & Rudraksha:**
• **Recommended**: Natural Yellow Sapphire (Pukhraj) or Green Emerald for wisdom and wealth expansion.
• **Rudraksha**: 5-Mukhi or 7-Mukhi Nepali Rudraksha for spiritual tranquility and focus.`;
  }

  // General Fallback
  if (isBengali) {
    return `✨ **আপনার সামগ্রিক গ্রহাবস্থান ও ভাগ্য বিচার:**
আপনার কুণ্ডলীতে গ্রহদের স্থানান্তর অত্যন্ত ইতিবাচক দিশায় এগোচ্ছে। আপনি যে সৎ ইচ্ছা বা লক্ষ্যের পেছনে ছুটছেন, তাতে ধৈর্য সহকারে লেগে থাকুন। ঈশ্বর ও গ্রহের কৃপায় শীঘ্রই কাঙ্ক্ষিত ফলাফল পাবেন। আপনার আরও কোনো নির্দিষ্ট বিষয় জানার থাকলে নির্দ্বিধায় প্রশ্ন করুন! 🙏`;
  }
  return `✨ **General Astrological Reading:**
Your planetary transits are steadily aligning in your favor. Maintain disciplined focus and trust your hard work. Divine blessings are supporting your journey. Feel free to ask any specific question! 🙏`;
}
