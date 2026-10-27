import { Article, PodcastItem, ColumnSection } from '../types';

export const topStoryLead: Article = {
  id: 'lead-1',
  title: "Clashes erupt in Paris and other cities after thousands join mostly peaceful protests across France",
  summary: "There has not yet been a repeat of the chaos seen during previous protests, our correspondent in Paris reports.",
  tag: "FRANCE",
  badge: "LIVE",
  time: "2 days ago",
  category: "Europe",
  imageUrl: "/hero-lead.jpg",
  imageAlt: "Riot police and demonstrators in Paris",
  link: "#"
};

export const topStoriesSecondary: Article[] = [
  {
    id: 'sec-1',
    title: "Met Police says letter with claims about Meghan's father not shared with other law enforcement",
    summary: "The Met said it passed information to the duchess but did not share it with other law enforcement agencies.",
    tag: "UK",
    time: "2 days ago",
    category: "UK",
    imageUrl: "/hero-meghan.jpg",
    imageAlt: "Meghan Markle portrait",
    link: "#"
  },
  {
    id: 'sec-2',
    title: "Watch as fire engulfs Hitler's mountaintop Eagle's Nest retreat",
    summary: "Police in the southern German state of Bavaria have detained a 33-year-old German man following the fire.",
    tag: "EUROPE",
    badge: "VIDEO",
    videoDuration: "02:15",
    time: "2 days ago",
    category: "Europe",
    imageUrl: "/hero-eagle.jpg",
    imageAlt: "Hitler's Eagle's Nest mountain fire at night",
    link: "#"
  }
];

export const topStoriesSideList: Article[] = [
  {
    id: 'side-1',
    title: "Infantino says he is backed by 'vast majority'",
    summary: "Fifa president Gianni Infantino laughs off questions about whether he considered resigning over the World Cup sell-off debacle.",
    time: "2 days ago",
    category: "Football",
    link: "#"
  },
  {
    id: 'side-2',
    title: "Palestinian families displaced as Israeli forces demolish Hebron homes, local officials say",
    summary: "The crackdown follows the killing of two Israeli soldiers by two Palestinian gunmen on Friday - and comes just days ahead of Israel's election.",
    time: "2 days ago",
    category: "Middle East",
    link: "#"
  },
  {
    id: 'side-3',
    title: "Mum who died trying to save sons was hero, husband says",
    summary: "Nathan Gregory says the loss of childhood sweetheart Leanne 'is unimaginable for our family'.",
    time: "2 days ago",
    category: "Nottinghamshire",
    link: "#"
  },
  {
    id: 'side-4',
    title: "Ukraine says Starlink connection 'now stable' after network limits",
    summary: "The slowed Starlink connections had affected the Ukraine's military and drone operations for a week.",
    time: "2 days ago",
    category: "Europe",
    link: "#"
  }
];

// Weekend Reads matching Image 1
export const weekendReads: Article[] = [
  {
    id: 'wr-1',
    title: "The Norwegian island that wanted to abolish time",
    summary: "Seven years after a bizarre plan to abolish time made headlines, what is life really like on this remote Arctic island?",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Aerial view of Sommarøy island in Norway with white coastal houses and bay",
    link: "#"
  },
  {
    id: 'wr-2',
    title: "12 of the best films to watch in November",
    summary: "From an awards-tipped role for Andrew Scott to another Hunger Games prequel, here are the films to watch at the cinema and stream at home this month.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Two actors in woodland scene for film still",
    link: "#"
  }
];

// Premier League matching Image 2
export const sportPremierLeague: Article = {
  id: 'sport-pl-1',
  title: "Premier League: Penders punches into own net as Spurs lead at Chelsea",
  summary: "Follow live as Chelsea host Tottenham in the Premier League, plus get reaction after wins for Arsenal and Fulham.",
  tag: "PREMIER LEAGUE",
  badge: "LIVE",
  imageUrl: "/premier-league.jpg",
  imageAlt: "Chelsea and Tottenham players in match action",
  bulletPoints: [
    "Donnarumma & Guehi highlight Man City issues as solid Arsenal move level",
    "Bobb scores late winner for Fulham at Coventry"
  ],
  link: "#"
};

