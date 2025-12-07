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
  }
];
