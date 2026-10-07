export interface EventItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Workshop' | 'Guest Lecture' | 'Build Sprint';
  date: string;
  time?: string;
  location: string;
  description: string;
  featured?: boolean;
  status: 'Upcoming' | 'Completed' | 'Registration Open';
  image?: string;
  participantsCount?: number;
  duration?: string;
  tags: string[];
  registrationUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  team: string[];
  year: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  image?: string;
  badge?: string;
}

export interface ResearchItem {
  id: string;
  number: string;
  title: string;
  authors: string[];
  abstract: string;
  tags: string[];
  readUrl?: string;
  date: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  classCategory: string;
  image: string;
  expertise: string[];
  isLeader: boolean;
  emoji?: string;
  github?: string;
  linkedin?: string;
}

export interface FacultyAdvisor {
  name: string;
  title: string;
  department: string;
  role: string;
  contribution: string;
  image?: string;
}

export interface ChapterStat {
  value: number;
  suffix: string;
  label: string;
  subtext: string;
}

export interface InitiativeItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  accentColor: 'green' | 'dark' | 'blue';
}

export const CHAPTER_INFO = {
  name: "AI STUDENT CHAPTER",
  shortName: "AISC",
  institution: "RCPET's Institute of Management Research & Development (IMRD), Shirpur",
  tagline: "BUILD THE FUTURE WITH AI.",
  subTagline: "A student-driven community exploring artificial intelligence, machine learning, research, innovation and real-world technology.",
  shortPositioning: "Building. Learning. Researching. Innovating with AI.",
  contactEmail: "imrdaistudentclub@gmail.com",
  instagram: "https://www.instagram.com/ai.student_chapters/",
  whatsappGroup: "https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv",
  github: "https://github.com/ai-student-chapter",
};

export const HERO_CONTENT = {
  badge: "OCTOBER 2026 / SHIRPUR, MH • IN-PERSON & HYBRID",
  headlineFirst: "BUILD THE FUTURE WITH AI.",
  headlineSecond: "AI Student Chapter’s flagship developer collective uniting students, agents, and real-world code to build what's next.",
  description: "A student-driven community exploring artificial intelligence, machine learning, research, innovation, and production software.",
  primaryCTA: "GET PASSES",
  secondaryCTA: "EXPLORE SESSIONS",
};

export const CORE_PRINCIPLES = [
  {
    number: "01",
    title: "LEARN",
    subtitle: "Practical AI & Machine Learning",
    description: "Demystify neural architectures, LLM prompt engineering, and transformer models through hands-on student labs.",
  },
  {
    number: "02",
    title: "BUILD",
    subtitle: "Production Systems & Vibe Coding",
    description: "Move from notebooks to fullstack AI native applications and autonomous tools in high-energy sprint environments.",
  },
  {
    number: "03",
    title: "RESEARCH",
    subtitle: "Cutting-Edge Literature & Benchmarks",
    description: "Read groundbreaking papers, evaluate local model quantization, and experiment with agentic framework designs.",
  },
  {
    number: "04",
    title: "COLLABORATE",
    subtitle: "Cross-Disciplinary Pods",
    description: "Unite programmers, designers, researchers, and domain thinkers to solve real-world problems together.",
  },
  {
    number: "05",
    title: "INNOVATE",
    subtitle: "Campus & Industry Impact",
    description: "Deploy community certificate software, academic study hubs, and high-impact hackathon projects.",
  },
];

export const CHAPTER_STATS: ChapterStat[] = [
  {
    value: 33,
    suffix: "+",
    label: "Hackathon Builders",
    subtext: "Competed at Code Carnival 2026 across UG & PG tracks",
  },
  {
    value: 10,
    suffix: "+",
    label: "Technical Workshops",
    subtext: "Hands-on labs in Vibe Coding, PyTorch & LLMs",
  },
  {
    value: 100,
    suffix: "%",
    label: "Student Driven",
    subtext: "Peer-to-peer knowledge sharing and collaborative building",
  },
  {
    value: 2,
    suffix: "+",
    label: "Live Open Tools",
    subtext: "AISC Certificate Studio & Student Academic Portal",
  },
];