// Best Audio of the Week matching Image 3
export const podcastsWeek: PodcastItem[] = [
  {
    id: 'pod-1',
    title: "The Interview",
    subtitle: "Cate Blanchett, actor: Art reminds us of our humanity",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "23 mins",
    category: "BBC Sounds"
  },
  {
    id: 'pod-2',
    title: "Good Bad Billionaire",
    subtitle: "Khaby Lame: The King of TikTok",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "41 mins",
    category: "BBC Sounds"
  },
  {
    id: 'pod-3',
    title: "Inheritance",
    subtitle: "1. A giant falls",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "24 mins",
    category: "Documentary"
  },
  {
    id: 'pod-4',
    title: "The Documentary Podcast",
    subtitle: "The silence of the oligarchs",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "28 mins",
    category: "Current Affairs"
  },
  {
    id: 'pod-5',
    title: "The Interface",
    subtitle: "The battle to delete your embarrassing online history",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "26 mins",
    category: "Tech"
  },
  {
    id: 'pod-6',
    title: "In Our Time",
    subtitle: "Particle Accelerators",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "53 mins",
    category: "Science"
  },
  {
    id: 'pod-7',
    title: "The History Podcast",
    subtitle: "1. Find your motivation",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80",
    episodeDuration: "1 hr",
    category: "History"
  }
];

export const moreNewsVanessa: Article = {
  id: 'mn-vanessa',
  title: "Vanessa Trump says she is cancer-free six months after revealing diagnosis",
  summary: "The ex-wife of Donald Trump Jr, with whom she shares five children, announced in May that she had been diagnosed with breast cancer.",
  time: "2 days ago",
  category: "US & Canada",
  imageUrl: "/morenews-vanessa.jpg",
  imageAlt: "Vanessa Trump smiling with daughter",
  link: "#"
};

export const moreNewsBurnham: Article = {
  id: 'mn-burnham',
  title: "Between quick wins and big dreams lies Burnham's biggest test",
  summary: "The prime minister might be dreaming of gold medals in 2040, but he must first navigate the difficult years in between, writes Laura Kuenssberg.",
  time: "2 days ago",
  category: "BBC InDepth",
  badge: "BBC INDEPTH",
  imageUrl: "/morenews-burnham.jpg",
  imageAlt: "Andy Burnham and politicians",
  link: "#"
};

export const moreNewsBottomRow: Article[] = [
  {
    id: 'mn-ai',
    title: "The rise of AI election ads in US midterms campaign",
    summary: "BBC Verify has tracked dozens of AI ads to assess how they are being used by campaigns in the midterms.",
    time: "2 days ago",
    category: "BBC Verify",
    badge: "BBC VERIFY",
    imageUrl: "/morenews-ai.jpg",
    isVideo: true,
    link: "#"
  },
  {
    id: 'mn-bovino',
    title: "Minneapolis withdrawal was 'surrender', Trump's ex-border patrol chief tells BBC",
    summary: "Greg Bovino was the public face of the controversial immigration enforcement operation in the city earlier this year.",
    time: "2 days ago",
    category: "US & Canada",
    imageUrl: "/morenews-bovino.jpg",
    link: "#"
  },
  {
    id: 'mn-nairobi',
    title: "Two rescued after Nairobi building collapse with five still missing",
    summary: "Police have launched a manhunt for the building's owner and contractor after the multi-storey building collapsed while still under construction.",
    time: "2 days ago",
    category: "Africa",
    imageUrl: "/morenews-nairobi.jpg",
    link: "#"
  }
];

export const moreNewsTextOnly: Article[] = [
  {
    id: 'mn-schools',
    title: "Britain's posh schools are heading to India for students and profits",
    summary: "Half a dozen elite British schools are chasing growth in India amid a boom in its wealthy population.",
    time: "2 days ago",
    category: "Asia",
    link: "#"
  },
  {
    id: 'mn-biosecurity',
    title: "UK to invest £100m in 'world first' AI Biosecurity Lab",
    summary: "The chancellor will unveil AI spending aimed at shoring up the UK's defences in Wednesday's Budget.",
    time: "2 days ago",
    category: "Technology",
    link: "#"
  }
];

