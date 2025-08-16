export interface Game {
  id: string;
  title: string;
  image: string;
  featured?: boolean;
  description: string;
  ageGroup: 'early' | 'middle' | 'teen';
  category: 'recognition' | 'response' | 'reporting' | 'support';
}

export const games: Game[] = [
  {
    id: '1',
    title: 'Safe Touch, Unsafe Touch',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: 'Learn about appropriate and inappropriate touch in a safe, educational way.',
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '2',
    title: 'Trusted Adults Circle',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Identify and connect with trusted adults who can help you.',
    ageGroup: 'early',
    category: 'support'
  },
  {
    id: '3',
    title: 'Speaking Up Heroes',
    image: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: 'Practice finding your voice and speaking up when something feels wrong.',
    ageGroup: 'middle',
    category: 'response'
  },
  {
    id: '4',
    title: 'Secret vs. Surprise',
    image: 'https://images.pexels.com/photos/1298684/pexels-photo-1298684.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Learn the difference between good surprises and harmful secrets.',
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '5',
    title: 'Body Safety Rules',
    image: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Understand important rules about your body and personal boundaries.',
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '6',
    title: 'Help a Friend',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: 'Learn how to help a friend who might be in an unsafe situation.',
    ageGroup: 'middle',
    category: 'support'
  },
  {
    id: '7',
    title: 'Online Safety Shield',
    image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Stay safe online and recognize inappropriate behavior on the internet.',
    ageGroup: 'middle',
    category: 'recognition'
  },
  {
    id: '8',
    title: 'Emergency Contacts',
    image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Learn important phone numbers and how to ask for help.',
    ageGroup: 'early',
    category: 'reporting'
  },
  {
    id: '9',
    title: 'Feeling Safe at Home',
    image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Understand what a safe home feels like and what to do if it doesn\'t.',
    ageGroup: 'middle',
    category: 'recognition'
  },
  {
    id: '10',
    title: 'Bullying Response Team',
    image: 'https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Learn strategies to handle bullying and when to get help.',
    ageGroup: 'middle',
    category: 'response'
  },
  {
    id: '11',
    title: 'Teen Safety Network',
    image: 'https://images.pexels.com/photos/1556195/pexels-photo-1556195.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Navigate complex social situations and peer pressure safely.',
    ageGroup: 'teen',
    category: 'response'
  },
  {
    id: '12',
    title: 'Report It Right',
    image: 'https://images.pexels.com/photos/1482477/pexels-photo-1482477.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: 'Learn how and when to report unsafe situations to trusted adults.',
    ageGroup: 'middle',
    category: 'reporting'
  }
];

export const helplineNumbers = {
  childline: '116',
  emergency: '911',
  textLine: 'Text HOME to 741741'
};