export const INITIATIVES: InitiativeItem[] = [
  {
    id: "ai-ml",
    number: "01",
    title: "AI & Machine Learning",
    description: "Deep dive into machine learning fundamentals, computer vision, natural language processing, and generative AI models.",
    icon: "BrainCircuit",
    features: ["PyTorch & TensorFlow Labs", "LLM Prompting & RAG", "Fine-Tuning Local Models", "Computer Vision Systems"],
    accentColor: "green",
  },
  {
    id: "coding-dev",
    number: "02",
    title: "Coding & Development",
    description: "Accelerate development using modern Vibe Coding workflows, AI coding assistants, and fullstack TypeScript/Python stacks.",
    icon: "Code2",
    features: ["Vibe Coding Methodologies", "Next.js & Vite AI Apps", "API Integration & Cloud", "Git & Developer Workflows"],
    accentColor: "dark",
  },
  {
    id: "research-inn",
    number: "03",
    title: "Research & Innovation",
    description: "Rigorous academic reading groups, paper reviews, and experimental student publications exploring emerging AI frontiers.",
    icon: "Microscope",
    features: ["Paper Reading Seminars", "Agentic System Design", "AI Safety & Ethics", "Student Research Papers"],
    accentColor: "blue",
  },
  {
    id: "hackathons",
    number: "04",
    title: "Hackathons & Build Sprints",
    description: "Fast-paced, timed coding tournaments where student teams build working AI prototypes under pressure.",
    icon: "Zap",
    features: ["6-Hour Sprint Formats", "UG & PG Competitive Tracks", "Live Pitching & Demos", "Industry & Faculty Mentors"],
    accentColor: "green",
  },
  {
    id: "workshops",
    number: "05",
    title: "Technical Workshops",
    description: "Interactive learning sessions designed for all skill levels—from first-line Python coders to advanced model deployers.",
    icon: "GraduationCap",
    features: ["Zero-to-Hero Coding", "Prompt Engineering Masterclasses", "Tooling & Environment Setup", "Certificate Awarding"],
    accentColor: "dark",
  },
  {
    id: "mentoring",
    number: "06",
    title: "Technical Mentoring",
    description: "One-on-one and pod-based guidance from technical leads, alumni, and faculty advisors to accelerate career readiness.",
    icon: "Users",
    features: ["Project Guidance", "Resume & Portfolio Reviews", "Hackathon Prep Labs", "Open-Source Support"],
    accentColor: "green",
  },
];

export const EVENTS: EventItem[] = [
  {
    id: "code-carnival-2026",
    title: "Code Carnival 2026: 6-Hour Offline AI Build Sprint",
    category: "Hackathon",
    date: "2026-03-24",
    time: "09:00 AM - 03:00 PM",
    location: "RCPIMRD Computer Labs, Shirpur",
    description: "Maharashtra's premier 6-hour offline student hackathon where 33 participants competed across UG & PG streams to build AI prototypes under intense sprint pressure.",
    featured: true,
    status: "Completed",
    image: "/images/code-carnival-banner.webp",
    participantsCount: 33,
    duration: "6 Hours",
    tags: ["Hackathon", "AI Build", "Offline Sprint", "UG & PG"],
  },
  {
    id: "vibe-coding-masterclass",
    title: "Vibe Coding & Agentic AI Masterclass",
    category: "Workshop",
    date: "2026-04-15",
    time: "10:30 AM - 01:30 PM",
    location: "Main Auditorium, RCPIMRD",
    description: "Learn how to orchestrate autonomous AI agents and use intent-driven prompting to write software 10x faster.",
    featured: false,
    status: "Registration Open",
    duration: "3 Hours",
    tags: ["Agentic AI", "Prompt Engineering", "Vite & React"],
    registrationUrl: "https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv",
  },
  {
    id: "ml-foundations-session",
    title: "Hands-On Intro to Machine Learning & Neural Networks",
    category: "Workshop",
    date: "2026-02-18",
    time: "02:00 PM - 05:00 PM",
    location: "Lab 3, RCPIMRD",
    description: "Step-by-step introduction to supervised learning, gradient descent, matrix math, and neural net training using Python.",
    featured: false,
    status: "Completed",
    duration: "3 Hours",
    tags: ["Python", "Machine Learning", "Neural Networks"],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "aisc-certificate-studio",
    title: "AISC Certificate Studio",
    category: "AI & Automation Web App",
    description: "High-performance web tool built for generating bulk custom event certificates instantly from PDF/Excel inputs.",
    techStack: ["React", "TypeScript", "Canvas API", "TailwindCSS"],
    team: ["Krishna Chandrakant Patil"],
    year: "2026",
    demoUrl: "https://certificate-aisc.vercel.app/",
    githubUrl: "https://github.com/ai-student-chapter/certificate-studio",
    featured: true,
    badge: "LIVE TOOL",
    image: "/images/event1.jpg",
  },
  {
    id: "studymaterial-central",
    title: "AISC Student Study Portal",
    category: "Academic Resource System",
    description: "Centralized repository providing MCA & IMCA students with curated AI notes, syllabus guides, code snippets, and presentation slides.",
    techStack: ["Vite", "React", "PDF Viewer"],
    team: ["Krishna Chandrakant Patil"],
    year: "2026",
    demoUrl: "/studymeterial.pdf",
    featured: false,
    badge: "PDF HUB",
    image: "/images/event2.webp",
  },
];

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "res-01",
    number: "01",
    title: "Vibe Coding: Evaluating Intent-Driven Prompt Engineering in Rapid Student Hackathons",
    authors: ["Krishna Chandrakant Patil (Technical Head)", "Dr. M. N. Behere"],
    abstract: "This study investigates how high-level intent synthesis and LLM pair-programming change speed, architectural quality, and debugging velocity in 6-hour hackathons.",
    tags: ["Vibe Coding", "Prompt Engineering", "Developer Productivity"],
    date: "March 2026",
    readUrl: "/sessions",
  },
];