export const moreNewsFeatured: Article = moreNewsVanessa;
export const moreNewsLeft: Article[] = [moreNewsBurnham];
export const moreNewsRight: Article[] = moreNewsTextOnly;

export const editorsPicks: Article[] = [
  {
    id: 'ep-1',
    title: "Who actually controls Ukraine's access to Starlink?",
    summary: "President Zelensky says limits to the technology continue to affect Ukrainian forces, while US officials and Elon Musk offer conflicting accounts of who controls it.",
    time: "10 hrs ago",
    category: "US & Canada",
    imageUrl: "/editor-starlink.jpg",
    isVideo: true,
    badge: "VIDEO",
    link: "#"
  },
  {
    id: 'ep-2',
    title: "The enduring mystery of the Loch Ness Monster",
    summary: "From sonar scans to eyewitness accounts, discover why the Loch Ness Monster mystery refuses to fade.",
    time: "12 hrs ago",
    category: "BBC Select",
    imageUrl: "/editor-lochness.jpg",
    isVideo: true,
    badge: "VIDEO",
    link: "#"
  },
  {
    id: 'ep-3',
    title: "Why is John Travolta's old luxury jet in a small Australian town?",
    summary: "The BBC goes on board Travolta's old Boeing 707 which is being reassembled in a small coastal town.",
    time: "14 hrs ago",
    category: "Australia",
    imageUrl: "/editor-travolta.jpg",
    isVideo: true,
    badge: "VIDEO",
    link: "#"
  },
  {
    id: 'ep-4',
    title: "Blue Planet III: Moment octopus escapes death after hunt gone wrong",
    summary: "The sequence is part of the latest Blue Planet series from Sir David Attenborough.",
    time: "16 hrs ago",
    category: "Science & Environment",
    imageUrl: "/editor-blueplanet.jpg",
    isVideo: true,
    badge: "VIDEO",
    link: "#"
  },
  {
    id: 'ep-5',
    title: "Watch: CCTV footage shows gunmen near church",
    summary: "Dozens of people gathered outside the church for a funeral when the shooting began, local media reported.",
    time: "18 hrs ago",
    category: "Middle East",
    imageUrl: "/editor-cctv.jpg",
    isVideo: true,
    badge: "VIDEO",
    link: "#"
  }
];

export const watchVideosDark: Article[] = [
  {
    id: 'vid-1',
    title: "Life in a remote station at the edge of the world",
    summary: "What happens when you spend 14 months surrounded by Antarctic pack ice with only 12 other scientists?",
    badge: "VIDEO",
    videoDuration: "05:45",
    time: "3 hrs ago",
    category: "Science & Nature",
    imageUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=700&q=80",
    link: "#"
  },
  {
    id: 'vid-2',
    title: "A day in the life of a crane operator high above Oslo",
    summary: "Operating at 120 metres in sub-zero Norwegian winds, overlooking the fjords at dawn.",
    badge: "VIDEO",
    videoDuration: "03:20",
    time: "4 hrs ago",
    category: "Life & Style",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    link: "#"
  },
  {
    id: 'vid-3',
    title: "The centuries-old mystery beneath Sri Lanka's coast",
    summary: "Marine archaeologists uncover submerged ancient trade ports dating back over 2,000 years.",
    badge: "VIDEO",
    videoDuration: "06:12",
    time: "6 hrs ago",
    category: "History",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80",
    link: "#"
  },
  {
    id: 'vid-4',
    title: "The Italian gelato maker using AI to invent new flavours",
    summary: "Can deep neural networks really outperform three generations of Sicilian confectionery craftsmanship?",
    badge: "VIDEO",
    videoDuration: "04:30",
    time: "7 hrs ago",
    category: "Food & Tech",
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80",
    link: "#"
  }
];

