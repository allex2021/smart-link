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
  topic?: 'marriage' | 'career' | 'finance' | 'health' | 'general';
  preferredLanguage: SupportedLanguageCode;
}

/**
 * Parses if the user message contains date/time/place details
 */
export function extractBirthDetails(text: string): { dob?: string; tob?: string; pob?: string; isBirthInfo: boolean } {
  const t = text.trim();

  // Check for dates (e.g., 15/05/1998, 15-05-1998, 1998, 15 May, etc.)
  const dateMatch = t.match(/\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}|\d{4})\b/i);

  // Check for time (e.g., 2:30 pm, 14:30, 2.30, সকাল ৮টা, রাত ৯টা)
  const timeMatch = t.match(/\b(\d{1,2}[:.]\d{2}\s*(am|pm)?|\d{1,2}\s*(am|pm)|সকাল\s*\d+|রাত\s*\d+|দুপুর\s*\d+)\b/i);

  // Check for common place names or keywords
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

export function detectLanguageFromText(text: string, fallback: SupportedLanguageCode = 'en'): SupportedLanguageCode {
  if (/[\u0980-\u09FF]/.test(text) || /\b(amar|amr|kobe|hobe|biye|bibaho|chakri|taka|pabo|kemon|shob|korbo|bhalo|somporko|bidesh)\b/i.test(text)) {
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
  if (/\b(mera|meri|kab|hoga|shadi|vivah|naukri|paise|kaisa|rahega)\b/i.test(text)) {
    return 'hi';
  }
  return fallback;
}

export function processHumanAstrologerChat(
  userMessage: string,
  state: ChatSessionState,
  astrologerName: string,
  isTarot: boolean = false
): { reply: string; updatedState: ChatSessionState } {
  const text = userMessage.trim();

  // If user selected explicit language, honor it; otherwise auto-detect
  const lang: SupportedLanguageCode = state.preferredLanguage || detectLanguageFromText(text, 'bn');

  const newState = { ...state, preferredLanguage: lang };

  // Step A: If user is giving birth details
  const extracted = extractBirthDetails(text);
  if (extracted.isBirthInfo || (!state.hasCollectedBirthDetails && (text.length > 5 && /\d/.test(text)))) {
    newState.hasCollectedBirthDetails = true;
    newState.birthDetails = {
      ...newState.birthDetails,
      dob: extracted.dob || newState.birthDetails.dob || '15/05/1998',
      tob: extracted.tob || newState.birthDetails.tob || '02:30 PM',
      pob: extracted.pob || newState.birthDetails.pob || 'City'
    };

    const topic = newState.topic || detectTopic(text) || 'marriage';

    return {
      reply: getBirthDetailsAcknowledgedMessage(lang, astrologerName) + "\n\n" + getDetailedAstrologicalReading(topic, lang, astrologerName),
      updatedState: newState
    };
  }

  // Step B: If birth details NOT yet collected, ask for them in the selected language
  if (!state.hasCollectedBirthDetails) {
    const topic = detectTopic(text);
    if (topic) newState.topic = topic;
    newState.pendingQuestion = text;

    return {
      reply: getAskBirthDetailsPrompt(lang),
      updatedState: newState
    };
  }

  // Step C: Follow-up response
  const currentTopic = detectTopic(text) || newState.topic || 'general';
  return {
    reply: getFollowUpReading(text, currentTopic, lang, astrologerName),
    updatedState: newState
  };
}

function detectTopic(query: string): 'marriage' | 'career' | 'finance' | 'health' | 'general' {
  const q = query.toLowerCase();
  if (q.includes('biye') || q.includes('marriage') || q.includes('shadi') || q.includes('kalyanam') || q.includes('pelli') || q.includes('lagn') || q.includes('love') || q.includes('prem') || q.includes('বিয়ে') || q.includes('திருமணம்') || q.includes('వివాహం')) {
    return 'marriage';
  }
  if (q.includes('chakri') || q.includes('job') || q.includes('career') || q.includes('naukri') || q.includes('velai') || q.includes('udyogam') || q.includes('nokri') || q.includes('চাকরি') || q.includes('வேலை') || q.includes('ఉద్యోగం')) {
    return 'career';
  }
  if (q.includes('taka') || q.includes('money') || q.includes('dhan') || q.includes('paisa') || q.includes('panam') || q.includes('dabbu') || q.includes('টাকা') || q.includes('பணம்') || q.includes('డబ్బు')) {
    return 'finance';
  }
  if (q.includes('shani') || q.includes('sade') || q.includes('dosha') || q.includes('health') || q.includes('shastho') || q.includes('aarogyam')) {
    return 'health';
  }
  return 'general';
}

function getAskBirthDetailsPrompt(lang: SupportedLanguageCode): string {
  switch (lang) {
    case 'bn':
      return `নমস্কার! 🙏 আপনার প্রশ্নটি আমি বুঝতে পেরেছি।

বৈদিক জ্যোতিষশাস্ত্রে লগ্ন, ভাব ও গ্রহের দশা নির্ভুলভাবে বিচার করতে আপনার **সঠিক জন্ম বিবরণ** প্রয়োজন:
📌 **১. জন্ম তারিখ (Date of Birth)**
📌 **২. জন্ম সময় (Time of Birth - যেমন: দুপুর ২:৩০)**
📌 **৩. জন্ম স্থান (City / District)**

দয়া করে এই তিনটি তথ্য জানান, আমি আপনার জন্মছক কষে বিস্তারিত জানিয়ে দিচ্ছি।`;

    case 'hi':
      return `नमस्ते! 🙏 आपके प्रश्न का सटीक ज्योतिषीय समाधान देने के लिए आपकी जन्म कुंडली का विश्लेषण आवश्यक है।

कृपया अपना जन्म विवरण साझा करें:
📌 **१. जन्म तिथि (DOB)**
📌 **२. जन्म समय (Time of Birth - जैसे दोपहर 2:30)**
📌 **३. जन्म स्थान (Birth City)**

यह विवरण मिलते ही मैं आपकी कुंडली देखकर विस्तार से मार्गदर्शन करूंगा।`;

    case 'ta':
      return `வணக்கம்! 🙏 உங்கள் கேள்விக்கு துல்லியமான ஜோதிட பலன்களை கணிக்க, உங்கள் **பிறப்பு விவரங்கள்** தேவை:
📌 **1. பிறந்த தேதி (Date of Birth)**
📌 **2. பிறந்த நேரம் (Time of Birth - எ.கா. மதியம் 2:30)**
📌 **3. பிறந்த இடம் (City / District)**

இந்த 3 தகவல்களை தெரியப்படுத்துங்கள், உங்கள் ஜாதகத்தை கணித்து உடனே விடை தருகிறேன்.`;

    case 'te':
      return `నమస్కారం! 🙏 మీ ప్రశ్నకు సరైన జ్యోతిష్య పరిష్కారం ఇవ్వడానికి మీ **జనన వివరాలు** అవసరం:
📌 **1. పుట్టిన తేదీ (Date of Birth)**
📌 **2. పుట్టిన సమయం (Time of Birth - ఉదా. మధ్యాహ్నం 2:30)**
📌 **3. పుట్టిన ఊరు (City / Place of Birth)**

దయచేసి ఈ వివరాలు పంపండి, మీ జాతక చక్రాన్ని విశ్లేషించి సమాధానం ఇస్తాను.`;

    case 'gu':
      return `નમસ્તે! 🙏 તમારા પ્રશ્નનું સચોટ જ્યોતિષીય વિશ્લેષણ કરવા માટે તમારી **જન્મ વિગત** જરૂરી છે:
📌 **૧. જન્મ તારીખ (Date of Birth)**
📌 **૨. જન્મ સમય (Time of Birth - જેમ કે બપોરે ૨:૩૦)**
📌 **૩. જન્મ સ્થળ (City / District)**

કૃપા કરીને આ વિગતો શેર કરો, હું તમારી કુંડળી જોઈને માર્ગદર્શન આપીશ.`;

    case 'mr':
      return `नमस्कार! 🙏 आपल्या प्रश्नाचे अचूक ज्योतिषीय विश्लेषण करण्यासाठी आपल्या **जन्माची अचूक माहिती** आवश्यक आहे:
📌 **१. जन्म तारीख (DOB)**
📌 **२. जन्म वेळ (Time of Birth - उदा. दुपारी २:३०)**
📌 **३. जन्म ठिकाण (Birth Place)**

कृपया ही माहिती द्या, मी लगेच आपल्या कुंडलीचे विश्लेषण करून मार्गदर्शन करतो.`;

    case 'en':
    default:
      return `Namaste! 🙏 I understand your question.

To cast your Vedic horoscope and analyze your planetary houses accurately, please share your **exact birth details**:
📌 **1. Date of Birth (DOB)**
📌 **2. Time of Birth (e.g. 2:30 PM)**
📌 **3. Place of Birth (City / District)**

Once you provide these, I will calculate your Lagna, Dasha, and provide in-depth predictions and remedies.`;
  }
}

function getBirthDetailsAcknowledgedMessage(lang: SupportedLanguageCode, name: string): string {
  switch (lang) {
    case 'ta':
      return `நன்றி! உங்கள் பிறந்த விவரங்கள் பெறப்பட்டன. 🙏\nநான் உங்கள் லக்னம், ராசி மற்றும் நவகிரகங்களின் தசா-புக்தி அமைப்பை கணிக்கிறேன்...`;
    case 'te':
      return `ధన్యవాదాలు! మీ పుట్టిన వివరాలు నమోదయ్యాయి. 🙏\nనేను మీ లగ్నం, రాశి మరియు నవగ్రహ గోచార ఫలితాలను విశ్లేషిస్తున్నాను...`;
    case 'hi':
      return `धन्यवाद! आपका जन्म विवरण प्राप्त हुआ। 🙏\nमैं आपकी जन्म कुंडली और नवग्रहों की वर्तमान स्थिति का सूक्ष्म अध्ययन कर रहा हूँ...`;
    case 'gu':
      return `આભાર! તમારી જન્મ વિગતો મળી ગઈ છે. 🙏\nહું તમારી કુંડળી અને ગ્રહોની સ્થિતિનું વિશ્લેષણ કરી રહ્યો છું...`;
    case 'mr':
      return `धन्यवाद! आपली जन्म माहिती मिळाली आहे. 🙏\nमी आपल्या कुंडलीतील ग्रह व दशा यांचा अभ्यास करत आहे...`;
    case 'bn':
      return `ধন্যবাদ ভাই/বোন! আপনার জন্ম বিবরণ পেলাম। 🙏\nআমি আপনার জন্মছক (D1 লগ্ন কুণ্ডলী) ও বর্তমান নবগ্রহের গোচর বিচার করে দেখছি...`;
    case 'en':
    default:
      return `Thank you! I have noted your birth details. 🙏\nI am analyzing your Lagna chart, divisional houses, and planetary transits...`;
  }
}

function getDetailedAstrologicalReading(topic: string, lang: SupportedLanguageCode, name: string): string {
  if (topic === 'marriage') {
    switch (lang) {
      case 'ta':
        return `💍 **திருமண யோகம் (7-ம் வீடு பகுப்பாய்வு):**
• உங்கள் ஜாதகத்தில் **7-வது வீட்டில் (விவாக ஸ்தானம்)** குரு பகவானின் சுப பார்வை விழுவதால், அடுத்த **8 முதல் 14 மாதங்களுக்குள்** நல்ல திருமண யோகம் கூடிவரும்.
• உங்கள் மீது உண்மையான அன்பு மற்றும் மரியாதை கொண்ட நல்ல வாழ்க்கைத்துணை அமைவார்.
🌟 **பரிகாரம் (Remedies):**
1. வியாழக்கிழமைகளில் தட்சிணாமூர்த்திக்கு மஞ்சள் மலர்கள் சாற்றி வழிபடவும்.
2. வெள்ளிக்கிழமைகளில் மகாலட்சுமிக்கு நெய் தீபம் ஏற்றி வழிபடவும்.`;

      case 'te':
        return `💍 **వివాహ యోగం (7వ స్థాన విశ్లేషణ):**
• మీ జాతకంలో **7వ భావం (వివాహ స్థానం)** పై గురు గ్రహ అనుగ్రహం ఉన్నందున, రాబోయే **8 నుండి 14 నెలల్లో** మంచి వివాహ సంబంధం కుదిరే బలమైన యోగం ఉంది.
• మీకు అనుకూలమైన, గౌరవప్రదమైన మరియు మంచి కుటుంబ నేపథ్యం గల భాగస్వామి లభిస్తారు.
🌟 **శుభ పరిహారాలు:**
1. గురువారం నాడు విష్ణు సహస్రనామ స్తోత్రం పఠించండి లేదా పసుపు రంగు వస్త్రాలు ధరించండి.
2. శుక్రవారం లక్ష్మీదేవి పూజ చేయండి.`;

      case 'hi':
        return `💍 **विवाह योग और सप्तम भाव विश्लेषण:**
• आपकी कुंडली के **7वें भाव** पर देवगुरु बृहस्पति का शुभ गोचर बन रहा है। आगामी **8 से 14 महीनों में** विवाह के बहुत प्रबल और मांगलिक योग हैं।
• आपका जीवनसाथी संस्कारी, समझदार और परिवार को साथ लेकर चलने वाला होगा।
🌟 **शुभ उपाय:**
१. गुरुवार को पीले वस्त्र धारण करें और भगवान विष्णु को पीले फूल अर्पित करें।
२. शुक्रवार को श्री सूक्त का पाठ करें।`;

      case 'gu':
        return `💍 **લગ્ન યોગ અને સપ્તમ ભાવ વિશ્લેષણ:**
• તમારી કુંડળીના **૭મા ભાવ** પર ગુરુ ગ્રહની શુભ દ્રષ્ટિ છે. આગામી **૮ થી ૧૪ મહિનામાં** સારા લગ્ન યોગ બની રહ્યા છે.
• તમને પ્રેમાળ અને સમજદાર જીવનસાથી મળશે.
🌟 **સરળ ઉપાય:** ગુરુવારે પીળા વસ્ત્રો પહેરો અને શુક્રવારે માતા લક્ષ્મીની આરાધના કરો.`;

      case 'mr':
        return `💍 **विवाह योग आणि ७ वे घर विश्लेषण:**
• आपल्या कुंडलीतील **७ व्या भावावर** गुरु ग्रहाची शुभ दृष्टी आहे. येत्या **८ ते १४ महिन्यांत** विवाहाचा अत्यंत शुभ योग आहे.
• आपल्याला सुसंस्कृत व समजूतदार जीवनसाथी लाभेल.
🌟 **उपाय:** गुरुवारी ॐ बृं बृहस्पतये नमः चा जप करा आणि शुक्रवारी महालक्ष्मीची पूजा करा.`;

      case 'bn':
        return `💍 **বিবাহ ও সম্পর্ক যোগ বিচার (সপ্তম ভাব বিশ্লেষণ):**
• আপনার জন্মছকের **সপ্তম ভাব (বিবাহ স্থান)** এবং শুক্র গ্রহের অবস্থান শুভ। বৃহস্পতি দেবের বর্তমান গোচর দৃষ্টি আপনার সপ্তম ভাবের উপর থাকায় আগামী **৮ থেকে ১৪ মাসের মধ্যে** বিয়ের অত্যন্ত প্রবল যোগ রয়েছে।
• আপনি একজন সুশিক্ষিত, ধৈর্যশীল এবং আপনাকে গভীরভাবে ভালোবাসা ও সম্মান দেবে এমন জীবনসঙ্গী পাবেন। 
• পরিবার থেকে দেখাশোনা করে (Love-cum-Arranged) বিয়ের সম্ভাবনা বেশি এবং তা অত্যন্ত সুখের হবে।

🌟 **আপনার জন্য মঙ্গলজনক প্রতিকার (Remedies):**
১. প্রতি বৃহস্পতিবার স্নানের জলে সামান্য হলুদ মিশিয়ে স্নান করুন এবং কোনো মন্দিরে বা দরিদ্র কাউকে হলুদ কলা নিবেদন করুন।
২. মা লক্ষ্মীর উদ্দেশ্যে শুক্রবার ঘিয়ের প্রদীপ জ্বালান এবং ওম শ্রীং লক্ষ্মীয়ে নমঃ জপ করুন।`;

      case 'en':
      default:
        return `💍 **Marriage & Relationship Analysis (7th House):**
• With benefic Jupiter aspecting your 7th house and Venus well-placed, a highly auspicious marriage window is opening in the next **8 to 14 months**.
• You are destined to marry a caring, supportive, and grounded partner.
🌟 **Remedy:** Offer yellow sweets or flowers on Thursdays and worship Goddess Lakshmi on Fridays for harmonious married life.`;
    }
  }

  if (topic === 'career') {
    switch (lang) {
      case 'ta':
        return `💼 **தொழில் மற்றும் வேலைவாய்ப்பு (10-ம் வீடு):**
• உங்கள் ஜாதகத்தில் **10-வது வீடு (கர்ம ஸ்தானம்)** வலுவாக உள்ளது. அடுத்த **3 முதல் 6 மாதங்களில்** புதிய வேலைவாய்ப்பு, பதவி உயர்வு அல்லது தொழிலில் நல்ல முன்னேற்றம் ஏற்படும்.
🌟 **பரிகாரம்:** தினமும் காலையில் சூரிய பகவானுக்கு செம்பு பாத்திரத்தில் நீர் சமர்ப்பித்து வழிபடவும்.`;

      case 'te':
        return `💼 **ఉద్యోగ & వ్యాపార యోగం (10వ స్థానం):**
• మీ జాతకంలో **10వ స్థానం (కర్మ భావం)** బలంగా ఉంది. రాబోయే **3 నుండి 6 నెలల్లో** ఉద్యోగంలో పదోన్నతి లేదా కొత్త అవకాశాలు లభిస్తాయి.
🌟 **పరిహారం:** ప్రతిరోజూ ఉదయం సూర్య భగవానుడికి అర్ఘ్యం సమర్పించండి.`;

      case 'hi':
        return `💼 **करियर एवं पदोन्नति (10वां भाव):**
• कुंडली का **10वां भाव (कर्म स्थान)** और सूर्य-बुध की स्थिति दर्शाती है कि आगामी **3 से 6 महीनों में** नई नौकरी या प्रमोशन के अत्यंत शुभ योग हैं।
🌟 **उपाय:** प्रतिदिन प्रातः सूर्य देव को तांबे के लोटे से जल अर्पित करें (ॐ सूर्याय नमः)।`;

      case 'bn':
        return `💼 **কর্ম ও চাকরি যোগ বিচার (দশম ভাব বিশ্লেষণ):**
• আপনার জন্মছকে **১০ম ভাব (কর্মস্থান)** এবং বুধ ও সূর্যের সংযোগ শক্তিশালী। আপনার আগামী **৩ থেকে ৬ মাসের মধ্যে** পদোন্নতি, ভালো কোম্পানিতে নতুন চাকরি বা ব্যবসা সম্প্রসারণের নিশ্চিত যোগ দেখা যাচ্ছে।
🌟 **উন্নতির সহজ প্রতিকার:** প্রতিদিন সকালে একটি তামার পাত্রে সামান্য লাল চন্দন ও জল দিয়ে সূর্য দেবকে অর্ঘ্য দিন।`;

      case 'en':
      default:
        return `💼 **Career Outlook (10th House):**
• Strong planetary aspects on your 10th house indicate an exciting career breakthrough or promotion in the upcoming 3 to 6 months.
🌟 **Remedy:** Offer water to the Sun (Surya Dev) in a copper vessel every morning.`;
    }
  }

  return `✨ Positive planetary transits are supporting your decision. Stay disciplined and perform regular prayers.`;
}

function getFollowUpReading(query: string, topic: string, lang: SupportedLanguageCode, name: string): string {
  const q = query.toLowerCase();

  switch (lang) {
    case 'ta':
      if (q.includes('love') || q.includes('arranged') || q.includes('kalyanam')) {
        return `மிகவும் அருமையான கேள்வி! உங்கள் ஜாதகத்தில் 5-ம் வீடு (காதல்) மற்றும் 7-ம் வீடு (திருமணம்) இணைந்திருப்பதால், **குடும்பத்தினர் சம்மதத்துடன் கூடிய காதல் திருமணம் (Love-cum-Arranged)** யோகம் சிறப்பாக உள்ளது. 🌸`;
      }
      return `உங்கள் ஜாதக அமைப்பின்படி பொறுமை காப்பது நல்லது. நல்ல முடிவுகள் விரைவில் கிடைக்கும். வேறு ஏதேனும் சந்தேகம் இருந்தால் தயங்காமல் கேளுங்கள்! 🙏`;

    case 'te':
      if (q.includes('love') || q.includes('arranged') || q.includes('pelli')) {
        return `చాలా మంచి ప్రశ్న! మీ జాతకంలో 5వ స్థానం (ప్రేమ) మరియు 7వ స్థానం (వివాహం) అనుకూలంగా ఉన్నాయి. **కుటుంబ సభ్యుల అంగీకారంతో కూడిన వివాహం (Love-cum-Arranged)** జరిగే అవకాశాలు ఎక్కువ. 🌸`;
      }
      return `మీ జాతక చక్రం ప్రకారం కాలం అనుకూలంగా మారుతోంది. మీకు ఇంకేమైనా సందేహాలు ఉంటే అడగండి! 🙏`;

    case 'hi':
      return `आपकी कुंडली के अनुसार आने वाला समय आपके पक्ष में है। अपने प्रयासों पर भरोसा रखें और नियमित रूप से ॐ नमः शिवाय का जाप करें। क्या आप कुछ और जानना चाहते हैं? 🙏`;

    case 'bn':
      if (q.includes('love') || q.includes('arranged') || q.includes('dekhe') || q.includes('prem')) {
        return `খুব সুন্দর প্রশ্ন! আপনার কুণ্ডলীতে ৫ম ভাব (প্রেম) এবং ৭ম ভাবের (বিবাহ) মেলবন্ধন দেখে বোঝা যায়— আপনার ক্ষেত্রে **পারিবারিক সম্মতিতেই পছন্দের মানুষের সাথে বিয়ে (Love-cum-Arranged)** হওয়ার যোগ সবথেকে উজ্জ্বল। এতে পরিবারের পূর্ণ সমর্থন ও আশীর্বাদ বজায় থাকবে। 🌸`;
      }
      return `আমি আপনার প্রশ্নটি বুঝতে পেরেছি। আপনার জন্মছক অনুযায়ী এই বিষয়ে ধৈর্য রাখা মঙ্গলজনক। ঈশ্বর আপনার মনের শুভ ইচ্ছা পূরণ করবেন। এই ব্যাপারে আর কিছু জানার থাকলে নিঃসঙ্কোচে বলুন। 🙏`;

    case 'en':
    default:
      return `Based on your chart details, positive transits are supporting your journey. Stay disciplined and perform the recommended daily prayers. Feel free to ask any other question! 🙏`;
  }
}
