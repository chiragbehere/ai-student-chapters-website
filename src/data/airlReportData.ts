// airlReportData.ts
// Official detailed report & winners declaration for AI Research League 2.0 (AY 2026-27)
// Sourced with 100% precision from report-airl-2.pdf

export interface WinningTeam {
  rank: string;
  rankBadge: string;
  rankColor: string;
  teamName: string;
  teamId: string;
  category: string;
  division: 'Postgraduate' | 'Undergraduate';
  projectTitle: string;
  leader: string;
  members: string[];
  specialNote?: string;
  photoUrl?: string;
}

export interface IndustryJudge {
  name: string;
  designation: string;
  company: string;
  note?: string;
}

export interface ScoringCriterion {
  name: string;
  points: number;
  description: string;
}

export interface AIRLReport {
  eventName: string;
  academicYear: string;
  organizedBy: string;
  eventDate: string;
  displayDate: string;
  venue: string;
  targetParticipants: string;
  registeredCount: number;
  ugCount: number;
  pgCount: number;
  totalTeams: number;
  ugTeamsCount: number;
  pgTeamsCount: number;
  pdfUrl: string;
  evaluationFramework: string;
  needOfActivity: string;
  objectives: string[];
  preparatoryWorkshops: {
    title: string;
    description: string;
    leads: string;
  }[];
  problemStatementDomains: string[];
  scheduleSessions: {
    session: string;
    time: string;
    highlights: string[];
  }[];
  judges: IndustryJudge[];
  scoringRubric: ScoringCriterion[];
  winners: WinningTeam[];
  prizeDistribution: string[];
  outcomes: string[];
  photos: {
    caption: string;
    url: string;
    category: string;
  }[];
}