export const travelFeature: Article = {
  id: 'tr-feat',
  title: "The unspoken rules of Japanese body language",
  summary: "From calling someone over to asking for the bill, learning common Japanese gestures can help you navigate social situations in Japan without saying a word. Our expert teaches you how.",
  tag: "TRAVEL",
  time: "Yesterday",
  category: "Travel",
  imageUrl: "/travel-japan.jpg",
  imageAlt: "Japanese woman demonstrating common non-verbal hand gestures",
  link: "#"
};

export const crownsAndControversies: Article[] = [
  {
    id: 'cc-1',
    title: "Why history's 'most controversial' queen was so hated",
    summary: "Once the most despised woman in Europe, Marie Antoinette was vilified as a libertine, a conspirator and a spendthrift - then publicly executed. A new exhibition explores her story.",
    tag: "HISTORY",
    time: "2 days ago",
    category: "History",
    imageUrl: "/crown-marie.jpg",
    imageAlt: "Portrait of Marie Antoinette holding a rose",
    link: "#"
  },
  {
    id: 'cc-2',
    title: "The servant who foretold King Henry VIII's death - and paid the ultimate price",
    summary: "Elizabeth Barton became a celebrated visionary, but when she defied the monarch, she met a grisly end. Was she a charlatan or a heroine of the Tudor world?",
    tag: "HISTORY",
    time: "3 days ago",
    category: "History",
    imageUrl: "/crown-barton.jpg",
    imageAlt: "Portrait of Elizabeth Barton in white headdress",
    link: "#"
  },
  {
    id: 'cc-3',
    title: "Why the 'Virgin Queen' never married",
    summary: "Elizabeth I is the only English queen never to have married. The iconic Tudor monarch's last visit to Kenilworth Castle 450 years ago may hold some clues.",
    tag: "HISTORY",
    time: "4 days ago",
    category: "History",
    imageUrl: "/crown-elizabeth.jpg",
    imageAlt: "The Armada Portrait of Queen Elizabeth I",
    link: "#"
  }
];

export const earthFeature: Article = {
  id: 'earth-feat',
  title: "Birdwatching rewires the brain and slows cognitive decline",
  summary: "Birdwatching can help slow brain ageing and is increasingly being used as therapy for dementia patients.",
  tag: "EARTH",
  time: "Yesterday",
  category: "Earth",
  imageUrl: "/earth-birdwatching.jpg",
  imageAlt: "Illustration of two people birdwatching with binoculars looking at a bird in a tree",
  link: "#"
};

