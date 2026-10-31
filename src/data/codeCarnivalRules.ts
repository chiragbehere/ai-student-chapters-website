// codeCarnivalRules.ts
// Official Code Carnival 2.0 Guidelines & Event Warnings
// Source: Official AI Student Chapters Code Carnival 2.0 Poster (IMRD Shirpur)

export interface EventRule {
  id: number;
  number: string;
  title: string;
  description: string;
  tag: string;
}

export const EVENT_RULES: EventRule[] = [
  {
    id: 1,
    number: '01',
    title: 'FAIR PLAY',
    description: 'No cheating, plagiarism or misuse of AI tools. Build your own ideas.',
    tag: 'INTEGRITY',
  },
  {
    id: 2,
    number: '02',
    title: 'ORIGINAL WORK',
    description: "Projects must be your team's original idea and work.",
    tag: 'ORIGINALITY',
  },
  {
    id: 3,
    number: '03',
    title: 'TEAM RULES',
    description: 'Follow the team size limits as stated. No team changes after the start.',
    tag: 'FORMATION',
  },
  {
    id: 4,
    number: '04',
    title: 'DEADLINES',
    description: 'Submit on time. Late submissions will not be considered.',
    tag: 'TIME CONTROL',
  },
  {
    id: 5,
    number: '05',
    title: 'NO MALICIOUS ACTIVITIES',
    description: 'Do not attempt to harm, hack, spam or disrupt the event, networks or other participants.',
    tag: 'SECURITY',
  },
  {
    id: 6,
    number: '06',
    title: 'NETWORK USAGE',
    description: 'Use only the provided internet. Avoid heavy downloads, streaming or non-event activities.',
    tag: 'BANDWIDTH',
  },
  {
    id: 7,
    number: '07',
    title: 'APPROPRIATE USE OF AI TOOLS',
    description: 'Allowed tools must be used responsibly. Do not generate harmful, misleading or offensive content.',
    tag: 'RESPONSIBLE AI',
  },
  {
    id: 8,
    number: '08',
    title: 'RESPECT EVERYONE',
    description: 'Maintain a respectful, inclusive and friendly environment. No hate speech, discrimination or misconduct.',
    tag: 'CONDUCT',
  },
  {
    id: 9,
    number: '09',
    title: 'NO UNAUTHORIZED RECORDING',
    description: 'Do not record, photograph or livestream without permission.',
    tag: 'PRIVACY',
  },
  {
    id: 10,
    number: '10',
    title: 'PRESENTATION RULES',
    description: 'Only the registered team members can present. Follow the given time limit and format.',
    tag: 'PITCH FORMAT',
  },
  {
    id: 11,
    number: '11',
    title: 'DECISION IS FINAL',
    description: 'All jury decisions are final and binding. No arguments or disputes will be entertained.',
    tag: 'JURY PROTOCOL',
  },
  {
    id: 12,
    number: '12',
    title: 'FOLLOW VENUE RULES',
    description: 'Follow all campus and organizer instructions. Any rule violation may lead to disqualification.',
    tag: 'CAMPUS POLICY',
  },
];

export const POSTER_SLOGANS = {
  header: 'SAME IDEAS, DIFFERENT REALITIES',
  introTag: 'EVENT WARNINGS // IMRD SHIRPUR',
  tagline: 'TO KEEP THE CODE CARNIVAL 2.0 SAFE, FAIR AND AMAZING FOR EVERYONE, FOLLOW THESE GUIDELINES',
  bannerTop: "SOME IDEAS SHOULDN'T STAY HIDDEN",
  bannerBottom: 'PLAY FAIR • BUILD BOLD • KEEP IT REAL',
};