export const ACHIEVEMENTS = [
  {
    year: "2024",
    title: "FOUNDATION & CHARTER",
    description: "Official formation of the AI Student Chapter at RCPET's IMRD under the guidance of Hon. HOD Dr. M. N. Behere.",
    milestones: ["Chapter Charter Signed", "Technical Infrastructure Setup", "Initial Member Onboarding"],
  },
  {
    year: "2025",
    title: "EXPANSION & TOOLING",
    description: "Scaled hands-on technical workshops, developed internal certificate automation software, and built open student tools.",
    milestones: ["10+ Technical Workshops", "AISC Certificate Studio Launch", "300+ Student Touchpoints"],
  },
  {
    year: "2026",
    title: "CODE CARNIVAL HACKATHON",
    description: "Hosted Code Carnival 2026—a premier 6-hour offline build sprint with 33 participants across UG & PG categories.",
    milestones: ["Code Carnival Hackathon", "Light Editorial Platform Launch", "Student Research Papers"],
  },
];

export const TEAM_POSITION_HOLDERS: TeamMember[] = [
  {
    id: 1,
    name: "Chirag Behere",
    role: "President",
    classCategory: "IMCA",
    image: "/team/Chirag%20Behere.jpg",
    emoji: "👑",
    expertise: ["President", "Leadership", "Strategy"],
    isLeader: true,
  },
  {
    id: 2,
    name: "Mansvi Patil",
    role: "Vice President",
    classCategory: "MCA-I",
    image: "/team/Mansvi%20Patil%20Vice%20President.jpg",
    emoji: "⭐",
    expertise: ["Vice President", "Leadership", "Community Management"],
    isLeader: true,
  },
  {
    id: 3,
    name: "Moin Ansari",
    role: "Secretary",
    classCategory: "IMCA",
    image: "/team/Moin%20Ansari%20Secretary.jpg",
    emoji: "📋",
    expertise: ["Secretary", "Operations", "Communication"],
    isLeader: true,
  },
  {
    id: 4,
    name: "Krishna Chandrakant Patil",
    role: "Technical Head",
    classCategory: "MCA-I",
    image: "/team/Tech%20head.jpg",
    emoji: "💻",
    expertise: ["Technical Head", "System Architecture", "Vibe Coding", "AI Systems"],
    isLeader: true,
  },
  {
    id: 5,
    name: "Tejas Aaba Bagul",
    role: "Operations & Logistics Head",
    classCategory: "IMCA",
    image: "/team/TejasLogistics.jpg",
    emoji: "📦",
    expertise: ["Operations", "Logistics", "Event Support"],
    isLeader: true,
  },
  {
    id: 6,
    name: "Ruchita Prabhakar Chaudhari",
    role: "Event Manager",
    classCategory: "IMCA",
    image: "/team/Ruchita%20prabhakar%20chaudhari%20Event%20Manager.jpg",
    emoji: "🎯",
    expertise: ["Event Manager", "Event Planning", "Community Engagement"],
    isLeader: true,
  },
  {
    id: 7,
    name: "Purushottam Kishor Patil",
    role: "Camera Head",
    classCategory: "IMCA",
    image: "/team/PurushottamPatilCameraHead.jpg",
    emoji: "📸",
    expertise: ["Camera Head", "Photography", "Media Production"],
    isLeader: true,
  },
  {
    id: 8,
    name: "Shrikant Dinesh Borase",
    role: "Documentation Head",
    classCategory: "IMCA",
    image: "/team/Shrikant%20Borase.jpg",
    emoji: "📝",
    expertise: ["Documentation Head", "Technical Writing", "Reports & Records"],
    isLeader: true,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 9,
    name: "Kshatriya Soham Shailkant",
    role: "Member",
    classCategory: "IMCA",
    image: "/team/Kshatriya%20Soham%20Shailkant%20Members.jpg",
    emoji: "👥",
    expertise: ["Member", "Student Community"],
    isLeader: false,
  },
  {
    id: 10,
    name: "Shrawani Vilas Wankhede",
    role: "Member",
    classCategory: "MCA-I",
    image: "/team/Shrawani%20Vilas%20Wankhede%20Member.jpg",
    emoji: "✨",
    expertise: ["Member", "Community Engagement"],
    isLeader: false,
  },
];

export const FACULTY_ADVISORS: FacultyAdvisor[] = [];

export const COMMUNITY_PILLARS = [
  {
    icon: "GraduationCap",
    title: "Learn From Peers",
    description: "Engage in collaborative workshops led by experienced student leads who break down complex AI concepts.",
  },
  {
    icon: "Code2",
    title: "Build Real Software",
    description: "Move past simple tutorials and ship tools that solve actual problems for students and campus initiatives.",
  },
  {
    icon: "Award",
    title: "Meet Faculty & Mentors",
    description: "Direct guidance from department leaders and technical advisors guiding career roadmap decisions.",
  },
  {
    icon: "Zap",
    title: "Participate in Hackathons",
    description: "Experience high-energy 6-hour build sprints where speed, creativity, and AI tooling turn ideas into reality.",
  },
];
