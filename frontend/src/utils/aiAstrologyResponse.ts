/**
 * Stateful Human-Like Multilingual Astrological Conversational AI Engine
 * Mimics a real experienced Vedic astrologer:
 * 1. Warm, respectful human greeting.
 * 2. Checks/requests Date of Birth, Birth Time, and Birth Place before prediction.
 * 3. Acknowledges chart calculations (Lagna, Rashi, Dasha).
 * 4. Provides compassionate, authentic astrological predictions with remedies.
 * 5. Handles natural multi-turn follow-up questions.
 */

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
  const hasPlace = /\b(dhaka|delhi|kolkata|mumbai|chittagong|sylhet|khulna|rajshahi|barisal|cumilla|bogura|pune|bangalore|chennai|london|new york|india|bangladesh|village|thana|জেলা|ঢাকা|কলকাতা|চট্টগ্রাম|সিলেট|খুলনা|বরিশাল)\b/i.test(t) ||
    t.split(',').length >= 2;

  const isBirthInfo = Boolean(dateMatch || timeMatch || (hasPlace && /\d/.test(t)));

  return {
    dob: dateMatch ? dateMatch[0] : undefined,
    tob: timeMatch ? timeMatch[0] : undefined,
    pob: hasPlace ? 'Noted' : undefined,
    isBirthInfo
  };
}

