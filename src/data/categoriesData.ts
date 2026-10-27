export interface SubCategory {
  name: string;
  slug: string;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

export const mainCategories: MainCategory[] = [
  {
    id: 'world-news',
    name: 'World News',
    slug: 'World-News',
    subcategories: [
      { name: 'Asia-Pacific', slug: 'Asia-Pacific' },
      { name: 'Europe', slug: 'Europe' },
      { name: 'Middle East', slug: 'Middle-East' },
      { name: 'Africa', slug: 'Africa' },
      { name: 'North America', slug: 'North-America' },
      { name: 'Latin America and the Caribbean', slug: 'Latin-America-and-the-Caribbean' },
      { name: 'International Conflicts', slug: 'International-Conflicts' }
    ]
  },
  {
    id: 'politics-government',
    name: 'Politics & Government',
    slug: 'Politics-&-Government',
    subcategories: [
      { name: 'US Politics', slug: 'US-Politics' },
      { name: 'Elections', slug: 'Elections' },
      { name: 'Government and Public Policy', slug: 'Government-and-Public-Policy' },
      { name: 'Congress and Parliament', slug: 'Congress-and-Parliament' },
      { name: 'Political Parties', slug: 'Political-Parties' },
      { name: 'Foreign Policy', slug: 'Foreign-Policy' }
    ]
  },
  {
    id: 'business-economy',
    name: 'Business & Economy',
    slug: 'Business-&-Economy',
    subcategories: [
      { name: 'Global Economy', slug: 'Global-Economy' },
      { name: 'Corporate News', slug: 'Corporate-News' },
      { name: 'Markets & Investing', slug: 'Markets-&-Investing' },
      { name: 'Banking & Finance', slug: 'Banking-&-Finance' },
      { name: 'Startups & Entrepreneurship', slug: 'Startups-&-Entrepreneurship' },
      { name: 'CEOs & Leadership', slug: 'CEOs-&-Leadership' }
    ]
  },
  {
    id: 'technology-ai',
    name: 'Technology & AI',
    slug: 'Technology-&-AI',
    subcategories: [
      { name: 'Artificial Intelligence', slug: 'Artificial-Intelligence' },
      { name: 'Big Tech', slug: 'Big-Tech' },
      { name: 'Cybersecurity', slug: 'Cybersecurity' },
      { name: 'Robotics & Automation', slug: 'Robotics-&-Automation' },
      { name: 'Space Technology', slug: 'Space-Technology' },
      { name: 'Consumer Technology', slug: 'Consumer-Technology' }
    ]
  },
  {
    id: 'science-research',
    name: 'Science & Research',
    slug: 'Science-&-Research',
    subcategories: [
      { name: 'Scientific Discoveries', slug: 'Scientific-Discoveries' },
      { name: 'Biology & Genetics', slug: 'Biology-&-Genetics' },
      { name: 'Climate Science', slug: 'Climate-Science' },
      { name: 'Medical Research', slug: 'Medical-Research' },
      { name: 'Universities & Research', slug: 'Universities-&-Research' },
      { name: 'Innovation & Future Science', slug: 'Innovation-&-Future-Science' }
    ]
  },
  {
    id: 'health',
    name: 'Health',
    slug: 'Health',
    subcategories: [
      { name: 'Public Health', slug: 'Public-Health' },
      { name: 'Mental Health', slug: 'Mental-Health' },
      { name: 'Healthcare Systems', slug: 'Healthcare-Systems' },
      { name: 'Nutrition & Lifestyle', slug: 'Nutrition-&-Lifestyle' },
      { name: 'Disease Prevention', slug: 'Disease-Prevention' },
      { name: 'Global Health Policy', slug: 'Global-Health-Policy' }
    ]
  },
  {
    id: 'climate-environment',
    name: 'Climate & Environment',
    slug: 'Climate-&-Environment',
    subcategories: [
      { name: 'Climate Change', slug: 'Climate-Change' },
      { name: 'Extreme Weather', slug: 'Extreme-Weather' },
      { name: 'World Natural Disasters', slug: 'World-Natural-Disasters' },
      { name: 'Biodiversity & Wildlife', slug: 'Biodiversity-&-Wildlife' },
      { name: 'Pollution', slug: 'Pollution' }
    ]
  },
  {
    id: 'law-justice',
    name: 'Law & Justice',
    slug: 'Law-&-Justice',
    subcategories: [
      { name: 'Supreme Courts & Major Rulings', slug: 'Supreme-Courts-&-Major-Rulings' },
      { name: 'Criminal Justice', slug: 'Criminal-Justice' },
      { name: 'Human Rights', slug: 'Human-Rights' },
      { name: 'Constitutional Law', slug: 'Constitutional-Law' },
      { name: 'International Law', slug: 'International-Law' }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'Education',
    subcategories: [
      { name: 'Higher Education', slug: 'Higher-Education' },
      { name: 'Student Life', slug: 'Student-Life' },
      { name: 'Scholarships', slug: 'Scholarships' },
      { name: 'Research & Academia', slug: 'Research-&-Academia' }
    ]
  },
  {
    id: 'human-rights',
    name: 'Human Rights & Civil Liberties',
    slug: 'Human-Rights-&-Civil-Liberties',
    subcategories: [
      { name: 'Child Protection', slug: 'Child-Protection' },
      { name: 'Gender Equality', slug: 'Gender-Equality' },
      { name: 'Poverty & Inequality', slug: 'Poverty-&-Inequality' },
      { name: 'Migration & Refugees', slug: 'Migration-&-Refugees' },
      { name: 'Social Media and Society', slug: 'Social-Media-and-Society' }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    slug: 'Sport',
    subcategories: [
      { name: 'Football', slug: 'Football' },
      { name: 'Cricket', slug: 'Cricket' },
      { name: 'Tennis', slug: 'Tennis' },
      { name: 'Basketball', slug: 'Basketball' },
      { name: 'Motorsport', slug: 'Motorsport' },
      { name: 'Olympic Sports', slug: 'Olympic-Sports' }
    ]
  },
  {
    id: 'culture-entertainment',
    name: 'Culture & Entertainment',
    slug: 'Culture-&-Entertainment',
    subcategories: [
      { name: 'Film & Television', slug: 'Film-&-Television' },
      { name: 'Music', slug: 'Music' },
      { name: 'Books & Literature', slug: 'Books-&-Literature' },
      { name: 'Art & Design', slug: 'Art-&-Design' },
      { name: 'Celebrities', slug: 'Celebrities' },
      { name: 'Media & Publishing', slug: 'Media-&-Publishing' },
      { name: 'Cultural Heritage', slug: 'Cultural-Heritage' }
    ]
  },
  {
    id: 'travel-lifestyle',
    name: 'Travel & Lifestyle',
    slug: 'Travel-&-Lifestyle',
    subcategories: [
      { name: 'Global Travel', slug: 'Global-Travel' },
      { name: 'Tourism Industry', slug: 'Tourism-Industry' },
      { name: 'Luxury & Lifestyle', slug: 'Luxury-&-Lifestyle' },
      { name: 'Food & Dining', slug: 'Food-&-Dining' },
      { name: 'Fashion', slug: 'Fashion' },
      { name: 'Architecture & Design', slug: 'Architecture-&-Design' }
    ]
  },
  {
    id: 'energy-infrastructure',
    name: 'Energy & Infrastructure',
    slug: 'Energy-&-Infrastructure',
    subcategories: [
      { name: 'Oil & Gas', slug: 'Oil-&-Gas' },
      { name: 'Electricity & Power', slug: 'Electricity-&-Power' },
      { name: 'Renewable Energy', slug: 'Renewable-Energy' },
      { name: 'Transport & Aviation', slug: 'Transport-&-Aviation' },
      { name: 'Construction', slug: 'Construction' },
      { name: 'Real Estate', slug: 'Real-Estate' }
    ]
  },
  {
    id: 'opinions',
    name: 'Opinions',
    slug: 'Opinions',
    subcategories: [
      { name: 'Editorials', slug: 'Editorials' },
      { name: 'Interviews', slug: 'Interviews' }
    ]
  }
];

// Helper to look up any category (main or sub) by slug
export function findCategoryBySlug(slug: string) {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, '-');
  const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, '');

  // 1. Exact match on slug
  for (const main of mainCategories) {
    const mainSlug = main.slug.toLowerCase().replace(/[\s_]+/g, '-');
    if (mainSlug === decodedSlug) {
      return { main, sub: null, isMain: true };
    }
    for (const sub of main.subcategories) {
      const subSlug = sub.slug.toLowerCase().replace(/[\s_]+/g, '-');
      if (subSlug === decodedSlug) {
        return { main, sub, isMain: false };
      }
    }
  }

  // 2. Match on name
  for (const main of mainCategories) {
    const mainNameSlug = main.name.toLowerCase().replace(/[\s_]+/g, '-');
    if (mainNameSlug === decodedSlug) {
      return { main, sub: null, isMain: true };
    }
    for (const sub of main.subcategories) {
      const subNameSlug = sub.name.toLowerCase().replace(/[\s_]+/g, '-');
      if (subNameSlug === decodedSlug) {
        return { main, sub, isMain: false };
      }
    }
  }

  // 3. Normalized alphanumeric match
  for (const main of mainCategories) {
    const mainClean = main.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const mainSlugClean = main.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (mainClean === cleanSlug || mainSlugClean === cleanSlug || mainClean.startsWith(cleanSlug) || (cleanSlug.length >= 4 && mainClean.includes(cleanSlug))) {
      return { main, sub: null, isMain: true };
    }
    for (const sub of main.subcategories) {
      const subClean = sub.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const subSlugClean = sub.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (subClean === cleanSlug || subSlugClean === cleanSlug) {
        return { main, sub, isMain: false };
      }
    }
  }

  // 4. Aliases
  if (cleanSlug === 'earth') {
    const climate = mainCategories.find(c => c.id === 'cat-7');
    if (climate) return { main: climate, sub: null, isMain: true };
  }
  if (cleanSlug === 'news') {
    const world = mainCategories.find(c => c.id === 'cat-1');
    if (world) return { main: world, sub: null, isMain: true };
  }
  if (cleanSlug === 'business') {
    const biz = mainCategories.find(c => c.id === 'cat-3');
    if (biz) return { main: biz, sub: null, isMain: true };
  }

  return null;
}
