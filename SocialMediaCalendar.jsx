import React, { useState, useMemo } from 'react';
import { Calendar, Instagram, Twitter, Video, Image, FileText, TrendingUp, BarChart2, PieChart } from 'lucide-react';

const SocialMediaCalendar = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeTab, setActiveTab] = useState('calendar');

  const contentThemes = {
    1: { theme: "Brand Introduction", focus: "Establish voice and aesthetic" },
    2: { theme: "Product Teasers", focus: "Build curiosity about the three lines" },
    3: { theme: "Behind the Scenes - Design", focus: "Show design process" },
    4: { theme: "Tech Education", focus: "Explain the 4-layer technology" },
    5: { theme: "Founder Story", focus: "Personal connection and mission" },
    6: { theme: "Sustainability Focus", focus: "Turkish manufacturing ethics" },
    7: { theme: "Period Stigma Breaking", focus: "Humor + empowerment" },
    8: { theme: "Manufacturing Journey", focus: "Factory tours, fabric selection" },
    9: { theme: "Community Building", focus: "User polls and engagement" },
    10: { theme: "Product Reveals - Playboy Flow", focus: "First collection launch" },
    11: { theme: "Product Reveals - Office Girl", focus: "Second collection launch" },
    12: { theme: "Kickstarter Pre-Launch Hype", focus: "Coming soon messaging" }
  };

  const posts = [
    // WEEK 1
    { week: 1, day: "Monday", platform: "Instagram", type: "Post", content: "Introducing Momo Candie: Where cyberpunk meets your cycle 🍓✨", visual: "Logo reveal with glitch effect animation", hashtags: "#MomoCandie #FemTech #PeriodPositive", cta: "Follow for the revolution" },
    { week: 1, day: "Monday", platform: "TikTok", type: "Video", content: "POV: Your period underwear is actually cute for once", visual: "15sec transformation: beige boring → Momo Candie fabulous", hashtags: "#PeriodTok #FemTech #SustainableFashion", cta: "Save for launch day" },
    { week: 1, day: "Wednesday", platform: "Instagram", type: "Carousel", content: "3 things you didn't know about period underwear (slide to learn)", visual: "Educational graphics: absorption myths, fabric tech, care tips", hashtags: "#PeriodEducation #FemTech", cta: "Which surprised you most?" },
    { week: 1, day: "Wednesday", platform: "Twitter", type: "Thread", content: "Hot take: Period products should be as pretty as they are practical. Here's why we're building Momo Candie [thread]", hashtags: "#FemTech #PeriodEquity", cta: "RT if you agree" },
    { week: 1, day: "Friday", platform: "Instagram", type: "Reel", content: "Get ready with me: Picking my period underwear like it's lingerie", visual: "Quick cuts of model trying on different styles, dancing", hashtags: "#GRWM #PeriodConfidence", cta: "Link in bio to join waitlist" },
    { week: 1, day: "Friday", platform: "TikTok", type: "Video", content: "Things that shouldn't be beige: Period products. We're fixing that.", visual: "Color explosion transition from beige → cyber pink", hashtags: "#FashionTok #SustainableFashion", cta: "Launching soon 👀" },

    // WEEK 2
    { week: 2, day: "Monday", platform: "Instagram", type: "Post", content: "Sneak peek: Playboy Flow collection 💋 Lace + sass + heavy flow protection", visual: "Close-up of lace trim detail, waistband slogan tease", hashtags: "#ComingSoon #IntimateApparel", cta: "Guess the waistband slogan" },
    { week: 2, day: "Tuesday", platform: "TikTok", type: "Video", content: "Reading our waistband slogans and cackling", visual: "Models laughing while showing: 'Capitalism Made Me Bleed' etc", hashtags: "#PeriodHumor #Feminist", cta: "Which one's your favorite?" },
    { week: 2, day: "Wednesday", platform: "Instagram", type: "Story Series", content: "This or That game: Period edition", visual: "Interactive polls: Pads vs tampons? Hot water bottle vs heating pad?", hashtags: "N/A", cta: "Vote now!" },
    { week: 2, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Normalize: Talking about your period at work. Normalize: Period underwear that doesn't look medical. Normalize: Bleeding and glowing simultaneously ✨", hashtags: "#PeriodPositive", cta: "What else should we normalize?" },
    { week: 2, day: "Friday", platform: "Instagram", type: "Reel", content: "Office Girl collection reveal: For when you're closing deals while your uterus throws a tantrum 💼", visual: "Professional outfit reveal + seamless underwear demo under clothes", hashtags: "#Workwear #FemTech", cta: "Tag someone who needs these" },

    // WEEK 3
    { week: 3, day: "Monday", platform: "Instagram", type: "Carousel", content: "Behind the design: From sketch to sample [10 slides]", visual: "Design sketches → fabric swatches → pattern making → first prototype", hashtags: "#DesignProcess #MadeInTurkey", cta: "Swipe to see the journey" },
    { week: 3, day: "Tuesday", platform: "TikTok", type: "Video", content: "My designer's reaction when I said 'make period underwear... but make it cyberpunk'", visual: "Reenactment comedy skit", hashtags: "#DesignerLife #StartupLife", cta: "Mission accomplished?" },
    { week: 3, day: "Wednesday", platform: "Instagram", type: "Post", content: "Meet our Turkish manufacturing partner: Fair wages, ethical practices, incredible craftsmanship 🇹🇷", visual: "Factory photos (tasteful, focuses on quality)", hashtags: "#EthicalFashion #MadeInTurkey", cta: "Sustainability matters to you?" },
    { week: 3, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Fun fact: Our underwear is made by the same artisans who make luxury lingerie for major fashion houses. We just added graphene and a sense of humor.", hashtags: "#FashionTech", cta: "Quality you can feel" },
    { week: 3, day: "Friday", platform: "Instagram", type: "Reel", content: "Fabric haul: Touching every material that goes into Momo Candie", visual: "ASMR-style fabric touching, explaining bamboo cotton, charcoal layer", hashtags: "#FabricLover #ASMR", cta: "Which fabric surprised you?" },

    // WEEK 4
    { week: 4, day: "Monday", platform: "Instagram", type: "Post", content: "Tech Talk: The 4 layers that make Momo Candie work [educational graphic]", visual: "Cross-section illustration of all 4 layers", hashtags: "#FemTech #Innovation", cta: "Save this for later" },
    { week: 4, day: "Tuesday", platform: "TikTok", type: "Video", content: "Explaining our tech stack like you're 5: Moisture wicking? It's like a sponge that stays dry", visual: "Simple animations + demonstration", hashtags: "#ScienceTok #Education", cta: "Makes sense now?" },
    { week: 4, day: "Wednesday", platform: "Instagram", type: "Story Poll", content: "Would you wear period underwear with a pH sensor?", visual: "Strawberry Protocol teaser image", hashtags: "N/A", cta: "Vote + DM your thoughts" },
    { week: 4, day: "Thursday", platform: "Twitter", type: "Thread", content: "Let's talk about vaginal pH and why it matters [educational thread with sources]", hashtags: "#WomensHealth #FemTech", cta: "Bookmark for reference" },
    { week: 4, day: "Friday", platform: "Instagram", type: "Reel", content: "Unboxing our first prototype sample 😭✨ [emotional founder moment]", visual: "Authentic unboxing, trying on, reaction", hashtags: "#StartupJourney #SmallBusiness", cta: "Been on this journey with us?" },

    // WEEK 5 - Founder Story
    { week: 5, day: "Monday", platform: "Instagram", type: "Post", content: "Why I started Momo Candie: A founder story 💗", visual: "Professional founder photo + heartfelt caption", hashtags: "#FounderStory #WomenInBusiness", cta: "Read full story in comments" },
    { week: 5, day: "Tuesday", platform: "TikTok", type: "Video", content: "The moment I decided to quit my job and make period underwear full time", visual: "Storytelling format, slightly comedic", hashtags: "#Entrepreneur #StartupLife", cta: "Would you take the leap?" },
    { week: 5, day: "Wednesday", platform: "Instagram", type: "Carousel", content: "10 things I learned building a femtech brand in Turkey", visual: "Lessons learned graphics + photos", hashtags: "#Entrepreneurship #FemTech", cta: "Aspiring founders: save this" },
    { week: 5, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Pitch: Period underwear but make it look like it belongs in a cyberpunk anime. Investor: ...what? Me: Exactly. [Here's what happened next]", hashtags: "#StartupLife", cta: "Thread with full story ↓" },
    { week: 5, day: "Friday", platform: "Instagram", type: "Reel", content: "Day in the life: Running a femtech startup from Istanbul", visual: "Vlog style: coffee → design meeting → factory call → late night packing", hashtags: "#DayInTheLife #Startup", cta: "Want more BTS content?" },

    // WEEK 6 - Sustainability
    { week: 6, day: "Monday", platform: "Instagram", type: "Post", content: "Our sustainability promise: Vegan fabrics, fair wages, carbon-neutral shipping 🌱", visual: "Infographic breakdown", hashtags: "#SustainableFashion #EthicalBusiness", cta: "This matters to you?" },
    { week: 6, day: "Tuesday", platform: "TikTok", type: "Video", content: "How many disposable products does Momo Candie replace? Let's do the math", visual: "Visual calculation with product pile", hashtags: "#ZeroWaste #Sustainability", cta: "Did this surprise you?" },
    { week: 6, day: "Wednesday", platform: "Instagram", type: "Story Highlight", content: "Packaging reveal: Sugarcane fiber boxes with QR codes", visual: "Unboxing experience walkthrough", hashtags: "N/A", cta: "Swipe up for details" },
    { week: 6, day: "Thursday", platform: "Twitter", type: "Tweet", content: "10% of our profits go to menstrual equity education. Because access to period products shouldn't be a luxury.", hashtags: "#PeriodEquity #GiveBack", cta: "Organizations doing this work: [tag 3]" },
    { week: 6, day: "Friday", platform: "Instagram", type: "Reel", content: "Meet the women making your Momo Candie underwear [factory worker interviews - with permission]", visual: "Heartfelt interviews (subtitled)", hashtags: "#FairTrade #MadeByWomen", cta: "Ethical fashion matters" },

    // WEEK 7 - Period Stigma
    { week: 7, day: "Monday", platform: "Instagram", type: "Post", content: "Things we're not apologizing for: Bleeding. Existing. Taking up space. Being expensive.", visual: "Bold typography graphic", hashtags: "#PeriodPride #Unapologetic", cta: "What else?" },
    { week: 7, day: "Tuesday", platform: "TikTok", type: "Video", content: "POV: Someone tells you periods are 'gross' [unhinged response]", visual: "Comedy skit format", hashtags: "#PeriodTok #Comedy", cta: "Tag someone who needs to hear this" },
    { week: 7, day: "Wednesday", platform: "Instagram", type: "Carousel", content: "5 period myths we're debunishing [educational + funny]", visual: "Myth vs Reality format", hashtags: "#PeriodEducation #MythBusting", cta: "Which myth did you believe?" },
    { week: 7, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Normalize saying 'I'm on my period' instead of 'I'm not feeling well' challenge", hashtags: "#PeriodPositive", cta: "RT if you're in" },
    { week: 7, day: "Friday", platform: "Instagram", type: "Reel", content: "Reviewing period product commercials and laughing at the blue liquid", visual: "Reaction video format", hashtags: "#PeriodHumor #Marketing", cta: "The blue liquid erasure ends now" },

    // WEEK 8 - Manufacturing
    { week: 8, day: "Monday", platform: "Instagram", type: "Post", content: "Factory tour: Where Momo Candie comes to life 🏭✨", visual: "Photo series from Turkish factory", hashtags: "#MadeInTurkey #Manufacturing", cta: "Want more behind-the-scenes?" },
    { week: 8, day: "Tuesday", platform: "TikTok", type: "Video", content: "Watching our fabric get cut for the first time [emotional]", visual: "Factory floor footage with voiceover", hashtags: "#Manufacturing #SmallBusiness", cta: "It's getting real 😭" },
    { week: 8, day: "Wednesday", platform: "Instagram", type: "Story Series", content: "Material spotlight: Why we chose bamboo cotton", visual: "Educational slides with sources", hashtags: "N/A", cta: "Learn more: link in bio" },
    { week: 8, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Our manufacturer just sent photos of the first quality control test. 50 wash cycles later and the fabric still looks perfect. THIS is why we chose Turkey.", hashtags: "#QualityMatters", cta: "Photos in thread ↓" },
    { week: 8, day: "Friday", platform: "Instagram", type: "Reel", content: "Fabric shopping in Istanbul's textile district [vlog style]", visual: "Walking through Merter, touching fabrics, negotiating", hashtags: "#Istanbul #FabricShopping", cta: "Want to come with next time?" },

    // WEEK 9 - Community
    { week: 9, day: "Monday", platform: "Instagram", type: "Post", content: "Help us decide: Which colorway should we add next? [poll in comments]", visual: "3 color swatches mockups", hashtags: "#CommunityChoice", cta: "Vote below!" },
    { week: 9, day: "Tuesday", platform: "TikTok", type: "Video", content: "Responding to your questions about Momo Candie [Q&A]", visual: "Screen recordings of DMs + answers", hashtags: "#QandA #SmallBusiness", cta: "More questions? Comment!" },
    { week: 9, day: "Wednesday", platform: "Instagram", type: "Story Q&A", content: "Ask me anything about building a femtech brand", visual: "Interactive Q&A sticker", hashtags: "N/A", cta: "No question too wild" },
    { week: 9, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Shoutout to everyone who's been following since day 1. You're not just followers—you're co-creators of this brand. What should we launch after underwear?", hashtags: "#Community", cta: "Drop your ideas ↓" },
    { week: 9, day: "Friday", platform: "Instagram", type: "Reel", content: "Reading your DMs and crying (happy tears)", visual: "Founder reading supportive messages, emotional", hashtags: "#Grateful #Community", cta: "Thank you for believing" },

    // WEEK 10 - Playboy Flow
    { week: 10, day: "Monday", platform: "Instagram", type: "Post", content: "REVEAL: Playboy Flow Collection 💋 Pre-order opens soon", visual: "Professional product photography, all angles", hashtags: "#NewDrop #PeriodFashion", cta: "Link in bio to join waitlist" },
    { week: 10, day: "Tuesday", platform: "TikTok", type: "Video", content: "Unboxing Playboy Flow: The packaging, the lace, the SLOGANS", visual: "Slow-motion unboxing, reactions", hashtags: "#Unboxing #ProductLaunch", cta: "Which slogan is your vibe?" },
    { week: 10, day: "Wednesday", platform: "Instagram", type: "Carousel", content: "Playboy Flow: Every angle, every detail [10 product photos]", visual: "Close-ups of lace, waistband, fabric texture", hashtags: "#ProductPhotography", cta: "Save if you're backing!" },
    { week: 10, day: "Thursday", platform: "Twitter", type: "Tweet", content: "The Playboy Flow waistband says 'Capitalism Made Me Bleed' because we're not here to be subtle.", hashtags: "#PlayboyFlow #Feminist", cta: "Pre-order link coming Friday" },
    { week: 10, day: "Friday", platform: "Instagram", type: "Reel", content: "Trying on Playboy Flow for the first time [honest review]", visual: "Model trying on, showing fit, comfort, talking to camera", hashtags: "#HonestReview #TryOn", cta: "Questions? Ask below" },

    // WEEK 11 - Office Girl
    { week: 11, day: "Monday", platform: "Instagram", type: "Post", content: "Office Girl Collection: Seamless, smart, subtly cyberpunk 💼", visual: "Professional flat lay + worn under work outfit", hashtags: "#Workwear #Seamless", cta: "Tag your work wife" },
    { week: 11, day: "Tuesday", platform: "TikTok", type: "Video", content: "Wearing Office Girl under my favorite work pants: No lines, no stress", visual: "Outfit transition, showing invisibility", hashtags: "#WorkFashion #OOTD", cta: "Game changer fr" },
    { week: 11, day: "Wednesday", platform: "Instagram", type: "Story Highlight", content: "Office Girl glitch embroidery close-up [satisfying detail shots]", visual: "Macro photography of neon thread", hashtags: "N/A", cta: "Swipe for details" },
    { week: 11, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Office Girl is for the girls who: Have back-to-back meetings, Need all-day comfort, Contain multitudes (professional on the outside, cyberpunk on the inside)", hashtags: "#OfficeGirl", cta: "This you?" },
    { week: 11, day: "Friday", platform: "Instagram", type: "Reel", content: "Get ready with me: Office edition ft. Office Girl underwear", visual: "Morning routine, outfit building", hashtags: "#GRWM #Workwear", cta: "Your morning routine?" },

    // WEEK 12 - Kickstarter Hype
    { week: 12, day: "Monday", platform: "Instagram", type: "Post", content: "🚨 KICKSTARTER LAUNCHES IN 7 DAYS 🚨 Early bird special: 30% off", visual: "Bold announcement graphic", hashtags: "#Kickstarter #ComingSoon", cta: "Set reminder: link in bio" },
    { week: 12, day: "Tuesday", platform: "TikTok", type: "Video", content: "POV: You're about to become a Momo Candie founding member [hype video]", visual: "Fast cuts of all products, founder, factory, packaging", hashtags: "#Kickstarter #SupportSmallBusiness", cta: "Mark your calendar!" },
    { week: 12, day: "Wednesday", platform: "Instagram", type: "Carousel", content: "Everything you get as a Kickstarter backer [reward tiers explained]", visual: "Visual breakdown of each tier", hashtags: "#KickstarterRewards", cta: "Which tier is calling you?" },
    { week: 12, day: "Thursday", platform: "Twitter", type: "Tweet", content: "Kickstarter launches Monday 8am EST. Early bird backers get: 30% off, Exclusive founder updates, Lifetime discount code, First access to future drops. Set your alarms 📢", hashtags: "#Kickstarter #MomoCandie", cta: "RT to remind your timeline" },
    { week: 12, day: "Friday", platform: "Instagram", type: "Reel", content: "Countdown to launch: 3 days left [emotional founder message]", visual: "Founder talking directly to camera, authentic", hashtags: "#LaunchWeek #Grateful", cta: "We're doing this together ✨" }
  ];

  const filteredPosts = posts.filter(post => {
    const weekMatch = post.week === selectedWeek;
    const platformMatch = selectedPlatform === 'all' || post.platform === selectedPlatform;
    return weekMatch && platformMatch;
  });

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'TikTok': return <Video className="w-4 h-4" />;
      case 'Twitter': return <Twitter className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'TikTok': return 'bg-black';
      case 'Twitter': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  // --- Analytics computations ---
  const platformCounts = useMemo(() => {
    return posts.reduce((acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const typeCounts = useMemo(() => {
    return posts.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const weeklyPostCounts = useMemo(() => {
    return posts.reduce((acc, p) => {
      acc[p.week] = (acc[p.week] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const platformWeekMatrix = useMemo(() => {
    const matrix = {};
    ['Instagram', 'TikTok', 'Twitter'].forEach(pl => {
      matrix[pl] = {};
      for (let w = 1; w <= 12; w++) matrix[pl][w] = 0;
    });
    posts.forEach(p => { matrix[p.platform][p.week]++; });
    return matrix;
  }, []);

  const maxWeeklyCount = Math.max(...Object.values(weeklyPostCounts));
  const totalPosts = posts.length;

  const platformColors = {
    Instagram: { bar: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100' },
    TikTok:    { bar: 'bg-gray-800', text: 'text-gray-800', light: 'bg-gray-200' },
    Twitter:   { bar: 'bg-blue-400', text: 'text-blue-500', light: 'bg-blue-100' },
  };

  const typeColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-400', 'bg-teal-500',
  ];

  const phases = [
    { label: 'Brand Building', weeks: [1, 2, 3, 4], color: 'bg-purple-200 border-purple-400', text: 'text-purple-700' },
    { label: 'Story & Trust', weeks: [5, 6, 7, 8], color: 'bg-pink-200 border-pink-400', text: 'text-pink-700' },
    { label: 'Launch Ramp-Up', weeks: [9, 10, 11, 12], color: 'bg-orange-200 border-orange-400', text: 'text-orange-700' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Momo Candie Social Media Calendar</h1>
              <p className="text-xl opacity-90">90-Day Pre-Launch Content Strategy</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-2 mb-6 shadow-lg flex gap-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 flex-1 justify-center py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'calendar' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" /> Calendar
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 flex-1 justify-center py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart2 className="w-5 h-5" /> Analytics
          </button>
        </div>

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-lg text-center">
                <div className="text-4xl font-bold text-pink-600">{totalPosts}</div>
                <div className="text-gray-500 mt-1">Total Posts</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-lg text-center">
                <div className="text-4xl font-bold text-purple-600">12</div>
                <div className="text-gray-500 mt-1">Weeks</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-lg text-center">
                <div className="text-4xl font-bold text-blue-500">3</div>
                <div className="text-gray-500 mt-1">Platforms</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-lg text-center">
                <div className="text-4xl font-bold text-green-500">{Object.keys(typeCounts).length}</div>
                <div className="text-gray-500 mt-1">Content Types</div>
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Distribution</h2>
              <div className="space-y-4">
                {Object.entries(platformCounts).map(([platform, count]) => {
                  const pct = Math.round((count / totalPosts) * 100);
                  const colors = platformColors[platform];
                  return (
                    <div key={platform}>
                      <div className="flex justify-between mb-1">
                        <span className={`font-semibold ${colors.text}`}>{platform}</span>
                        <span className="text-gray-600">{count} posts ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4">
                        <div
                          className={`${colors.bar} h-4 rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Type Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Type Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count], i) => (
                  <div key={type} className="border-2 border-gray-100 rounded-xl p-4 text-center">
                    <div className={`inline-block w-3 h-3 rounded-full ${typeColors[i % typeColors.length]} mb-2`} />
                    <div className="text-2xl font-bold text-gray-800">{count}</div>
                    <div className="text-sm text-gray-500 mt-1">{type}</div>
                    <div className="text-xs text-gray-400">{Math.round((count / totalPosts) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Post Volume Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Post Volume</h2>
              <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(week => {
                  const count = weeklyPostCounts[week] || 0;
                  const heightPct = Math.round((count / maxWeeklyCount) * 100);
                  const isSelected = week === selectedWeek;
                  return (
                    <div
                      key={week}
                      className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                      onClick={() => { setActiveTab('calendar'); setSelectedWeek(week); }}
                    >
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                      <div
                        className={`w-full rounded-t-md transition-all ${isSelected ? 'bg-pink-500' : 'bg-purple-300 hover:bg-pink-400'}`}
                        style={{ height: `${heightPct}%`, minHeight: '4px' }}
                      />
                      <span className={`text-xs font-semibold ${isSelected ? 'text-pink-600' : 'text-gray-500'}`}>W{week}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Click a bar to jump to that week in the calendar</p>
            </div>

            {/* Platform × Week Heatmap */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Activity Heatmap</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-4 text-gray-500 font-semibold w-24">Platform</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                        <th key={w} className="text-center py-2 px-1 text-gray-500 font-semibold">W{w}</th>
                      ))}
                      <th className="text-center py-2 px-2 text-gray-500 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Instagram', 'TikTok', 'Twitter'].map(platform => {
                      const colors = platformColors[platform];
                      return (
                        <tr key={platform} className="border-t border-gray-100">
                          <td className={`py-3 pr-4 font-semibold ${colors.text}`}>{platform}</td>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => {
                            const n = platformWeekMatrix[platform][w];
                            return (
                              <td key={w} className="py-3 px-1 text-center">
                                <span className={`inline-block w-7 h-7 rounded-md text-xs font-bold leading-7 ${n > 0 ? `${colors.bar} text-white` : 'bg-gray-100 text-gray-400'}`}>
                                  {n > 0 ? n : '–'}
                                </span>
                              </td>
                            );
                          })}
                          <td className={`py-3 px-2 text-center font-bold ${colors.text}`}>{platformCounts[platform]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Phase Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign Phases</h2>
              <div className="space-y-4">
                {phases.map(phase => (
                  <div key={phase.label} className={`rounded-xl p-5 border-2 ${phase.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold text-lg ${phase.text}`}>{phase.label}</h3>
                      <span className={`text-sm font-semibold ${phase.text}`}>
                        Weeks {phase.weeks[0]}–{phase.weeks[phase.weeks.length - 1]}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {phase.weeks.map(w => (
                        <button
                          key={w}
                          onClick={() => { setActiveTab('calendar'); setSelectedWeek(w); }}
                          className="bg-white rounded-lg p-2 text-left shadow-sm hover:shadow-md transition-all"
                        >
                          <div className={`text-xs font-bold ${phase.text} mb-1`}>Week {w}</div>
                          <div className="text-xs text-gray-600 leading-tight">{contentThemes[w].theme}</div>
                          <div className={`text-xs font-semibold ${phase.text} mt-1`}>{weeklyPostCounts[w]} posts</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===== CALENDAR TAB ===== */}
        {activeTab === 'calendar' && (<>

        {/* Week Selector */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Week</h2>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(contentThemes).map(([week, data]) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(parseInt(week))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedWeek === parseInt(week)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="font-bold text-gray-800 mb-1">Week {week}</div>
                <div className="text-sm text-gray-600">{data.theme}</div>
                <div className="text-xs text-gray-500 mt-1">{data.focus}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Filter */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter by Platform</h2>
          <div className="flex gap-3">
            {['all', 'Instagram', 'TikTok', 'Twitter'].map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedPlatform === platform
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform === 'all' ? 'All Platforms' : platform}
              </button>
            ))}
          </div>
        </div>

        {/* Current Week Theme */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Week {selectedWeek}: {contentThemes[selectedWeek].theme}
          </h2>
          <p className="text-gray-600 text-lg">{contentThemes[selectedWeek].focus}</p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {filteredPosts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-pink-200 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${getPlatformColor(post.platform)} text-white p-3 rounded-lg`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{post.day}</div>
                    <div className="text-sm text-gray-600">{post.platform} • {post.type}</div>
                  </div>
                </div>
                <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Week {post.week}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Content:</h3>
                  <p className="text-gray-700">{post.content}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Visual:</h3>
                  <p className="text-gray-600 italic">{post.visual}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {post.hashtags.split(' ').map((tag, i) => (
                    <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <span className="font-semibold text-gray-800">CTA:</span> {post.cta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Best Practices */}
        <div className="bg-white rounded-xl p-8 mt-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Content Best Practices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-pink-600">Instagram Strategy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start"><span className="mr-2">•</span>Post 4-5x/week consistently</li>
                <li className="flex items-start"><span className="mr-2">•</span>Use all formats: Feed, Reels, Stories, Carousels</li>
                <li className="flex items-start"><span className="mr-2">•</span>Reels get 3-5x more reach than static posts</li>
                <li className="flex items-start"><span className="mr-2">•</span>Stories for daily engagement, polls, Q&As</li>
                <li className="flex items-start"><span className="mr-2">•</span>Save important stories to Highlights</li>
                <li className="flex items-start"><span className="mr-2">•</span>Respond to DMs within 2 hours</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-pink-600">TikTok Strategy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start"><span className="mr-2">•</span>Post 1-2x/day for algorithm favor</li>
                <li className="flex items-start"><span className="mr-2">•</span>First 3 seconds are CRITICAL (hook immediately)</li>
                <li className="flex items-start"><span className="mr-2">•</span>Use trending sounds when relevant</li>
                <li className="flex items-start"><span className="mr-2">•</span>Authenticity > production value</li>
                <li className="flex items-start"><span className="mr-2">•</span>Engage with comments (boosts reach)</li>
                <li className="flex items-start"><span className="mr-2">•</span>Duet/Stitch with relevant creators</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-pink-600">Twitter Strategy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start"><span className="mr-2">•</span>Tweet 2-3x/day, threads 1-2x/week</li>
                <li className="flex items-start"><span className="mr-2">•</span>Join conversations with relevant hashtags</li>
                <li className="flex items-start"><span className="mr-2">•</span>Use threads to tell longer stories</li>
                <li className="flex items-start"><span className="mr-2">•</span>Quote tweet to add your perspective</li>
                <li className="flex items-start"><span className="mr-2">•</span>Engage authentically (reply, like, retweet)</li>
                <li className="flex items-start"><span className="mr-2">•</span>Build relationships with other founders</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-pink-600">General Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start"><span className="mr-2">•</span>Batch create content weekly</li>
                <li className="flex items-start"><span className="mr-2">•</span>Use scheduling tools (Later, Buffer, etc.)</li>
                <li className="flex items-start"><span className="mr-2">•</span>Track metrics: engagement rate, saves, shares</li>
                <li className="flex items-start"><span className="mr-2">•</span>Repurpose top performers across platforms</li>
                <li className="flex items-start"><span className="mr-2">•</span>Stay authentic to brand voice</li>
                <li className="flex items-start"><span className="mr-2">•</span>Adapt based on what resonates</li>
              </ul>
            </div>
          </div>
        </div>

        </>)}

        {/* Footer Stats */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mt-8 border-2 border-pink-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-600">{posts.length}</div>
              <div className="text-gray-600 font-semibold">Total Posts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">12</div>
              <div className="text-gray-600 font-semibold">Weeks Planned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">3</div>
              <div className="text-gray-600 font-semibold">Platforms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCalendar;