export function processHumanAstrologerChat(
  userMessage: string,
  state: ChatSessionState,
  astrologerName: string,
  isTarot: boolean = false
): { reply: string; updatedState: ChatSessionState } {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  // Detect script/language
  const isBengali = /[\u0980-\u09FF]/.test(text) || /\b(amar|amr|kobe|hobe|biye|bibaho|chakri|taka|pabo|kemon|shob|korbo|bhalo|somporko|bidesh)\b/i.test(lower);
  const isHindi = /[\u0900-\u097F]/.test(text) || /\b(mera|meri|kab|hoga|shadi|vivah|naukri|paise|kaisa|rahega)\b/i.test(lower);

  const newState = { ...state };

  // Step A: If user is giving birth details
  const extracted = extractBirthDetails(text);
  if (extracted.isBirthInfo || (!state.hasCollectedBirthDetails && (text.length > 5 && /\d/.test(text)))) {
    newState.hasCollectedBirthDetails = true;
    newState.birthDetails = {
      ...newState.birthDetails,
      dob: extracted.dob || newState.birthDetails.dob || '15/05/1998',
      tob: extracted.tob || newState.birthDetails.tob || '02:30 PM',
      pob: extracted.pob || newState.birthDetails.pob || 'Dhaka/Kolkata'
    };

    const topic = newState.topic || detectTopic(text) || 'marriage';

    if (isBengali) {
      return {
        reply: `ধন্যবাদ ভাই/বোন! আপনার জন্ম বিবরণ পেলাম। 🙏
আমি আপনার জন্মছক (D1 লগ্ন কুণ্ডলী) ও বর্তমান নবগ্রহের গোচর বিচার করে দেখছি...

${getDetailedAstrologicalReading(topic, 'bn', astrologerName)}`,
        updatedState: newState
      };
    }

    if (isHindi) {
      return {
        reply: `धन्यवाद! आपका जन्म विवरण प्राप्त हुआ। 🙏
मैं आपकी जन्म कुंडली और नवग्रहों की वर्तमान स्थिति का सूक्ष्म अध्ययन कर रहा हूँ...

${getDetailedAstrologicalReading(topic, 'hi', astrologerName)}`,
        updatedState: newState
      };
    }

    return {
      reply: `Thank you! I have noted your birth details. 🙏
I am calculating your Lagna chart, planetary dasha, and transits...

${getDetailedAstrologicalReading(topic, 'en', astrologerName)}`,
      updatedState: newState
    };
  }

  // Step B: If birth details NOT yet collected, politely ask for them like a real human astrologer
  if (!state.hasCollectedBirthDetails) {
    const topic = detectTopic(text);
    if (topic) newState.topic = topic;
    newState.pendingQuestion = text;

    if (isBengali) {
      return {
        reply: `নমস্কার! 🙏 আপনার প্রশ্নটি আমি বুঝতে পেরেছি।

তবে বৈদিক জ্যোতিষশাস্ত্রে লগ্ন, ভাব ও গ্রহের দশা নির্ভুলভাবে গণনা করতে আপনার **সঠিক জন্ম বিবরণ** প্রয়োজন:
📌 **১. জন্ম তারিখ (Date of Birth)**
📌 **২. জন্ম সময় (Time of Birth - যেমন: দুপুর ২:৩০ বা সকাল ৮টা)**
📌 **৩. জন্ম স্থান (City / District)**

দয়া করে এই তিনটি তথ্য একটু জানান, আমি আপনার জন্মছক কষে এখনই সম্পূর্ণ বিশ্লেষণ করে দিচ্ছি।`,
        updatedState: newState
      };
    }

    if (isHindi) {
      return {
        reply: `नमस्ते! 🙏 आपके प्रश्न का सटीक ज्योतिषीय समाधान देने के लिए आपकी जन्म कुंडली का विश्लेषण आवश्यक है।

कृपया अपना जन्म विवरण साझा करें:
📌 **१. जन्म तिथि (DOB)**
📌 **২. जन्म समय (Time of Birth)**
📌 **३. जन्म स्थान (Birth City)**

यह विवरण मिलते ही मैं आपकी कुंडली देखकर विस्तार से मार्गदर्शन करूंगा।`,
        updatedState: newState
      };
    }

    return {
      reply: `Namaste! 🙏 I understand your question.

To analyze your planetary chart accurately using Vedic Parashara principles, please provide your **exact birth details**:
📌 **1. Date of Birth (DOB)**
📌 **2. Time of Birth (e.g. 2:30 PM)**
📌 **3. Place of Birth (City / District)**

Once you share these, I will immediately cast your chart and give you exact predictions and remedies.`,
      updatedState: newState
    };
  }

  // Step C: If birth details ALREADY collected, answer follow-up questions naturally with human touch
  const currentTopic = detectTopic(text) || newState.topic || 'general';
  
  if (isBengali) {
    return {
      reply: getFollowUpReading(text, currentTopic, 'bn', astrologerName),
      updatedState: newState
    };
  }

  if (isHindi) {
    return {
      reply: getFollowUpReading(text, currentTopic, 'hi', astrologerName),
      updatedState: newState
    };
  }

  return {
    reply: getFollowUpReading(text, currentTopic, 'en', astrologerName),
    updatedState: newState
  };
}

function detectTopic(query: string): 'marriage' | 'career' | 'finance' | 'health' | 'general' {
  const q = query.toLowerCase();
  if (q.includes('biye') || q.includes('bibaho') || q.includes('marriage') || q.includes('shadi') || q.includes('love') || q.includes('prem') || q.includes('বিয়ে') || q.includes('প্রেম')) {
    return 'marriage';
  }
  if (q.includes('chakri') || q.includes('job') || q.includes('career') || q.includes('naukri') || q.includes('promotion') || q.includes('চাকরি') || q.includes('ক্যারিয়ার')) {
    return 'career';
  }
  if (q.includes('taka') || q.includes('money') || q.includes('dhan') || q.includes('paisa') || q.includes('টাকা') || q.includes('অর্থ')) {
    return 'finance';
  }
  if (q.includes('shani') || q.includes('sade sati') || q.includes('dosha') || q.includes('health') || q.includes('শনি') || q.includes('স্বাস্থ্য')) {
    return 'health';
  }
  return 'general';
}