export const fourColumnDigest1: ColumnSection[] = [
  {
    title: "US & Canada News",
    link: "#",
    leadArticle: {
      id: 'us-lead',
      title: "Six Flags adding seat belts to Goliath rollercoaster following death",
      summary: "CEO of the park operator says the chain is evaluating safety restraints across all of its 34 parks and adding seat belts to its rides.",
      time: "2 hrs ago",
      tag: "US & CANADA",
      category: "US & Canada",
      imageUrl: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=80"
    },
    articles: [
      {
        id: 'us-1',
        title: "White House lifts tariffs on some Canadian goods as midterm elections loom",
        time: "4 hrs ago",
        category: "US & Canada"
      },
      {
        id: 'us-2',
        title: "Father who killed Oregon school gunman describes anguish over children he couldn't save",
        time: "5 hrs ago",
        category: "US & Canada"
      },
      {
        id: 'us-3',
        title: "Ukraine says Starlink still restricted after Trump says limits lifted",
        time: "6 hrs ago",
        category: "US & Canada"
      }
    ]
  },
  {
    title: "More World News",
    link: "#",
    leadArticle: {
      id: 'wn-lead',
      title: "Man arrested after fire at Hitler's mountaintop Eagle's Nest retreat",
      summary: "200 firefighters were deployed to fight the blaze at the famous Alpine site in Germany as police arrest a 43-year-old suspect.",
      time: "3 hrs ago",
      tag: "EUROPE",
      category: "World",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    },
    articles: [
      {
        id: 'wn-1',
        title: "Woman, 65, second patient to die of Ebola in Kenya",
        time: "4 hrs ago",
        category: "World"
      },
      {
        id: 'wn-2',
        title: "Three released without charge after fatal arson attack",
        time: "6 hrs ago",
        category: "World"
      },
      {
        id: 'wn-3',
        title: "France prepares for day of protest a week after nationwide riots",
        time: "7 hrs ago",
        category: "World"
      }
    ]
  },
  {
    title: "Business",
    link: "#",
    leadArticle: {
      id: 'biz-lead',
      title: "Are California voters about to impose 'world's first' tax on billionaires?",
      summary: "Voters in California could tax wealth over $1bn to pay for public education, infrastructure and green initiatives.",
      time: "4 hrs ago",
      tag: "CALIFORNIA",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    },
    articles: [
      {
        id: 'biz-1',
        title: "Oil spill washes up on UAE beaches after tanker strike",
        time: "5 hrs ago",
        category: "Business"
      },
      {
        id: 'biz-2',
        title: "What is PHP and why did it spark a global cyber-security scramble?",
        time: "6 hrs ago",
        category: "Business"
      },
      {
        id: 'biz-3',
        title: "Rubio turns to small Indian town as US faces high oil prices",
        time: "7 hrs ago",
        category: "Business"
      }
    ]
  },
  {
    title: "Technology",
    link: "#",
    leadArticle: {
      id: 'tech-lead',
      title: "'It's been relentless' say IT workers on frontline of PHP cyber-security scramble",
      summary: "A critical flaw in the web software sparked a frantic 48 hours for system administrators racing to protect core infrastructure.",
      time: "3 hrs ago",
      tag: "CYBER-SECURITY",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
    },
    articles: [
      {
        id: 'tech-1',
        title: "The Indian workers filming their work to train AI",
        time: "5 hrs ago",
        category: "Technology"
      },
      {
        id: 'tech-2',
        title: "Zuckerberg wins Meta deal to help him foot bill for possible California billionaire tax",
        time: "6 hrs ago",
        category: "Technology"
      },
      {
        id: 'tech-3',
        title: "Race to update services' computer systems after cyber-security flaw found",
        time: "8 hrs ago",
        category: "Technology"
      }
    ]
  }
];

export const sportAudioBadges: PodcastItem[] = [
  {
    id: 'sa-1',
    title: "FOOTBALL DAILY",
    subtitle: "Sean Dyche - The Football Interview",
    imageUrl: "/sport-audio-1.jpg",
    badge: "EPISODE",
    episodeDuration: "38 mins"
  },
  {
    id: 'sa-2',
    title: "NOT BY THE PLAYBOOK",
    subtitle: "TCV: Vikings, traitors, faithfuls and getting the bits",
    imageUrl: "/sport-audio-2.jpg",
    badge: "EXCLUSIVE",
    episodeDuration: "44 mins"
  },
  {
    id: 'sa-3',
    title: "CHEQUERED FLAG",
    subtitle: "US GP: Will Austin crown a champion?",
    imageUrl: "/sport-audio-3.jpg",
    badge: "GRAND PRIX",
    episodeDuration: "31 mins"
  },
  {
    id: 'sa-4',
    title: "FOOTBALL DAILY",
    subtitle: "Can Michael Carrick survive as Man Utd boss?",
    imageUrl: "/sport-audio-4.jpg",
    badge: "PODCAST",
    episodeDuration: "42 mins"
  },
  {
    id: 'sa-5',
    title: "CRICKET",
    subtitle: "Is this the record-breaking thriller for Anderson?",
    imageUrl: "/sport-audio-5.jpg",
    badge: "TEST MATCH",
    episodeDuration: "29 mins"
  },
  {
    id: 'sa-6',
    title: "RUGBY UNION WEEKLY",
    subtitle: "Autumn internationals: England's high stakes tests",
    imageUrl: "/sport-audio-6.jpg",
    badge: "AUDIO",
    episodeDuration: "48 mins"
  }
];

