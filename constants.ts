
import { Station, Episode, Program } from "./types";

export const APP_NAME = "NCOR";

export const MOCK_STATIONS: Station[] = [
  {
    id: 'live-tech',
    title: 'Tech Horizon Live',
    description: 'Real-time updates on AI, Quantum Computing, and Gadgets.',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    category: 'Technology',
    prompt: 'You are a fast-paced tech news radio host named Alex. Give a 1-minute high-energy update on the latest AI breakthroughs.',
    voice: 'Puck',
    type: 'radio',
    author: 'NCOR Originals',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'morning-calm',
    title: 'Morning Mindfulness',
    description: 'Start your day with guided breathing and positive affirmations.',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    category: 'Wellness',
    prompt: 'You are a calm meditation guide named Maya. Guide the listener through a 45-second deep breathing exercise to start their day.',
    voice: 'Kore',
    type: 'radio',
    author: 'Mindful Studios',
    isPremium: true,
    isUserGenerated: false
  },
  {
    id: 'scifi-stories',
    title: 'Galactic Tales',
    description: 'Immersive short science fiction stories generated on the fly.',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    category: 'Fiction',
    prompt: 'You are a storyteller named Orion. Tell a very short, 1-minute captivating sci-fi story about a robot discovering a flower on Mars.',
    voice: 'Fenrir',
    type: 'radio',
    author: 'Sci-Fi Central',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'daily-news',
    title: 'The Daily Brief',
    description: 'World news summarized for busy professionals.',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    category: 'News',
    prompt: 'You are a professional news anchor named Sarah. Summarize 3 fictional but realistic major world headlines for today in a formal tone.',
    voice: 'Zephyr',
    type: 'radio',
    author: 'NCOR News',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'history-mystery',
    title: 'History Unveiled',
    description: 'Deep dives into unsolved historical mysteries.',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    category: 'History',
    prompt: 'You are a historian named Professor H. Share an intriguing, lesser-known fact about the Roman Empire.',
    voice: 'Charon',
    type: 'podcast',
    author: 'Prof. History',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'kids-corner',
    title: 'Kids Adventure',
    description: 'Fun and educational stories for children.',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    category: 'Kids',
    prompt: 'You are a cheerful storyteller. Tell a funny 30-second story about a cat who wants to fly an airplane.',
    voice: 'Puck',
    type: 'audiobook',
    author: 'Storytime Co.',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'crime-files',
    title: 'The Crime Files',
    description: 'Investigative journalism into cold cases.',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    category: 'Crime',
    prompt: 'You are a crime investigator narrator. Describe the setting of a mysterious noir scene.',
    voice: 'Fenrir',
    type: 'podcast',
    author: 'Detective J',
    isPremium: true,
    isUserGenerated: false
  },
  {
    id: 'future-talk',
    title: 'Future Talk',
    description: 'Interviews with time travelers (simulated).',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    category: 'Technology',
    prompt: 'You are interviewing a time traveler from 2050. Ask them about the state of the internet.',
    voice: 'Puck',
    type: 'podcast',
    author: 'Tech Insider',
    isPremium: false,
    isUserGenerated: false
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice (AI Edition)',
    description: 'The classic tale reimagined with modern voices.',
    imageUrl: 'https://picsum.photos/400/400?random=9',
    category: 'Fiction',
    prompt: 'Read the opening line of Pride and Prejudice with a modern twist.',
    voice: 'Kore',
    type: 'audiobook',
    author: 'Classic Audio',
    isPremium: true,
    isUserGenerated: false
  },
  {
    id: 'mars-chronicles',
    title: 'The Mars Chronicles',
    description: 'A journey to the red planet.',
    imageUrl: 'https://picsum.photos/400/400?random=10',
    category: 'Sci-Fi',
    prompt: 'Describe the landing on Mars in vivid detail.',
    voice: 'Zephyr',
    type: 'audiobook',
    author: 'Space Walkers',
    isPremium: false,
    isUserGenerated: false
  }
];

export const MOCK_EPISODES: Episode[] = [
  {
    id: 'ep-1',
    stationId: 'history-mystery',
    title: 'The Lost Legion of Rome',
    description: 'Where did the Ninth Legion go? We explore the theories.',
    duration: '45:20',
    date: 'Oct 12',
    imageUrl: 'https://picsum.photos/100/100?random=11'
  },
  {
    id: 'ep-2',
    stationId: 'future-talk',
    title: 'Web 5.0: The Neural Net',
    description: 'Browsing the web with your mind. Is it safe?',
    duration: '32:15',
    date: 'Oct 11',
    imageUrl: 'https://picsum.photos/100/100?random=12'
  },
  {
    id: 'ep-3',
    stationId: 'crime-files',
    title: 'The Midnight Heist',
    description: 'A bank robbery where nothing was stolen.',
    duration: '55:00',
    date: 'Oct 10',
    imageUrl: 'https://picsum.photos/100/100?random=13'
  },
  {
    id: 'ep-4',
    stationId: 'daily-news',
    title: 'Weekly Roundup: Global Tech',
    description: 'The biggest stories from Silicon Valley to Shenzhen.',
    duration: '15:00',
    date: 'Today',
    imageUrl: 'https://picsum.photos/100/100?random=14'
  }
];

export const MOCK_SCHEDULE: Program[] = [
  { id: 'p1', time: '08:00', title: 'Morning Wake Up', host: 'Zephyr', isLive: false },
  { id: 'p2', time: '09:00', title: 'The Daily Brief', host: 'Sarah', isLive: false },
  { id: 'p3', time: '10:00', title: 'Tech Horizon Live', host: 'Alex', isLive: true },
  { id: 'p4', time: '11:00', title: 'Deep Dive: History', host: 'Prof. H', isLive: false },
  { id: 'p5', time: '12:00', title: 'Midday Jazz & Talk', host: 'Fenrir', isLive: false },
];

export const CATEGORIES = ["All", "Technology", "News", "Wellness", "Fiction", "History", "Kids", "Crime", "Business", "Music"];