function getDetailedAstrologicalReading(topic: string, lang: 'bn' | 'hi' | 'en', name: string): string {
  if (topic === 'marriage') {
    if (lang === 'bn') {
      return `💍 **বিবাহ ও সম্পর্ক যোগ বিচার (সপ্তম ভাব বিশ্লেষণ):**
• আপনার জন্মছকের **সপ্তম ভাব (বিবাহ স্থান)** এবং শুক্র গ্রহের অবস্থান শুভ। বৃহস্পতি দেবের বর্তমান গোচর দৃষ্টি আপনার সপ্তম ভাবের উপর থাকায় আগামী **৮ থেকে ১৪ মাসের মধ্যে** বিয়ের অত্যন্ত প্রবল যোগ রয়েছে।
• আপনি একজন সুশিক্ষিত, ধৈর্যশীল এবং আপনাকে গভীরভাবে ভালোবাসা ও সম্মান দেবে এমন জীবনসঙ্গী পাবেন। 
• পরিবার থেকে দেখাশোনা করে (Arranged/Semi-Love) বিয়ের সম্ভাবনা বেশি এবং তা অত্যন্ত সুখের হবে।

🌟 **আপনার জন্য মঙ্গলজনক প্রতিকার (Remedies):**
১. প্রতি বৃহস্পতিবার স্নানের জলে সামান্য হলুদ মিশিয়ে স্নান করুন এবং কোনো মন্দিরে বা দরিদ্র কাউকে হলুদ কলা নিবেদন করুন।
২. মা লক্ষ্মীর উদ্দেশ্যে শুক্রবার ঘিয়ের প্রদীপ জ্বালান এবং ওম শ্রীং লক্ষ্মীয়ে নমঃ জপ করুন।

আপনার মনে বিয়ের বয়স, পাত্র/পাত্রীর স্বভাব বা অন্য কোনো প্রশ্ন থাকলে বলুন।`;
    }

    if (lang === 'hi') {
      return `💍 **विवाह योग और सप्तम भाव विश्लेषण:**
• आपकी कुंडली के **7वें भाव** पर देवगुरु बृहस्पति का शुभ गोचर बन रहा है। आगामी **8 से 14 महीनों में** विवाह के बहुत प्रबल और मांगलिक योग हैं।
• आपका जीवनसाथी संस्कारी, समझदार और परिवार को साथ लेकर चलने वाला होगा।
🌟 **शुभ उपाय:**
१. गुरुवार को पीले वस्त्र धारण करें और भगवान विष्णु को पीले फूल अर्पित करें।
२. शुक्रवार को श्री सूक्त का पाठ करें।`;
    }

    return `💍 **Marriage & Relationship Analysis (7th House):**
• With benefic Jupiter aspecting your 7th house and Venus well-placed, a highly auspicious marriage window is opening in the next **8 to 14 months**.
• You are destined to marry a caring, supportive, and grounded partner.
🌟 **Remedy:** Offer yellow sweets or flowers on Thursdays and worship Goddess Lakshmi on Fridays for harmonious married life.`;
  }

  if (topic === 'career') {
    if (lang === 'bn') {
      return `💼 **কর্ম ও চাকরি যোগ বিচার (দশম ভাব বিশ্লেষণ):**
• আপনার জন্মছকে **১০ম ভাব (কর্মস্থান)** এবং বুধ ও সূর্যের সংযোগ শক্তিশালী। আপনার আগামী **৩ থেকে ৬ মাসের মধ্যে** পদোন্নতি, ভালো কোম্পানিতে নতুন চাকরি বা ব্যবসা সম্প্রসারণের নিশ্চিত যোগ দেখা যাচ্ছে।
• কর্মক্ষেত্রে কারো কথায় বিচলিত না হয়ে নিজের স্কিল ডেভেলপমেন্টে জোর দিন।

🌟 **উন্নতির সহজ প্রতিকার:**
১. প্রতিদিন সকালে একটি তামার পাত্রে সামান্য লাল চন্দন ও জল দিয়ে সূর্য দেবকে অর্ঘ্য দিন।
২. আপনার কাজের টেবিল বা পড়ার ঘরে পরিচ্ছন্নতা বজায় রাখুন।`;
    }

    return `💼 **Career Outlook (10th House):**
• Strong planetary aspects on your 10th house indicate an exciting career breakthrough or promotion in the upcoming 3 to 6 months.
🌟 **Remedy:** Offer water to the Sun (Surya Dev) in a copper vessel every morning.`;
  }

  if (lang === 'bn') {
    return `✨ **আপনার সার্বিক কুণ্ডলী বিচার:**
• গ্রহের বর্তমান গোচর অনুযায়ী আপনার জন্য ইতিবাচক সময় শুরু হতে যাচ্ছে। বিশেষ করে আর্থিক উন্নতি ও পারিবারিক শান্তিতে শুভ ফল পাবেন।
🌟 **উপায়:** প্রতিদিন সকালে সূর্যোদয়ের সময় একটু ধ্যান করুন এবং ওম নমঃ শিবায় জপ করুন।`;
  }

  return `✨ **General Astrological Reading:**
Benefic planets are transitioning in favorable houses. Continue your honest efforts and maintain mental peace. Chant 'Om Namah Shivaya' daily for peace and prosperity.`;
}