export const fourColumnDigest2: ColumnSection[] = [
  {
    title: "Sport",
    link: "#",
    leadArticle: {
      id: 'sp2-lead',
      title: "US Grand Prix final practice before qualifying",
      summary: "Follow live text updates and listen to BBC Radio 5 Sports Extra commentary of final practice for the US Grand Prix.",
      time: "LIVE",
      badge: "LIVE",
      tag: "FORMULA 1",
      category: "Sport",
      imageUrl: "/digest-sport.jpg"
    },
    articles: [
      {
        id: 'sp2-1',
        title: "From Chelsea reject to Watkins 'upgrade' - Jackson makes fast Villa start",
        time: "2 hrs ago",
        category: "Sport"
      },
      {
        id: 'sp2-2',
        title: "Konsa and Gabriel score as Arsenal beat Everton",
        time: "3 hrs ago",
        category: "Sport"
      },
      {
        id: 'sp2-3',
        title: "68-point swing and a Tonga win - how England avoid World Cup exit",
        time: "4 hrs ago",
        category: "Sport"
      }
    ]
  },
  {
    title: "Health",
    link: "#",
    leadArticle: {
      id: 'hl-lead',
      title: "The simple fitness test that predicts your risk of death",
      summary: "How quickly your heart rate returns to normal after exercise can reveal a surprising amount about your underlying health.",
      time: "3 hrs ago",
      tag: "WELLBEING",
      category: "Health",
      imageUrl: "/digest-health.jpg"
    },
    articles: [
      {
        id: 'hl-1',
        title: "What to eat for younger-looking skin",
        time: "5 hrs ago",
        category: "Health"
      },
      {
        id: 'hl-2',
        title: "The immortal jellyfish can beat ageing. It could inspire treatments for diseases of old age",
        time: "6 hrs ago",
        category: "Health"
      },
      {
        id: 'hl-3',
        title: "Why it's easy to eat 30 plants a week - and how it transformed our family dinner",
        time: "7 hrs ago",
        category: "Health"
      }
    ]
  },
  {
    title: "Culture",
    link: "#",
    leadArticle: {
      id: 'cul-lead',
      title: "The rise of new black spaces in music",
      summary: "Young black creatives are continuing a tradition of carving out spaces to dance, connect and belong.",
      time: "4 hrs ago",
      tag: "MUSIC",
      category: "Culture",
      imageUrl: "/digest-culture.jpg"
    },
    articles: [
      {
        id: 'cul-1',
        title: "Sam Fender calls out ticket prices ahead of tour",
        time: "5 hrs ago",
        category: "Culture"
      },
      {
        id: 'cul-2',
        title: "BBC and Netflix composer up for national award",
        time: "7 hrs ago",
        category: "Culture"
      },
      {
        id: 'cul-3',
        title: "Six things to see and do in 'one of the most breathtaking places on Earth'",
        time: "9 hrs ago",
        category: "Culture"
      }
    ]
  },
  {
    title: "Travel",
    link: "#",
    leadArticle: {
      id: 'tr2-lead',
      title: "No cars, no phone signal: Canada's ghost island where guests still check in",
      summary: "Once the thriving heart of Labrador's fishing industry, Battle Harbour has found new life as an island retreat with barely a trace of modern life.",
      time: "6 hrs ago",
      tag: "DESTINATIONS",
      category: "Travel",
      imageUrl: "/digest-travel.jpg"
    },
    articles: [
      {
        id: 'tr2-1',
        title: "The world's top 'cities to watch' in 2026",
        time: "8 hrs ago",
        category: "Travel"
      },
      {
        id: 'tr2-2',
        title: "How Italy's guiltiest food ritual went public",
        time: "10 hrs ago",
        category: "Travel"
      },
      {
        id: 'tr2-3',
        title: "The return of New Orleans' 'deadly' cocktail",
        time: "12 hrs ago",
        category: "Travel"
      }
    ]
  }
];

export const watchHeroCinema: Article = {
  id: 'watch-hero',
  title: "Why the television refuses to die",
  summary: "Do we still need televisions? Tech Now explores the future of TV in the modern home.",
  tag: "BBC DOCUMENTARY",
  badge: "VIDEO",
  videoDuration: "08:24",
  time: "BBC In-Depth",
  category: "Watch",
  imageUrl: "/watch-tvs.jpg",
  imageAlt: "Vintage television sets glowing in dim room",
  link: "#"
};