export const AIRL_2_REPORT: AIRLReport = {
  eventName: "AI Research League 2.0 – 2026",
  academicYear: "AY 2026-27",
  organizedBy: "AI Student Chapter (AISC)",
  eventDate: "2026-09-19",
  displayDate: "September 19, 2026",
  venue: "Activity Hall & Presentation Classrooms, IMRD Shirpur",
  targetParticipants: "MCA (Integrated) – II to V, MCA – I & II",
  registeredCount: 114,
  ugCount: 28,
  pgCount: 86,
  totalTeams: 36,
  ugTeamsCount: 7,
  pgTeamsCount: 29,
  pdfUrl: "/documents/report-airl-2.pdf",
  evaluationFramework: "Combined Overall Ranking across UG and PG Divisions",
  needOfActivity:
    "Research in Artificial Intelligence is a rapidly growing area, but students often face challenges in identifying meaningful real-world problems and presenting practical, research-oriented solutions. Many students focus primarily on basic application development without conducting structured research or building user-centered solution prototypes. AI Research League 2.0 – 2026 provided students with an interactive, multi-stage platform to research real-world AI challenges, develop innovative AI-driven solutions, and present their work. Moving beyond traditional slide decks, AIRL 2.0 required teams to build an interactive landing page/prototype alongside their PowerPoint presentation (PPT). This enabled students to demonstrate both theoretical depth and user-facing viability.",
  objectives: [
    "To foster a research-oriented mindset by encouraging students to investigate real-world problem statements.",
    "To give students hands-on experience in applying Artificial Intelligence tools, frameworks, and methodologies to real-world challenges.",
    "To introduce students to structured research practices, including problem formulation, literature review, and gap identification.",
    "To bridge the gap between abstract concepts and functional products by requiring interactive landing page / prototype development alongside PPT presentations.",
    "To enhance teamwork, critical thinking, logical reasoning, and technical presentation skills.",
    "To provide direct industry exposure through feedback and evaluation by expert alumni and industry leaders.",
  ],
  preparatoryWorkshops: [
    {
      title: "Awareness Sessions — 'What is AI Research League?'",
      description: "Class-level awareness and orientation delivered across IMCA-II through IMCA-V and MCA-I/II.",
      leads: "Ms. Krushnali Jadhav, Ms. Ruchita Chaudhari, Mr. Moin Ansari, Mr. Shrikant Borase, Mr. Kartik Valhe",
    },
    {
      title: "Technical Demos — 'PPT Demo & Landing Page Examples'",
      description: "Hands-on orientation on structuring research slides and developing landing pages.",
      leads: "AISC Student Presenters",
    },
    {
      title: "Faculty-Led Research Workshops — 'How to Do Research'",
      description: "Problem statement formulation, literature review methods, and research methodologies.",
      leads: "Dr. Manoj N. Behere & Mrs. Chhaya S. Patil (for IMCA II–III students)",
    },
    {
      title: "Case Study Showcases",
      description: "Demonstrations of AI solutions in social and urban challenges.",
      leads: "'Empowering Women's Safety with AI' (Ruchita Chaudhari) & 'Smart Traffic Management System' (Shrikant Borase)",
    },
    {
      title: "Mentor Meetup",
      description: "Personalized guidance pairing each registered team with dedicated faculty/peer mentors.",
      leads: "AISC Mentor Network & Faculty Mentors",
    },
  ],
  problemStatementDomains: [
    "Healthcare & Medical AI",
    "Education & Learning AI",
    "Finance & Business AI",
    "Environment & Sustainability AI",
    "Security & Law Enforcement AI",
    "Smart Cities & Daily Life AI",
    "Agriculture & Food AI",
    "Transportation & Automotive AI",
    "Retail & E-Commerce AI",
    "Sports & Entertainment AI",
    "Human Resources & Workplace AI",
    "Space, Accessibility & Manufacturing AI",
  ],
  scheduleSessions: [
    {
      session: "Session I: Pre-Competition & Multi-Stage Presentations",
      time: "10:00 AM onwards",
      highlights: [
        "Welcome address, e-inauguration, and competition overview.",
        "Director's speech emphasizing the importance of turning ideas into real-world, evidence-based solutions.",
        "Presentation rounds where teams showcased their research problem, methodology, PPTs, and interactive landing pages before the judging panel in allocated classrooms.",
      ],
    },
    {
      session: "Session II: Post-Competition & Valedictory",
      time: "03:30 PM onwards",
      highlights: [
        "Appreciation ceremony for the outgoing AI Student Chapter team.",
        "Official appointment and welcome of the incoming AI Student Chapter (AISC) executive team as they step into new leadership roles.",
        "Constructive feedback provided by the invited industry judges.",
        "Prize distribution, group photographs, and formal vote of thanks.",
      ],
    },
  ],
  judges: [
    {
      name: "Mr. Shubham Jadhav",
      designation: "Teamcenter Administrator & Support",
      company: "Tata Technologies, Pune",
      note: "Expert in enterprise software, architecture, and deployment pipelines.",
    },
    {
      name: "Mr. Sagar Badgujar",
      designation: "Lead Consultant (SAP SD)",
      company: "Hitachi Energy",
      note: "Expert in enterprise systems, business process automation, and scalable architectures.",
    },
    {
      name: "Mr. Mukesh Badgujar",
      designation: "Senior Software Developer",
      company: "Aditya Birla Capital, Thane",
      note: "MCA Alumni of IMRD, specializing in financial technology and mission-critical software.",
    },
  ],
  scoringRubric: [
    {
      name: "Problem Definition & Innovation",
      points: 10,
      description: "Assesses the clarity, relevance, and originality of the identified real-world problem statement.",
    },
    {
      name: "Technical Approach & Research Depth",
      points: 10,
      description: "Evaluates the rigor of the methodology, research depth, and understanding of technical choices and trade-offs.",
    },
    {
      name: "Feasibility & Implementation Plan",
      points: 10,
      description: "Measures the practical execution plan, constraint awareness, and usability of the interactive landing page / prototype.",
    },
    {
      name: "Impact & Ethical Considerations",
      points: 10,
      description: "Evaluates societal value, potential real-world adoption, and awareness of ethical issues and data privacy.",
    },
    {
      name: "Communication & Presentation",
      points: 10,
      description: "Assesses slide design, prototype demonstration quality, verbal communication, and handling of Q&A.",
    },
  ],
  winners: [
    {
      rank: "1st Rank (Winner)",
      rankBadge: "WINNER — 1ST PLACE",
      rankColor: "gold",
      teamName: "P4YL04D C4RT3L",
      teamId: "PG_126",
      category: "Postgraduate Division (IMCA 4th Year)",
      division: "Postgraduate",
      projectTitle: "Heuristic-Driven Kernel-Level Mitigation of Rogue HID Injections Using Statistical Anomaly Modeling",
      leader: "Aniruddha Balaji Landge",
      members: [
        "Aniruddha Balaji Landge (Team Leader)",
        "Hariom Prakash Patil",
        "Tanaya Pandharinath Patil",
        "Durvesh Sandeep Bari",
      ],
      photoUrl: "/images/airl-2/airl2_winner_1st_rank.jpg",
    },
    {
      rank: "2nd Rank",
      rankBadge: "2ND PLACE (UG COMMENDATION)",
      rankColor: "silver",
      teamName: "AQUASAKSHAM",
      teamId: "UG_103",
      category: "Undergraduate Division (IMCA 3rd Year)",
      division: "Undergraduate",
      projectTitle: "Real-Time Intelligent Water-Quality Monitoring & Risk Assessment System",
      leader: "Danish Salim Pinjari",
      members: [
        "Danish Salim Pinjari (Team Leader)",
        "Himanshu Rajendra Pawar",
        "Ashwini Ajay Pawar",
        "Janhavi Krishna Soni",
      ],
      specialNote:
        "Special appreciation noted by the judging panel for securing 2nd Rank in the combined overall standings, demonstrating high research potential among undergraduate batches.",
    },
    {
      rank: "3rd Rank",
      rankBadge: "3RD PLACE",
      rankColor: "bronze",
      teamName: "NeuroNova",
      teamId: "PG_116",
      category: "Postgraduate Division (MCA 1st Year)",
      division: "Postgraduate",
      projectTitle: "Automated Computer-Vision Sign Language Translation & Speech Conversion System",
      leader: "Afreen Irfan Pinjari",
      members: [
        "Afreen Irfan Pinjari (Team Leader)",
        "Dhanashri Yogesh Patil",
        "Ashvini Suresh Patil",
        "Ruchita Anil Kale",
      ],
    },
    {
      rank: "Runner-up Position",
      rankBadge: "RUNNER-UP",
      rankColor: "emerald",
      teamName: "Alpha Squad",
      teamId: "PG_123",
      category: "Postgraduate Division (MCA 1st Year)",
      division: "Postgraduate",
      projectTitle: "Machine Learning-Based ATM Cash Demand Prediction & Cash Replenishment System",
      leader: "Neha Bikkan Patil",
      members: [
        "Neha Bikkan Patil (Team Leader)",
        "Komal Prakash Patil",
        "Vaishnavi Nilesh Chaudhari",
      ],
    },
  ],
  prizeDistribution: [
    "Winning teams were awarded trophy mementos, official certificates of achievement, and cash prizes during the valedictory session by the Director, Department HODs, and guest judges.",
    "Special appreciation noted by the judging panel for Team AQUASAKSHAM (UG Division) for securing 2nd Rank in the combined overall standings, demonstrating exceptional research potential.",
  ],
  outcomes: [
    "Enhanced Research Capabilities: Students learned to identify real-world problems, conduct literature reviews, and define precise research questions rather than focusing solely on coding.",
    "Practical Solution Visualization: Requiring interactive landing pages/prototypes forced teams to validate user experience, functional requirements, and market feasibility.",
    "Industry Alignment: Direct interaction with industry experts provided students with practical feedback regarding real-world AI deployment and industry standards.",
    "Peer Collaboration & Confidence: Participating in a competitive, multi-session league improved student teamwork, public speaking, and technical presentation skills.",
  ],
  photos: [
    {
      caption: "Group photograph of all award-winning teams (1st Rank, 2nd Rank, 3rd Rank, and Runner-up) with industry judges, Director, and AISC coordinators.",
      url: "/images/airl-2/airl2_overall_winners_group.jpg",
      category: "Valedictory & Awards",
    },
    {
      caption: "Felicitation of Team P4YL04D C4RT3L (1st Rank) by Director and Chief Guests during the Valedictory Session.",
      url: "/images/airl-2/airl2_winner_1st_rank.jpg",
      category: "Winners",
    },
    {
      caption: "Dignitaries, Heads of Departments, Director, and the three industry judges during the Opening Session of AI Research League 2.0.",
      url: "/images/airl-2/airl2_opening_dignitaries.jpg",
      category: "Inauguration",
    },
    {
      caption: "Judges evaluating participating teams during final PowerPoint presentations and prototype demonstrations in allocated classrooms.",
      url: "/images/airl-2/airl2_classroom_eval_1.jpg",
      category: "Classroom Evaluation",
    },
    {
      caption: "Team demonstrations and live technical Q&A before industry panel.",
      url: "/images/airl-2/airl2_classroom_eval_2.jpg",
      category: "Classroom Evaluation",
    },
    {
      caption: "Interactive landing page prototype review by judge panel.",
      url: "/images/airl-2/airl2_classroom_eval_3.jpg",
      category: "Classroom Evaluation",
    },
    {
      caption: "Felicitation and appreciation of the outgoing AISC team members for their dedicated service, leadership, and contributions.",
      url: "/images/airl-2/airl2_outgoing_team.jpg",
      category: "Leadership Handover",
    },
    {
      caption: "Official appointment and welcome of the incoming AI Student Chapter (AISC) executive team as they step into their new leadership roles.",
      url: "/images/airl-2/airl2_incoming_team.jpg",
      category: "Leadership Handover",
    },
  ],
};

