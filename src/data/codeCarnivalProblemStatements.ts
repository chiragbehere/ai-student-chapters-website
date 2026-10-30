// codeCarnivalProblemStatements.ts
// Official Code-Carnival Hackathon Problem Statements & Judging Criteria
// Theme: Open Innovation | AI Student Chapter, RCPET's IMRD

export interface ProblemStatement {
  id: string;
  number: number;
  title: string;
  trackId: 'track-a' | 'track-b' | 'track-c' | 'track-d' | 'track-e';
  trackName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  domains: string[];
  context: string;
  challenge: string;
  expectedOutcome: string;
  note: string;
}

export interface ProblemTrack {
  id: 'track-a' | 'track-b' | 'track-c' | 'track-d' | 'track-e';
  code: string;
  name: string;
  tagline: string;
  accent: string;
  statementCount: number;
}

export const HACKATHON_DOMAINS = [
  'Artificial Intelligence & Machine Learning',
  'Web Development',
  'Mobile App Development',
  'Cybersecurity',
  'Blockchain',
  'Internet of Things (IoT)',
  'EdTech (Education Technology)',
  'HealthTech',
  'FinTech',
  'Open Innovation (Any Creative Technology Solution)',
];

export const PROBLEM_TRACKS: ProblemTrack[] = [
  {
    id: 'track-a',
    code: 'TRACK_A',
    name: 'Digital Safety & Trust',
    tagline: 'Defend citizens and students against digital coercion, laundering graphs, and cloned threats.',
    accent: '#ff0044',
    statementCount: 4,
  },
  {
    id: 'track-b',
    code: 'TRACK_B',
    name: 'Health & Wellbeing',
    tagline: 'Combat drug resistance, verify authentic medicines, and decode healthcare for vulnerable citizens.',
    accent: '#00e5ff',
    statementCount: 4,
  },
  {
    id: 'track-c',
    code: 'TRACK_C',
    name: 'Food, Water & Climate',
    tagline: 'Prevent post-harvest spoilage, preserve depleted groundwater, and route surplus nutrition.',
    accent: '#00ff66',
    statementCount: 4,
  },
  {
    id: 'track-d',
    code: 'TRACK_D',
    name: 'Civic Life & Livelihoods',
    tagline: 'Predict road black-spots, navigate welfare schemes, and empower gig workers.',
    accent: '#ffaa00',
    statementCount: 4,
  },
  {
    id: 'track-e',
    code: 'TRACK_E',
    name: 'Education, Access & Responsible AI',
    tagline: 'Bridge opportunity gaps, break classroom disability barriers, and audit AI hallucinations.',
    accent: '#a855f7',
    statementCount: 4,
  },
];

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  // ── TRACK A: Digital Safety & Trust ──
  {
    id: 'ps-01',
    number: 1,
    title: 'Digital-Arrest Scam Shield',
    trackId: 'track-a',
    trackName: 'Track A: Digital Safety & Trust',
    level: 'Advanced',
    domains: ['AI/ML', 'Cybersecurity', 'FinTech'],
    context:
      'In a digital-arrest scam, fraudsters pose as police, customs or investigators on a call or video chat and pressure victims into transferring money. The weapon is fear and urgency, and there is no legal procedure called digital arrest in India. Thousands of people, many of them elderly or first-time smartphone users, lose savings this way.',
    challenge:
      'Build a real-time coercion-detection assistant that analyses a call transcript or chat in progress, flags the scripted patterns of an impersonation scam (authority claims, isolation, secrecy, urgent transfer demands) and warns the user and a trusted contact before money moves.',
    expectedOutcome:
      'A working prototype that scores conversations for scam risk, explains which signals triggered the alert, supports at least two Indian languages, and reports precision and recall on a labelled simulated dataset.',
    note: 'Use only synthetic or publicly shared scam scripts. Do not record real calls. State false-positive risks clearly.',
  },
  {
    id: 'ps-02',
    number: 2,
    title: 'Money-Mule Early-Warning Graph',
    trackId: 'track-a',
    trackName: 'Track A: Digital Safety & Trust',
    level: 'Advanced',
    domains: ['AI/ML', 'FinTech', 'Cybersecurity'],
    context:
      'Stolen money rarely stays in one account. Fraud rings route it through chains of mule accounts, often opened by students and gig workers for a small fee, within minutes. Banks see single transactions, but the pattern only appears when the network is viewed as a graph.',
    challenge:
      'Develop a graph-based anomaly detector that ingests simulated transaction logs, identifies likely mule accounts and laundering paths, and ranks accounts by risk.',
    expectedOutcome:
      'A dashboard that visualises suspicious transaction clusters, assigns explainable risk scores and compares graph-based detection with a simple rule-based baseline.',
    note: 'Generate a realistic synthetic transaction dataset and document how fraud behaviour was simulated. No real customer data may be used.',
  },
  {
    id: 'ps-03',
    number: 3,
    title: 'Fake Job and Loan-App Verifier for Students',
    trackId: 'track-a',
    trackName: 'Track A: Digital Safety & Trust',
    level: 'Intermediate',
    domains: ['Cybersecurity', 'AI/ML', 'Web Development'],
    context:
      'Final-year students and fresh graduates are prime targets for fake internship offers, registration-fee job scams and predatory instant-loan apps that harvest contacts and photos and then harass borrowers. Students rarely have a quick way to check whether an offer or app is genuine.',
    challenge:
      'Build a verification tool where a user pastes an offer letter, recruiter message or app description and receives a trust assessment with reasons: suspicious fee requests, mismatched domains, excessive app permissions, unrealistic pay and similar red flags.',
    expectedOutcome:
      'A web or mobile tool that classifies offers as safe, suspicious or high-risk, highlights the exact phrases or permissions behind the verdict and gives next steps such as where to report.',
    note: 'Classification must rest on features and patterns you can explain. A language model may help summarise but must not be the only decision-maker.',
  },
  {
    id: 'ps-04',
    number: 4,
    title: 'Voice-Clone Safe Word for Families',
    trackId: 'track-a',
    trackName: 'Track A: Digital Safety & Trust',
    level: 'Intermediate',
    domains: ['AI/ML', 'Cybersecurity', 'Mobile App Development'],
    context:
      'AI voice cloning can imitate a relative from a few seconds of audio, and urgent calls claiming a family member is in trouble are a growing scam pattern. Families have no simple, shared way to confirm that the caller is who they claim to be.',
    challenge:
      'Design a family verification system that combines rotating challenge phrases, caller-behaviour checks and basic synthetic-speech indicators to help a user decide whether an urgent call can be trusted.',
    expectedOutcome:
      'A prototype app or bot that sets up a private verification circle, runs a challenge-response check during a suspicious call and reports its confidence along with its limits.',
    note: 'Be honest about detection accuracy. Evaluate only on open speech datasets or self-recorded, consented samples.',
  },

  // ── TRACK B: Health & Wellbeing ──
  {
    id: 'ps-05',
    number: 5,
    title: 'Antibiotic Course Guardian',
    trackId: 'track-b',
    trackName: 'Track B: Health & Wellbeing',
    level: 'Intermediate',
    domains: ['HealthTech', 'AI/ML', 'Mobile App Development'],
    context:
      "People in India often take antibiotics without a prescription, stop once they feel better, or reuse leftover tablets. This fuels drug-resistant infections, one of the country's most serious long-term health threats, and rural patients get little guidance on correct use.",
    challenge:
      'Build a companion app that helps a patient complete a prescribed course: reminders, plain-language explanations in local languages, side-effect check-ins, warnings against sharing or reusing leftovers, and an alert when doses are missed.',
    expectedOutcome:
      'A working app with adherence tracking, risk nudges, a simple clinician or family summary and a basic model that predicts which patients are likely to drop out of a course.',
    note: 'Provide general safety information only, not diagnosis. Include a clear disclaimer and a route to a qualified professional.',
  },
  {
    id: 'ps-06',
    number: 6,
    title: 'Medicine Authenticity and Stock Finder',
    trackId: 'track-b',
    trackName: 'Track B: Health & Wellbeing',
    level: 'Intermediate',
    domains: ['HealthTech', 'Blockchain', 'Web Development'],
    context:
      'Patients struggle to confirm whether a medicine is genuine and often cannot tell which nearby pharmacy has a low-cost generic in stock. Poor-quality and falsified medicines are a recognised global problem, and stockouts of essential drugs are common in public facilities.',
    challenge:
      'Create a batch-verification and availability platform that lets a user scan or enter a medicine batch code, check it against a registered record and see which participating pharmacies hold stock.',
    expectedOutcome:
      'A prototype with batch verification (a tamper-evident ledger or signed records), a pharmacy stock view and an alert flow for suspicious batches.',
    note: 'Use simulated manufacturer and pharmacy data. Describe how a real deployment would obtain trusted records.',
  },
  {
    id: 'ps-07',
    number: 7,
    title: 'Campus Wellbeing Early-Signal System',
    trackId: 'track-b',
    trackName: 'Track B: Health & Wellbeing',
    level: 'Advanced',
    domains: ['AI/ML', 'HealthTech', 'EdTech'],
    context:
      'Student distress often goes unnoticed until it becomes a crisis. Counsellors are scarce, students hesitate to ask for help, and institutions have no private, consent-based way to notice patterns such as sustained disengagement or sleep disruption.',
    challenge:
      'Build a privacy-first wellbeing check-in platform with short anonymous check-ins, opt-in signals, trend analysis and a pathway that connects students to counsellors and helplines when patterns suggest they may need support.',
    expectedOutcome:
      'A prototype that gathers consented check-in data, detects meaningful changes over time, shows aggregate non-identifying campus insights to administrators and offers individual support options.',
    note: 'This is a sensitive area. The system must never diagnose, never expose individual data without consent and must show crisis resources prominently. Describe your ethical safeguards.',
  },
  {
    id: 'ps-08',
    number: 8,
    title: 'Prescription Decoder for Low-Literacy Patients',
    trackId: 'track-b',
    trackName: 'Track B: Health & Wellbeing',
    level: 'Beginner',
    domains: ['HealthTech', 'AI/ML', 'Mobile App Development'],
    context:
      'Handwritten prescriptions and tiny dosage instructions are hard to read, especially for older and low-literacy patients. Misreading a dose or timing causes avoidable harm.',
    challenge:
      'Build an app that takes a photo or typed prescription and produces a simple daily schedule with icons, voice read-out and regional-language text, with a reminder for each dose.',
    expectedOutcome:
      'A functional app that converts prescription text into a clear medication timetable, with a confirmation step so the user or caregiver can correct any misread item.',
    note: 'The tool supports reading, not prescribing. Always require human confirmation and advise consulting the doctor or pharmacist.',
  },

  // ── TRACK C: Food, Water & Climate ──
  {
    id: 'ps-09',
    number: 9,
    title: 'Post-Harvest Spoilage Risk Router',
    trackId: 'track-c',
    trackName: 'Track C: Food, Water & Climate',
    level: 'Advanced',
    domains: ['AI/ML', 'IoT', 'Open Innovation'],
    context:
      "A large share of India's food is lost between farm and market because of poor storage, transport delays and weak cold-chain access. Small and marginal farmers bear the loss directly, often selling distressed produce at low prices.",
    challenge:
      'Build a spoilage-risk and routing engine that, given crop type, harvest date, weather, distance and available storage or markets, predicts spoilage risk and recommends where and when a farmer should sell or store.',
    expectedOutcome:
      'A decision tool that predicts spoilage risk for common perishables, ranks sell, store or process options by expected income and shows the estimated loss avoided compared with a naive choice.',
    note: 'Use public weather and mandi price data or realistic simulation. State shelf-life assumptions and their sources.',
  },
  {
    id: 'ps-10',
    number: 10,
    title: 'Groundwater-Aware Crop and Irrigation Advisor',
    trackId: 'track-c',
    trackName: 'Track C: Food, Water & Climate',
    level: 'Intermediate',
    domains: ['AI/ML', 'IoT', 'Open Innovation'],
    context:
      "Farmers in water-stressed regions keep planting water-hungry crops because they lack simple, local guidance on how much water a crop will really consume, while a notable share of the country's groundwater units are classified as over-exploited.",
    challenge:
      'Build an advisor that recommends crops and irrigation schedules for a plot based on soil, rainfall forecast, water availability and crop water need, while estimating income and water use for each option.',
    expectedOutcome:
      'A prototype that compares at least three crop choices on water use, expected profit and risk, and explains its recommendation in simple language.',
    note: 'Use open soil, rainfall and crop-requirement datasets or clearly documented simulated values.',
  },
  {
    id: 'ps-11',
    number: 11,
    title: 'Hyperlocal Surplus Food Rescue Router',
    trackId: 'track-c',
    trackName: 'Track C: Food, Water & Climate',
    level: 'Intermediate',
    domains: ['Web Development', 'Mobile App Development', 'AI/ML'],
    context:
      'Weddings, hostels, canteens and restaurants regularly end up with edible surplus while shelters and community kitchens nearby go short. The barrier is coordination: who has food, how long it stays safe, and who can collect it in time.',
    challenge:
      'Create a matching and logistics platform that lets donors post surplus, estimates its safe consumption window and routes it to the nearest suitable receiver with volunteer pick-up.',
    expectedOutcome:
      'A working app with donor and receiver flows, shelf-life-aware matching, route and timing suggestions and an impact dashboard (meals rescued, distance, time).',
    note: 'Food-safety rules must be handled responsibly. Document your safety assumptions and verify them against reliable guidance.',
  },
  {
    id: 'ps-12',
    number: 12,
    title: 'Household E-Waste Value Finder',
    trackId: 'track-c',
    trackName: 'Track C: Food, Water & Climate',
    level: 'Beginner',
    domains: ['Web Development', 'Mobile App Development', 'Open Innovation'],
    context:
      'Homes store old phones, chargers and gadgets because people do not know whether they are worth selling, repairing or recycling, or where a safe drop-off is. Much e-waste ends up in the informal sector, which can contaminate soil and harm workers.',
    challenge:
      'Build a simple tool where a user lists an old device and gets an estimated resale or recycling value, a repair-versus-recycle suggestion and nearby certified collection points.',
    expectedOutcome:
      'A web or mobile app with a device inventory, value estimation, a collection-point finder and a running tally of e-waste responsibly diverted.',
    note: 'Use sample listings and simulated collection-point data. Explain how value estimates are calculated.',
  },

  // ── TRACK D: Civic Life & Livelihoods ──
  {
    id: 'ps-13',
    number: 13,
    title: 'Road Black-Spot Reporter and Predictor',
    trackId: 'track-d',
    trackName: 'Track D: Civic Life & Livelihoods',
    level: 'Advanced',
    domains: ['AI/ML', 'IoT', 'Open Innovation'],
    context:
      'Road crashes kill well over a lakh of people in India each year, with over-speeding and hit-and-run incidents among the main causes. Dangerous stretches are often known to locals long before they are fixed, but reports are scattered and rarely reach the right authority in usable form.',
    challenge:
      'Build a crowdsourced hazard reporting and risk prediction system: citizens report potholes, missing signage and near-misses, and the system clusters reports, predicts high-risk stretches and prepares a ready-to-file complaint for the relevant authority.',
    expectedOutcome:
      'A map-based prototype that clusters reports, scores stretches by risk using simulated or open crash data and exports a structured complaint.',
    note: 'Protect reporter privacy. Use open or simulated accident data and state its limitations.',
  },
  {
    id: 'ps-14',
    number: 14,
    title: 'Government Scheme Eligibility Navigator',
    trackId: 'track-d',
    trackName: 'Track D: Civic Life & Livelihoods',
    level: 'Intermediate',
    domains: ['AI/ML', 'Web Development', 'Open Innovation'],
    context:
      'Many citizens never claim welfare benefits, scholarships or subsidies they qualify for, because information is scattered across portals, written in complex language and tied to shifting eligibility rules.',
    challenge:
      'Build a navigator that asks simple questions in a local language, matches the person against scheme rules, lists the benefits they likely qualify for and gives a document checklist and application steps.',
    expectedOutcome:
      'A working tool with a structured rule base for at least 15 schemes, a conversational or form interface, eligibility reasoning shown to the user and a printable checklist.',
    note: 'Eligibility must come from your rule engine and verified scheme data, not free text generation. Show source links and state that final eligibility is decided by the authority.',
  },
  {
    id: 'ps-15',
    number: 15,
    title: 'Gig Worker Earnings Transparency Tool',
    trackId: 'track-d',
    trackName: 'Track D: Civic Life & Livelihoods',
    level: 'Intermediate',
    domains: ['FinTech', 'Mobile App Development', 'AI/ML'],
    context:
      'Delivery and ride-hailing workers often cannot see how much they truly earn after fuel, maintenance, idle time and platform deductions, and they have little evidence when pay rules change or accounts are suspended.',
    challenge:
      'Create a personal earnings ledger where a worker logs or imports trips, sees true net hourly income, spots unusual pay changes and receives suggestions on the most profitable hours and zones.',
    expectedOutcome:
      'A prototype that computes net earnings, flags anomalies, forecasts weekly income and generates a simple evidence report the worker can keep.',
    note: 'Use simulated trip data. Do not scrape platforms or violate any terms of service.',
  },
  {
    id: 'ps-16',
    number: 16,
    title: 'Hyperlocal Heat and Flood Micro-Alerts',
    trackId: 'track-d',
    trackName: 'Track D: Civic Life & Livelihoods',
    level: 'Beginner',
    domains: ['IoT', 'Web Development', 'Mobile App Development'],
    context:
      'City-wide weather warnings are too coarse for people living in low-lying or heat-trapping neighbourhoods. Residents of dense settlements need alerts that reflect their own street and tell them what to do.',
    challenge:
      'Build a neighbourhood alert system that combines forecast data, simple terrain or drainage information and resident reports to issue localised heat and flooding alerts with practical advice.',
    expectedOutcome:
      'A web or mobile app with ward-level risk levels, resident-reported conditions, alert messages in local languages and a record of past alerts.',
    note: 'Use open weather data and simulated terrain inputs. Make clear that alerts are advisory.',
  },

  // ── TRACK E: Education, Access & Responsible AI ──
  {
    id: 'ps-17',
    number: 17,
    title: 'Skill-to-Opportunity Gap Mapper',
    trackId: 'track-e',
    trackName: 'Track E: Education, Access & Responsible AI',
    level: 'Intermediate',
    domains: ['EdTech', 'AI/ML', 'Web Development'],
    context:
      'Students in smaller towns often do not know which skills employers actually ask for, or how far their current profile is from a target role. Generic career advice does not close that gap.',
    challenge:
      "Build a gap-analysis platform that compares a student's skills and projects with requirements extracted from a set of job descriptions, and produces a ranked, time-bound learning plan with free resources.",
    expectedOutcome:
      "A prototype that parses job postings, scores a student's match, identifies the highest-impact missing skills and produces a week-by-week plan.",
    note: 'Use public or simulated job-description datasets. Document how skills are extracted and weighted.',
  },
  {
    id: 'ps-18',
    number: 18,
    title: 'Scholarship Match and Deadline Agent',
    trackId: 'track-e',
    trackName: 'Track E: Education, Access & Responsible AI',
    level: 'Beginner',
    domains: ['EdTech', 'Web Development', 'Open Innovation'],
    context:
      'Students miss scholarships because they do not hear about them, cannot tell whether they qualify, or lose track of documents and deadlines.',
    challenge:
      'Create a scholarship finder that profiles a student (course, category, income band, state), shows matching scholarships, tracks required documents and sends deadline reminders.',
    expectedOutcome:
      'A working web or mobile app with a searchable scholarship database, an eligibility filter, a document checklist and reminders.',
    note: 'Use a manually compiled or simulated dataset. Link to official sources and never promise eligibility.',
  },
  {
    id: 'ps-19',
    number: 19,
    title: 'Classroom Sign-and-Speech Bridge',
    trackId: 'track-e',
    trackName: 'Track E: Education, Access & Responsible AI',
    level: 'Advanced',
    domains: ['AI/ML', 'EdTech', 'Mobile App Development'],
    context:
      'Students who are deaf, hard of hearing or have speech difficulties often sit in classes without live captioning, notes or a way to take part, and sign-language interpreters are scarce.',
    challenge:
      'Build a real-time accessibility tool that converts lecture speech into captions and key-point notes, and offers a way for a student to respond through text, symbols or simple sign recognition.',
    expectedOutcome:
      'A prototype with live captioning, an auto-generated lecture summary, a searchable transcript and at least one student-to-class response mode.',
    note: 'Report accuracy honestly, including on accents and technical terms. Involve accessibility guidance where possible.',
  },
  {
    id: 'ps-20',
    number: 20,
    title: 'AI Answer Checker for Student Research',
    trackId: 'track-e',
    trackName: 'Track E: Education, Access & Responsible AI',
    level: 'Intermediate',
    domains: ['AI/ML', 'EdTech', 'Open Innovation'],
    context:
      'Students increasingly rely on AI tools for assignments, yet these tools can state wrong facts or invent citations with great confidence. Students rarely have a quick way to check what they have been told.',
    challenge:
      'Build a claim-verification assistant that breaks an AI-generated answer into individual claims, checks each against a provided source set, and marks each as supported, contradicted or unverifiable, with the supporting passage.',
    expectedOutcome:
      'A working tool that extracts claims, retrieves evidence from a document collection, labels each claim and shows an overall reliability score, evaluated on a small hand-labelled test set.',
    note: 'Verification must rely on retrieval and your own scoring logic, not on asking a model to simply say whether the answer is true. Report accuracy on your test set.',
  },
];

export const JUDGING_CRITERIA = [
  { label: 'Technical depth and meaningful use of AI or data', weight: 25 },
  { label: 'Problem understanding and real-world relevance', weight: 20 },
  { label: 'Working prototype and demo quality', weight: 20 },
  { label: 'Explainability, safety and ethics', weight: 15 },
  { label: 'Innovation and originality', weight: 10 },
  { label: 'Presentation, assumptions and limitations stated', weight: 10 },
];

export const GENERAL_RULES = [
  'RULE OF SELECTION: Each participating squad may choose ONLY ONE problem statement across all tracks.',
  'Teams may pick any statement from any track, but must concentrate entirely on delivering one exceptional solution.',
  'Teams may use public datasets or realistic simulated data. Never use real personal, financial or health records.',
  'Every submission must state its data sources, assumptions and limitations.',
  'Where AI is used, it must contribute to analysis, prediction or ranking, not only to generating text.',
  'Health, safety and finance tools provide guidance only and must never replace professionals or official channels.',
  'Teams should show at least one measurable result, such as accuracy, time saved, loss avoided or users reached.',
  'Source code must be pushed to a public GitHub repository prior to the freeze.',
];