export const fourColumnDigest3: ColumnSection[] = [
  {
    title: "Arts",
    link: "#",
    leadArticle: {
      id: 'art-lead',
      title: "The Renaissance woman who was the first female painter of erotic nudes",
      summary: "Lavinia Fontana is considered the first female professional artist. Were her suggestive nudes a commercial choice, a rebellion against her father - or a clue to her inner life?",
      time: "5 hrs ago",
      tag: "FINE ART",
      category: "Arts",
      imageUrl: "/digest-arts.jpg"
    },
    articles: [
      {
        id: 'art-1',
        title: "'Bold and inventive' Canadian poet Anne Carson wins Nobel Literature Prize",
        time: "7 hrs ago",
        category: "Arts"
      },
      {
        id: 'art-2',
        title: "How the goddess Aphrodite became a controversial symbol of love and sex",
        time: "9 hrs ago",
        category: "Arts"
      },
      {
        id: 'art-3',
        title: "Four things Jane Austen adaptations get wrong - according to experts",
        time: "12 hrs ago",
        category: "Arts"
      }
    ]
  },
  {
    title: "Earth",
    link: "#",
    leadArticle: {
      id: 'ea2-lead',
      title: "'What the hell did this?': The orca brothers preying on great white sharks",
      summary: "Great white sharks were first found dead mutilated with their livers removed - off the coast of South Africa. Now, these tactics are seen around the world.",
      time: "4 hrs ago",
      tag: "WILDLIFE",
      category: "Earth",
      imageUrl: "/digest-earth.jpg"
    },
    articles: [
      {
        id: 'ea2-1',
        title: "The rare behaviour showing elephant grief",
        time: "6 hrs ago",
        category: "Earth"
      },
      {
        id: 'ea2-2',
        title: "The US wastes millions of tonnes of rice each year. Now people are building homes with it",
        time: "8 hrs ago",
        category: "Earth"
      },
      {
        id: 'ea2-3',
        title: "The penguins thriving in an active volcano",
        time: "11 hrs ago",
        category: "Earth"
      }
    ]
  },
  {
    title: "Video",
    link: "#",
    leadArticle: {
      id: 'vid-lead',
      title: "A day in the life of a crane operator in Oslo",
      summary: "A job as a crane operator is not for the faint of heart, but the breathtaking views make it all worthwhile.",
      time: "6 hrs ago",
      tag: "FILM",
      badge: "VIDEO",
      videoDuration: "05:14",
      category: "Video",
      imageUrl: "/digest-video.jpg"
    },
    articles: [
      {
        id: 'vid-sub1',
        title: "Tom Hiddleston on Everest drama Tenzing: 'Nobody is making films like this'",
        time: "8 hrs ago",
        category: "Video",
        badge: "VIDEO",
        videoDuration: "04:52"
      },
      {
        id: 'vid-sub2',
        title: "A close look at the Bayeux Tapestry's dramatic scenes",
        time: "10 hrs ago",
        category: "Video",
        badge: "VIDEO",
        videoDuration: "03:15"
      },
      {
        id: 'vid-sub3',
        title: "The Tuscan nonna teaching the internet to cook",
        time: "12 hrs ago",
        category: "Video",
        badge: "VIDEO",
        videoDuration: "05:10"
      }
    ]
  },
  {
    title: "World's Table",
    link: "#",
    leadArticle: {
      id: 'wt-lead',
      title: "Why travellers are obsessed with foreign supermarkets",
      summary: "From Tokyo egg sandwiches to Greek dairy aisles, supermarket aisles are becoming one of travel's most revealing and beloved experiences.",
      time: "5 hrs ago",
      tag: "FOOD & TRAVEL",
      category: "Food",
      imageUrl: "/digest-worldstable.jpg"
    },
    articles: [
      {
        id: 'wt-1',
        title: "The five meals Andrew Zimmern will never forget",
        time: "7 hrs ago",
        category: "Food"
      },
      {
        id: 'wt-2',
        title: "Why Estonians invite strangers into their back yards each summer",
        time: "9 hrs ago",
        category: "Food"
      },
      {
        id: 'wt-3',
        title: "'NonnaMaxxing': Tourists are paying to travel like grandmothers",
        time: "13 hrs ago",
        category: "Food"
      }
    ]
  }
];

