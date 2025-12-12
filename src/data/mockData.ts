export interface Profile {
  id: number;
  name: string;
  age: number;
  height: string;
  profession: string;
  company?: string;
  education: string;
  city: string;
  state: string;
  image: string; // Main image
  images: string[]; // Gallery
  isPremium: boolean;
  isNew: boolean;
  matchScore: number;
  verified: boolean;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  diet: string;
  smoking: string;
  drinking: string;
  income: string;
  family: {
    father: string;
    mother: string;
    siblings: string;
    familyType: string;
    familyValues: string;
  };
  about: string;
  interests: string[];
}

export const profiles: Profile[] = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 28,
    height: "5'6\"",
    profession: "Software Engineer",
    company: "Google India",
    education: "B.Tech, IIT Delhi",
    city: "Bangalore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDg2NjU5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1653671832574-029b950a5749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    ],
    isPremium: true,
    isNew: false,
    matchScore: 95,
    verified: true,
    religion: "Hindu",
    caste: "Brahmin",
    motherTongue: "Hindi",
    maritalStatus: "Never Married",
    diet: "Vegetarian",
    smoking: "No",
    drinking: "Occasionally",
    income: "₹15-20 LPA",
    family: {
      father: "Businessman",
      mother: "Homemaker",
      siblings: "1 Brother (Younger, Unmarried)",
      familyType: "Nuclear",
      familyValues: "Moderate"
    },
    about: "A passionate software engineer with a love for technology and innovation. I value family traditions while embracing modern values. Looking for a partner who shares similar interests and values, someone who can be my best friend and life partner.",
    interests: ["Travel", "Reading", "Cooking", "Yoga", "Photography"]
  },
  {
    id: 2,
    name: "Arjun Patel",
    age: 32,
    height: "5'11\"",
    profession: "Investment Banker",
    company: "JP Morgan",
    education: "MBA, IIM Ahmedabad",
    city: "Mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ5MzAzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    ],
    isPremium: false,
    isNew: true,
    matchScore: 88,
    verified: true,
    religion: "Hindu",
    caste: "Patel",
    motherTongue: "Gujarati",
    maritalStatus: "Never Married",
    diet: "Vegetarian",
    smoking: "No",
    drinking: "No",
    income: "₹30-40 LPA",
    family: {
      father: "Retired Govt Servant",
      mother: "Teacher",
      siblings: "1 Sister (Married)",
      familyType: "Joint",
      familyValues: "Traditional"
    },
    about: "Investment banker by profession, traveler by passion. I'm looking for someone who is ambitious yet grounded. I love exploring new cuisines and places.",
    interests: ["Finance", "Hiking", "Cricket", "Music"]
  },
  {
    id: 3,
    name: "Aisha Khan",
    age: 26,
    height: "5'5\"",
    profession: "Doctor",
    company: "Apollo Hospitals",
    education: "MBBS, AIIMS",
    city: "Delhi",
    state: "Delhi",
    image: "https://images.unsplash.com/photo-1653671832574-029b950a5749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1653671832574-029b950a5749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    ],
    isPremium: true,
    isNew: false,
    matchScore: 92,
    verified: true,
    religion: "Muslim",
    caste: "Pathan",
    motherTongue: "Urdu",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "No",
    income: "₹12-15 LPA",
    family: {
      father: "Doctor",
      mother: "Doctor",
      siblings: "None",
      familyType: "Nuclear",
      familyValues: "Liberal"
    },
    about: "Dedicated to my profession and serving people. Looking for a partner who respects my career and has a progressive mindset.",
    interests: ["Reading", "Medical Research", "Art"]
  },
  {
    id: 4,
    name: "Rohan Mehta",
    age: 30,
    height: "6'0\"",
    profession: "Entrepreneur",
    company: "Tech Startup",
    education: "B.Com, Delhi University",
    city: "Pune",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    ],
    isPremium: false,
    isNew: true,
    matchScore: 85,
    verified: false,
    religion: "Jain",
    caste: "Shwetambar",
    motherTongue: "Hindi",
    maritalStatus: "Divorced",
    diet: "Vegetarian",
    smoking: "Yes",
    drinking: "Socially",
    income: "₹50+ LPA",
    family: {
      father: "Business",
      mother: "Homemaker",
      siblings: "2 Brothers",
      familyType: "Joint",
      familyValues: "Modern"
    },
    about: "Tech enthusiast and startup founder. I believe in living life to the fullest.",
    interests: ["Tech", "Startups", "Gaming"]
  },
  {
    id: 5,
    name: "Sneha Reddy",
    age: 27,
    height: "5'4\"",
    profession: "Data Scientist",
    company: "Amazon",
    education: "M.Tech, IIT Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop"],
    isPremium: true,
    isNew: true,
    matchScore: 91,
    verified: true,
    religion: "Hindu",
    caste: "Reddy",
    motherTongue: "Telugu",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "Occasionally",
    income: "₹25-30 LPA",
    family: {
      father: "Government Officer",
      mother: "Professor",
      siblings: "1 Sister (Younger)",
      familyType: "Nuclear",
      familyValues: "Moderate"
    },
    about: "Data science professional who loves solving complex problems. Looking for an intellectual partner.",
    interests: ["AI/ML", "Chess", "Classical Dance", "Reading"]
  },
  {
    id: 6,
    name: "Vikram Singh",
    age: 29,
    height: "5'10\"",
    profession: "Civil Services",
    company: "IAS Officer",
    education: "BA History, St. Stephen's",
    city: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"],
    isPremium: true,
    isNew: false,
    matchScore: 89,
    verified: true,
    religion: "Hindu",
    caste: "Rajput",
    motherTongue: "Hindi",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "Socially",
    income: "₹12-15 LPA",
    family: {
      father: "Retired Army Officer",
      mother: "Homemaker",
      siblings: "1 Brother (Elder, Married)",
      familyType: "Joint",
      familyValues: "Traditional"
    },
    about: "Serving the nation with pride. Family-oriented person looking for a supportive life partner.",
    interests: ["History", "Politics", "Horse Riding", "Polo"]
  },
  {
    id: 7,
    name: "Meera Nair",
    age: 25,
    height: "5'3\"",
    profession: "Architect",
    company: "Hafeez Contractor",
    education: "B.Arch, SPA Delhi",
    city: "Chennai",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop"],
    isPremium: false,
    isNew: true,
    matchScore: 87,
    verified: true,
    religion: "Hindu",
    caste: "Nair",
    motherTongue: "Malayalam",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "No",
    income: "₹10-12 LPA",
    family: {
      father: "Businessman",
      mother: "Lawyer",
      siblings: "None",
      familyType: "Nuclear",
      familyValues: "Liberal"
    },
    about: "Creative architect with a passion for sustainable design. Love art and culture.",
    interests: ["Architecture", "Painting", "Bharatanatyam", "Travel"]
  },
  {
    id: 8,
    name: "Kabir Malhotra",
    age: 31,
    height: "6'1\"",
    profession: "Film Director",
    company: "Bollywood",
    education: "Film Studies, FTII Pune",
    city: "Mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop"],
    isPremium: true,
    isNew: false,
    matchScore: 83,
    verified: false,
    religion: "Sikh",
    caste: "Khatri",
    motherTongue: "Punjabi",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "Occasionally",
    drinking: "Socially",
    income: "₹40-50 LPA",
    family: {
      father: "Producer",
      mother: "Homemaker",
      siblings: "1 Sister (Younger)",
      familyType: "Nuclear",
      familyValues: "Modern"
    },
    about: "Creative storyteller. Looking for someone who appreciates art and cinema.",
    interests: ["Cinema", "Photography", "Music", "Writing"]
  },
  {
    id: 9,
    name: "Ananya Desai",
    age: 24,
    height: "5'5\"",
    profession: "Fashion Designer",
    company: "Sabyasachi",
    education: "NIFT, Mumbai",
    city: "Ahmedabad",
    state: "Gujarat",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop"],
    isPremium: false,
    isNew: true,
    matchScore: 86,
    verified: true,
    religion: "Hindu",
    caste: "Desai",
    motherTongue: "Gujarati",
    maritalStatus: "Never Married",
    diet: "Vegetarian",
    smoking: "No",
    drinking: "No",
    income: "₹8-10 LPA",
    family: {
      father: "Textile Business",
      mother: "Homemaker",
      siblings: "2 Brothers (Elder)",
      familyType: "Joint",
      familyValues: "Traditional"
    },
    about: "Fashion enthusiast who loves creating beautiful things. Looking for a cultured partner.",
    interests: ["Fashion", "Sketching", "Garba", "Cooking"]
  },
  {
    id: 10,
    name: "Siddharth Kapoor",
    age: 33,
    height: "5'9\"",
    profession: "Surgeon",
    company: "Fortis Hospital",
    education: "MS Surgery, AIIMS",
    city: "Kolkata",
    state: "West Bengal",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop"],
    isPremium: true,
    isNew: false,
    matchScore: 94,
    verified: true,
    religion: "Hindu",
    caste: "Brahmin",
    motherTongue: "Bengali",
    maritalStatus: "Divorced",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "Occasionally",
    income: "₹35-40 LPA",
    family: {
      father: "Doctor",
      mother: "Doctor",
      siblings: "1 Sister (Married)",
      familyType: "Nuclear",
      familyValues: "Moderate"
    },
    about: "Dedicated surgeon passionate about saving lives. Looking for a understanding partner.",
    interests: ["Medicine", "Classical Music", "Tennis", "Reading"]
  },
  {
    id: 11,
    name: "Rhea Iyer",
    age: 26,
    height: "5'6\"",
    profession: "Lawyer",
    company: "AZB Partners",
    education: "LLB, NLS Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop"],
    isPremium: false,
    isNew: false,
    matchScore: 90,
    verified: true,
    religion: "Hindu",
    caste: "Iyer",
    motherTongue: "Tamil",
    maritalStatus: "Never Married",
    diet: "Vegetarian",
    smoking: "No",
    drinking: "No",
    income: "₹20-25 LPA",
    family: {
      father: "Judge",
      mother: "Professor",
      siblings: "None",
      familyType: "Nuclear",
      familyValues: "Moderate"
    },
    about: "Corporate lawyer with strong values. Looking for an ambitious life partner.",
    interests: ["Law", "Debate", "Carnatic Music", "Yoga"]
  },
  {
    id: 12,
    name: "Aditya Joshi",
    age: 28,
    height: "5'11\"",
    profession: "Product Manager",
    company: "Microsoft",
    education: "B.Tech + MBA, IIM Bangalore",
    city: "Pune",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
    images: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop"],
    isPremium: true,
    isNew: true,
    matchScore: 93,
    verified: true,
    religion: "Hindu",
    caste: "Maratha",
    motherTongue: "Marathi",
    maritalStatus: "Never Married",
    diet: "Non-Vegetarian",
    smoking: "No",
    drinking: "Socially",
    income: "₹45-50 LPA",
    family: {
      father: "Businessman",
      mother: "Homemaker",
      siblings: "1 Brother (Younger)",
      familyType: "Nuclear",
      familyValues: "Modern"
    },
    about: "Tech product leader who loves building things. Looking for a driven and fun partner.",
    interests: ["Technology", "Trekking", "Movies", "Guitar"]
  }
];
