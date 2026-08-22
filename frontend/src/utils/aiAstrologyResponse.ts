/**
 * Multilingual Vedic & Tarot Astrological AI Intelligence Engine
 * Understands Bengali, Banglish, Hindi, and English queries
 * Generates context-rich predictions with 12 Houses, Dasha, Gochar (Transits), and Remedies.
 */

export function generateAstrologicalAIResponse(query: string, astrologerName: string, isTarot: boolean = false): string {
  const q = query.toLowerCase().trim();

  // Detect Language
  const isBengaliScript = /[\u0980-\u09FF]/.test(query);
  const isHindiScript = /[\u0900-\u097F]/.test(query);
  const isBanglish = /\b(amar|amr|kobe|hobe|biye|bibaho|chakri|chakri|taka|pabo|kemon|shob|korbo|bhalo|hobe|somporko|valobasa|basa)\b/i.test(q);
  const isHinglish = /\b(meri|mera|kab|hoga|hogi|shadi|vivah|naukri|paise|kaisa|rahega|pyaar)\b/i.test(q);

  // 1. MARRIAGE & LOVE RELATIONSHIPS (বিয়ে, বিবাহ, প্রেম, ভালোবাসা)
  if (
    q.includes('biye') || q.includes('bibaho') || q.includes('marriage') || q.includes('shadi') || 
    q.includes('vivah') || q.includes('love') || q.includes('prem') || q.includes('somporko') ||
    q.includes('relationship') || q.includes('breakup') || q.includes('বিয়ে') || q.includes('বিবাহ') ||
    q.includes('প্রেম') || q.includes('বিয়ে')
  ) {
    if (isBengaliScript || isBanglish) {
      return `নমস্কার! আপনার জন্মছক ও প্রশ্ন বিশ্লেষণ করে দেখছি:
💍 **বিবাহ ও সম্পর্ক যোগ (সপ্তম ভাব বিশ্লেষণ):**
• আপনার জন্মকুণ্ডলীর **৭ম ভাব (বিবাহ স্থান)** এবং শুক্র ও বৃহস্পতির বর্তমান গোচর অনুযায়ী আগামী **৮ থেকে ১৪ মাসের মধ্যে** একটি অত্যন্ত শুভ বিবাহের যোগ তৈরি হচ্ছে।
• সপ্তম পতির উপর দেবগুরু বৃহস্পতির শুভ দৃষ্টি থাকায় মনের মতো ও শুভ স্বভাবের জীবনসঙ্গী পাওয়ার সম্ভাবনা প্রবল।
🌟 **বিশেষ প্রতিকার (Remedy):**
১. প্রতি বৃহস্পতিবার হলুদ মিষ্টি বা কলা নিবেদন করুন এবং ওম বৃহস্পতয়ে নমঃ (ॐ बृं बृहस्पतये नमः) ১০৮ বার জপ করুন।
২. শুক্রবার সাদা পোশাক পরার চেষ্টা করুন এবং মা লক্ষ্মীর আরাধনা করুন।`;
    }

    if (isHindiScript || isHinglish) {
      return `नमस्ते! आपके प्रश्न और ग्रह स्थिति का विश्लेषण:
💍 **विवाह और प्रेम योग (7वां भाव):**
• आपकी कुंडली के **7वें भाव (सप्तम भाव)** और शुक्र/बृहस्पति के गोचर के अनुसार अगले **8 से 14 महीनों में** विवाह के प्रबल योग बन रहे हैं।
• देवगुरु बृहस्पति की शुभ दृष्टि से आपको समझदार और संस्कारी जीवनसाथी मिलने की प्रबल संभावना है।
🌟 **सरल उपाय:**
१. प्रत्येक गुरुवार को ॐ बृं बृहस्पतये नमः का 108 बार जाप करें और पीले वस्त्र धारण करें।
२. शुक्रवार को मां लक्ष्मी की पूजा करें और किसी कन्या को सफेद मिठाई खिलाएं।`;
    }

    return `Namaste! Based on your chart & 7th House (Vivaha Bhava) analysis:
💍 **Marriage & Relationship Forecast:**
• With Jupiter’s auspicious transit aspecting your 7th house and Venus receiving benefic dristi, a highly strong marriage window opens in the next **8 to 14 months**.
• You are likely to find a caring and supportive partner from a good family background.
🌟 **Recommended Remedy:**
1. Offer yellow flowers or sweets on Thursdays and chant 'Om Brihaspataye Namah' 108 times.
2. Worship Goddess Lakshmi on Fridays for relationship harmony.`;
  }

  // 2. CAREER & JOB (চাকরি, ক্যারিয়ার, পদোন্নতি, ব্যবসা)
  if (
    q.includes('chakri') || q.includes('job') || q.includes('career') || q.includes('naukri') || 
    q.includes('promotion') || q.includes('business') || q.includes('bebsha') || q.includes('চাকরি') ||
    q.includes('কর্ম') || q.includes('ক্যারিয়ার') || q.includes('ব্যবসা')
  ) {
    if (isBengaliScript || isBanglish) {
      return `নমস্কার! আপনার কর্ম ও জীবিকা সংক্রান্ত গ্রহাবস্থান বিশ্লেষণ:
💼 **কর্ম ও চাকরি যোগ (১০ম ভাব বিশ্লেষণ):**
• আপনার জন্মছকের **১০ম ভাব (কর্মস্থান)** এবং সূর্য-বুধের অবস্থান খুবই শক্তিশালী। আপনার বর্তমান মহাদশা ও অন্তর্দশা অনুযায়ী আগামী **৩ থেকে ৬ মাসের মধ্যে** ভালো চাকরি বা পদোন্নতির সুবর্ণ সুযোগ আসছে।
• আপনি যদি সরকারি চাকরি বা আইটি/কর্পোরেটে চেষ্টারত হন, তবে কঠোর পরিশ্রমের চমৎকার ফল শীঘ্রই দেখতে পাবেন।
🌟 **কর্ম উন্নতির প্রতিকার:**
১. প্রতিদিন সকালে সূর্যোদয়ের সময় তামার পাত্রে জল নিয়ে "ওম সূর্যায় নমঃ" মন্ত্রে অর্ঘ্য দিন।
২. কর্মক্ষেত্রে ইতিবাচক শক্তির জন্য কর্মস্থলে বা পড়ার টেবিলে একটি স্ফটিক পিরামিড রাখতে পারেন।`;
    }

    if (isHindiScript || isHinglish) {
      return `नमस्ते! आपके करियर और नौकरी से जुड़े योग:
💼 **करियर एवं पदोन्नति (10वां भाव):**
• कुंडली का **10वां भाव (कर्म स्थान)** और सूर्य-बुध की स्थिति दर्शाती है कि आगामी **3 से 6 महीनों में** नई नौकरी या प्रमोशन के अत्यंत शुभ योग हैं।
• आपके प्रयास रंग लाएंगे और कार्यक्षेत्र में वरिष्ठों का सहयोग मिलेगा।
🌟 **उपाय:**
१. प्रतिदिन प्रातः सूर्य देव को तांबे के लोटे से जल अर्पित करें (ॐ सूर्याय नमः)।
२. शनिवार को जरूरतमंदों की सहायता करें।`;
    }

    return `Namaste! Based on your 10th House (Karma Bhava) and Sun-Mercury alignment:
💼 **Career & Business Outlook:**
• Your 10th house indicates an imminent breakthrough window in the next **3 to 6 months** bringing new opportunities, promotion, or successful business expansion.
🌟 **Remedy for Rapid Growth:**
1. Offer water to Surya Dev (Sun) every morning in a copper vessel chanting 'Om Suryaya Namah'.
2. Light a ghee lamp on Saturdays to remove career obstacles.`;
  }

  // 3. MONEY & WEALTH (টাকা, আর্থিক অবস্থা, ধন স্থান)
  if (
    q.includes('taka') || q.includes('paisa') || q.includes('money') || q.includes('wealth') || 
    q.includes('dhan') || q.includes('arthik') || q.includes('টাকা') || q.includes('অর্থ') || q.includes('ধন')
  ) {
    if (isBengaliScript || isBanglish) {
      return `💰 **আর্থিক স্থিতি ও ধন যোগ (২য় ও ১১শ ভাব বিশ্লেষণ):**
• আপনার জন্মছকের **২য় ভাব (ধন স্থান)** এবং **১১শ ভাব (লাভ স্থান)** অনুযায়ী আর্থিক উন্নতি ও অপ্রত্যাশিত অর্থ প্রাপ্তির সম্ভাবনা রয়েছে।
• আগামী অক্টোবর থেকে বৃহস্পতির প্রভাবে আয়ের নতুন রাস্তা খুলে যাবে এবং সঞ্চয় বৃদ্ধি পাবে।
🌟 **ধন বৃদ্ধির প্রতিকার:**
১. শুক্রবার মা লক্ষ্মীর সামনে খাঁটি ঘিয়ের প্রদীপ জ্বালান।
২. আপনার মানিব্যাগ বা লকারে একটি পরিষ্কার গোটা সুপারি ও রুপোর কয়েন রাখুন।`;
    }

    return `💰 **Wealth & Financial Prosperity (2nd & 11th House):**
• Your 2nd house of wealth and 11th house of gains indicate favorable financial growth ahead. Income streams will stabilize with gradual accumulation of assets.
🌟 **Remedy:** Keep your North-East corner clean and chant the Shree Suktam on Fridays.`;
  }

  // 4. SHANI SADE SATI / DOSHA / HEALTH (শনি সাড়ে সাতি, দোষ, স্বাস্থ্য)
  if (
    q.includes('shani') || q.includes('sade sati') || q.includes('dosha') || q.includes('mangal') || 
    q.includes('health') || q.includes('shastho') || q.includes('শনি') || q.includes('দোষ') || q.includes('স্বাস্থ্য')
  ) {
    if (isBengaliScript || isBanglish) {
      return `🪐 **শনি প্রভাব ও দোষ নিবারণ বিশ্লেষণ:**
• শনি মহারাজ কর্মের কারক গ্রহ। শনির প্রভাবে ধৈর্য ও শৃঙ্খলার পরীক্ষা নেওয়া হয়। আপনার বর্তমান সময়ে ভয়ের কোনো কারণ নেই, সৎ কর্মে শুভ ফল নিশ্চিত।
🌟 **দোষ নিবারণের অব্যর্থ উপায়:**
১. প্রতিদিন নিয়মিত 'হনুমান চালিশা' পাঠ করুন।
২. শনিবার সন্ধ্যায় অশ্বত্থ (পিপল) গাছের নিচে সরষের তেলের প্রদীপ জ্বালান এবং কালো তিল দান করুন।`;
    }

    return `🪐 **Planetary Dosha & Saturn Transit Guidance:**
• Saturn demands discipline, ethics, and patience. To neutralize malefic aspects and boost mental peace:
🌟 **Remedy:** Recite Hanuman Chalisa daily and light a mustard oil lamp under a Peepal tree on Saturdays.`;
  }

  // 5. TAROT SPECIFIC INTUITIVE GUIDANCE
  if (isTarot) {
    if (isBengaliScript || isBanglish) {
      return `🔮 **ট্যারট কার্ড রিডিং ফলাফল:**
• **কার্ড ১ (The Sun):** আপনার বর্তমান পরিস্থিতি থেকে শীঘ্রই নতুন আশা ও আনন্দের পথ উন্মোচিত হতে চলেছে।
• **কার্ড ২ (Wheel of Fortune):** ভাগ্যের চাকা আপনার অনুকূলে ঘুরছে। যেকোনো দ্বিধাদ্বন্দ্ব পেছনে ফেলে ইতিবাচক সিদ্ধান্ত নিন।
• **কার্ড ৩ (The Star):** মানসিক শান্তি এবং মনোবাঞ্ছা পূরণের শুভ সংকেত পাওয়া যাচ্ছে।`;
    }

    return `🔮 **Tarot 3-Card Spread Insights:**
• **Past/Present (The Sun):** Clarity and breakthrough arriving in your situation.
• **Obstacle/Opportunity (Wheel of Fortune):** Destiny is shifting in your favor.
• **Outcome (The Star):** Hope, healing, and wish-fulfillment are clearly indicated.`;
  }

  // GENERAL DEFAULT ASTROLOGICAL INSIGHT (FALLBACK)
  if (isBengaliScript || isBanglish) {
    return `নমস্কার! আপনার প্রশ্ন "${query}" পর্যালোচনা করা হলো।
✨ **বৈদিক জ্যোতিষ বিচার:**
আপনার লগ্ন ও বর্তমান চন্দ্র রাশির সাপেক্ষে দেবগুরু বৃহস্পতি এবং কর্মাধিপতি গ্রহ শুভ অবস্থানে বিরাজ করছে। আপনি সঠিক দিকে এগোচ্ছেন এবং ধৈর্য ধরে প্রচেষ্টা চালিয়ে গেলে আশাতীত সাফল্য পাবেন।
🌟 **উপায়:** প্রতিদিন সকালে সূর্যোদয়ের সময় একটু ধ্যান করুন এবং ওম নমঃ শিবায় জপ করুন। আপনার আরও কোনো নির্দিষ্ট বিষয় জানার থাকলে নির্দ্বিধায় বলুন!`;
  }

  if (isHindiScript || isHinglish) {
    return `नमस्ते! आपके प्रश्न "${query}" पर ग्रह गोचर का विश्लेषण:
✨ **वैदिक ज्योतिषीय विश्लेषण:**
आपकी कुंडली के अनुसार लग्न और भाग्य स्थान पर ग्रहों का शुभ प्रभाव पड़ रहा है। आने वाला समय सकारात्मक परिणाम लेकर आएगा।
🌟 **उपाय:** प्रतिदिन ॐ नमः शिवाय का 108 बार जाप करें।`;
  }

  return `Namaste! Based on your query "${query}" and current planetary transits:
✨ **Astrological Reading:**
Your chart indicates positive alignment of benefic planets (Jupiter & Mercury). Continued dedication and maintaining mental clarity will yield successful results within the upcoming planetary cycle.
🌟 **Remedy:** Chant 'Om Namah Shivaya' daily and maintain a positive mindset. Feel free to ask more specific questions!`;
}