export const discoverHeroCard = {
  id: 'disc-hero',
  title: "The best of the BBC, delivered to you",
  description: "Get news and insights with BBC newsletters, sent direct to your inbox. Sign up for free.",
  cta: "See more",
  badge: "NEWSLETTERS",
  imageUrl: "/discover-mosaic.jpg"
};

export const discoverCards = [
  {
    id: 'disc-1',
    title: "Live Well for Longer",
    description: "Boost your brain, diet, fitness, sleep and more in a six-part health course, weekly to your inbox.",
    cta: "Sign up for free",
    badge: "HEALTH & WELLBEING",
    imageUrl: "/discover-card-1.jpg"
  },
  {
    id: 'disc-2',
    title: "US Politics Unspun",
    description: "No noise. No agenda. Just expert analysis of the issues that matter most from Anthony Zurcher, every Wednesday.",
    cta: "Sign up for free",
    badge: "POLITICS",
    imageUrl: "/discover-card-2.jpg"
  },
  {
    id: 'disc-3',
    title: "Sign up to World of Business",
    description: "Gain the leading edge with global insights for the boardroom and beyond, in your inbox every Wednesday.",
    cta: "Sign up for free",
    badge: "BUSINESS",
    imageUrl: "/discover-card-3.jpg"
  },
  {
    id: 'disc-4',
    title: "Get The Essential List",
    description: "The week's best stories, handpicked by BBC editors, in your inbox every Tuesday and Friday.",
    cta: "Sign up for free",
    badge: "NEWSLETTER",
    imageUrl: "/discover-card-4.jpg"
  },
  {
    id: 'disc-5',
    title: "BritBox - Stream the best of British TV",
    description: "Endlessly entertaining. Delightfully different. Enjoy worlds of wit, mystery and drama with BritBox.",
    cta: "Start 7-day trial",
    badge: "STREAMING",
    imageUrl: "/discover-card-5.jpg"
  },
  {
    id: 'disc-6',
    title: "Watch Documentaries",
    description: "Watch critically acclaimed and award-winning documentaries from the BBC, including History, Nature, True Crime and more.",
    cta: "Watch now",
    badge: "DOCUMENTARIES",
    imageUrl: "/discover-card-6.jpg"
  },
  {
    id: 'disc-7',
    title: "Download the BBC app",
    description: "Click here to download the BBC app for Apple and Android devices.",
    cta: "Download app",
    badge: "BBC APP",
    imageUrl: "/discover-card-7.jpg"
  },
  {
    id: 'disc-8',
    title: "Register for a BBC account",
    description: "Don't have time to read everything right now? Your BBC account lets you save articles and videos for later.",
    cta: "Register free",
    badge: "ACCOUNT",
    imageUrl: "/discover-card-8.jpg"
  }
];

export const navCategories = [
  { name: 'Home', href: '/', slug: '' },
  { name: 'World News', href: '/World-News', slug: 'World-News' },
  { name: 'Sport', href: '/Sport', slug: 'Sport' },
  { name: 'Law & Justice', href: '/Law-&-Justice', slug: 'Law-&-Justice' },
  { name: 'Education', href: '/Education', slug: 'Education' },
  { name: 'Health', href: '/Health', slug: 'Health' },
  { name: 'Energy & Infrastructure', href: '/Energy-&-Infrastructure', slug: 'Energy-&-Infrastructure' },
  { name: 'Travel & Lifestyle', href: '/Travel-&-Lifestyle', slug: 'Travel-&-Lifestyle' },
  { name: 'Opinions', href: '/Opinions', slug: 'Opinions' }
];