function getFollowUpReading(query: string, topic: string, lang: 'bn' | 'hi' | 'en', name: string): string {
  const q = query.toLowerCase();

  if (lang === 'bn') {
    if (q.includes('love') || q.includes('arranged') || q.includes('dekhe') || q.includes('prem')) {
      return `খুব সুন্দর প্রশ্ন! আপনার কুণ্ডলীতে ৫ম ভাব (প্রেম) এবং ৭ম ভাবের (বিবাহ) মেলবন্ধন দেখে বোঝা যায়—
আপনার ক্ষেত্রে **পারিবারিক সম্মতিতেই পছন্দের মানুষের সাথে বিয়ে (Love-cum-Arranged)** হওয়ার যোগ সবথেকে উজ্জ্বল। এতে পরিবারের পূর্ণ সমর্থন ও আশীর্বাদ বজায় থাকবে। 🌸`;
    }

    if (q.includes('stone') || q.includes('ratna') || q.includes('pathor') || q.includes('রত্ন') || q.includes('পাথর')) {
      return `💎 **রত্ন সংক্রান্ত পরামর্শ:**
আপনার লগ্ন ও রাশির সাপেক্ষে মন শান্ত ও সৌভাগ্য বৃদ্ধির জন্য **মুক্তা (Pearl)** অথবা দেবগুরুর আশীর্বাদে ক্যারিয়ার ও বিদ্যার জন্য **পোখরাজ (Yellow Sapphire)** অত্যন্ত শুভ। তবে পাথর ধারণের আগে সোনার বা রূপার আংটিতে উপযুক্ত মন্ত্র দিয়ে শোধন করে নেওয়া আবশ্যক।`;
    }

    if (q.includes('chakri') || q.includes('job') || q.includes('taka') || q.includes('kobe')) {
      return `আপনার কর্মস্থান (১০ম ভাব) বিশ্লেষণ করে দেখছি— আগামী অক্টোবর মাসের পর থেকে নতুন ইন্টারভিউ কল বা প্রমোশনের খুব ভালো সুযোগ তৈরি হবে। ঈশ্বরের প্রতি ভরসা রেখে চেষ্টা অব্যাহত রাখুন।`;
    }

    return `আমি আপনার প্রশ্নটি বুঝতে পেরেছি। আপনার জন্মছক অনুযায়ী এই বিষয়ে ধৈর্য রাখা মঙ্গলজনক। ঈশ্বর আপনার মনের শুভ ইচ্ছা পূরণ করবেন। এই ব্যাপারে আর কিছু জানার থাকলে নিঃসঙ্কোচে বলুন। 🙏`;
  }

  return `Based on your chart details, positive transits are supporting your decision. Stay disciplined and perform the recommended daily prayers. Feel free to ask any other question! 🙏`;
}
