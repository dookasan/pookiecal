import { BirthdayPerson, CardTheme, PartyPlan } from '../types/birthday';

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'aurora',
    name: 'Aurora Glow',
    gradientCss: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 50%, #9333ea 100%)',
    textColor: 'text-white',
    accentColor: '#f59e0b',
    borderStyle: 'border-amber-300/40',
    fontClass: 'font-serif'
  },
  {
    id: 'sunset',
    name: 'Sunset Coral',
    gradientCss: 'linear-gradient(135deg, #fb923c 0%, #ec4899 50%, #e11d48 100%)',
    textColor: 'text-white',
    accentColor: '#fb923c',
    borderStyle: 'border-orange-200/50',
    fontClass: 'font-sans'
  },
  {
    id: 'champagne',
    name: 'Golden Elegance',
    gradientCss: 'linear-gradient(135deg, #1c1917 0%, #27272a 40%, #78350f 100%)',
    textColor: 'text-amber-100',
    accentColor: '#facc15',
    borderStyle: 'border-amber-400/40',
    fontClass: 'font-serif'
  },
  {
    id: 'midnight',
    name: 'Midnight Starburst',
    gradientCss: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #1e3a8a 100%)',
    textColor: 'text-sky-100',
    accentColor: '#38bdf8',
    borderStyle: 'border-cyan-400/40',
    fontClass: 'font-sans'
  },
  {
    id: 'retro',
    name: 'Retro Emerald',
    gradientCss: 'linear-gradient(135deg, #047857 0%, #115e59 50%, #164e63 100%)',
    textColor: 'text-emerald-50',
    accentColor: '#34d399',
    borderStyle: 'border-emerald-400/40',
    fontClass: 'font-sans'
  },
  {
    id: 'confetti',
    name: 'Fiesta Purple',
    gradientCss: 'linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #db2777 100%)',
    textColor: 'text-white',
    accentColor: '#f472b6',
    borderStyle: 'border-fuchsia-300/40',
    fontClass: 'font-serif'
  }
];

export const INITIAL_BIRTHDAYS: BirthdayPerson[] = [
  {
    id: 'b-1',
    name: 'Sarah Jenkins',
    birthDate: '1996-10-22', // Today! Oct 22
    phone: '+1 (555) 349-8120',
    email: 'sarah.j@example.com',
    relationship: 'friend',
    avatarColor: 'bg-rose-500',
    avatarEmoji: '🎂',
    notes: 'Loves matcha lattes, mystery novels, and handmade candles.',
    favoriteThings: ['Matcha', 'Books', 'Ceramics'],
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      oneWeekBefore: false,
      time: '09:00'
    },
    customCardTheme: 'aurora',
    googleConnected: true,
    googleProfile: {
      googleEmail: 'sarah.j@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      connectedSince: 'Connected Jan 2024',
      driveFolderUrl: 'https://drive.google.com',
      recentEmails: [
        {
          id: 'em-1',
          subject: 'Re: Birthday brunch plans & coffee reservation ☕',
          snippet: 'Hey! So excited for today! Can not wait to see everyone at 11:30. Thanks for organizing!',
          date: 'Oct 22, 9:15 AM',
          from: 'Sarah Jenkins <sarah.j@example.com>'
        },
        {
          id: 'em-2',
          subject: 'Matcha workshop tickets for weekend',
          snippet: 'Got the confirmation email for the artisan tea ceremony class we talked about.',
          date: 'Oct 18, 4:20 PM',
          from: 'Sarah Jenkins <sarah.j@example.com>'
        },
        {
          id: 'em-3',
          subject: 'Shared photo album link: Summer camping trip',
          snippet: 'Uploaded 45 high-res photos from Yosemite. Download the full zip whenever you want.',
          date: 'Sep 28, 11:05 AM',
          from: 'Sarah Jenkins <sarah.j@example.com>'
        }
      ],
      chatConversations: [
        {
          id: 'ch-1',
          sender: 'Sarah Jenkins',
          text: 'Good morning!! Just saw the birthday notification, thank you so much! 🥹✨',
          timestamp: '9:30 AM',
          isSelf: false
        },
        {
          id: 'ch-2',
          sender: 'You',
          text: 'Happy Birthday Sarah!! Hope you are having the most amazing morning! 🎂🎉',
          timestamp: '9:32 AM',
          isSelf: true
        },
        {
          id: 'ch-3',
          sender: 'Sarah Jenkins',
          text: 'Are you bringing the matcha cake?! Maya said there might be a surprise haha',
          timestamp: '9:35 AM',
          isSelf: false
        }
      ],
      sharedPhotos: [
        {
          id: 'ph-1',
          url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
          caption: 'Sarah’s 29th Rooftop Party with Friends',
          date: 'Oct 22, 2025',
          album: 'Birthday Celebrations'
        },
        {
          id: 'ph-2',
          url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80',
          caption: 'Weekend Picnic & Sunset at Golden Gate',
          date: 'Aug 14, 2026',
          album: 'Weekend Trips'
        },
        {
          id: 'ph-3',
          url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
          caption: 'Baking Strawberry Shortcake Together',
          date: 'May 02, 2026',
          album: 'Food & Cooking'
        }
      ],
      youtubeChannel: {
        channelTitle: 'Sarah’s Ceramic & Life Vlogs',
        channelUrl: 'https://youtube.com',
        subscriberCount: '1.4K subscribers',
        highlightVideos: [
          {
            id: 'yt-1',
            title: 'Pottery Studio Vlog: Making Handmade Birthday Mugs',
            thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&auto=format&fit=crop&q=80',
            duration: '12:45',
            url: 'https://youtube.com'
          },
          {
            id: 'yt-2',
            title: 'Favorite Coffee & Matcha Spots in the City',
            thumbnail: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80',
            duration: '08:20',
            url: 'https://youtube.com'
          }
        ]
      }
    }
  },
  {
    id: 'b-2',
    name: 'Maya Patel (Sister)',
    birthDate: '1998-10-24', // In 2 days! Oct 24
    phone: '+1 (555) 782-9914',
    email: 'maya.patel@example.com',
    relationship: 'family',
    avatarColor: 'bg-amber-500',
    avatarEmoji: '✨',
    notes: 'Planning a surprise brunch on Saturday. Don’t spill the secret!',
    favoriteThings: ['Photography', 'Travel', 'Indie Rock'],
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      oneWeekBefore: true,
      time: '08:30'
    },
    customCardTheme: 'sunset',
    googleConnected: true,
    googleProfile: {
      googleEmail: 'maya.patel@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      connectedSince: 'Connected Dec 2023',
      driveFolderUrl: 'https://drive.google.com',
      recentEmails: [
        {
          id: 'em-4',
          subject: 'Family Thanksgiving Flight details & schedule',
          snippet: 'Booking flights for the weekend. Let me know if you want the morning or afternoon flight.',
          date: 'Yesterday, 6:40 PM',
          from: 'Maya Patel <maya.patel@example.com>'
        },
        {
          id: 'em-5',
          subject: 'Photo prints for Mom’s anniversary album',
          snippet: 'The photobook proof arrived! It looks incredible. Take a peek when you have a minute.',
          date: 'Oct 15, 2:10 PM',
          from: 'Maya Patel <maya.patel@example.com>'
        }
      ],
      chatConversations: [
        {
          id: 'ch-4',
          sender: 'Maya Patel',
          text: 'Hey! Are we still doing lunch on Saturday? 🌿',
          timestamp: 'Yesterday',
          isSelf: false
        },
        {
          id: 'ch-5',
          sender: 'You',
          text: 'Yes definitely! Meet at The Glasshouse Terrace around 11:30 AM 😉',
          timestamp: 'Yesterday',
          isSelf: true
        }
      ],
      sharedPhotos: [
        {
          id: 'ph-4',
          url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
          caption: 'Maya’s Graduation Celebration with Family',
          date: 'June 18, 2025',
          album: 'Family Milestones'
        },
        {
          id: 'ph-5',
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
          caption: 'Roadtrip to Pacific Coast Highway',
          date: 'July 2026',
          album: 'Travel Memories'
        }
      ],
      youtubeChannel: {
        channelTitle: 'Maya Patel Acoustic Sessions & Covers',
        channelUrl: 'https://youtube.com',
        subscriberCount: '3.2K subscribers',
        highlightVideos: [
          {
            id: 'yt-3',
            title: 'Indie Acoustic Cover - Golden Hour (Guitar & Vocals)',
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
            duration: '03:42',
            url: 'https://youtube.com'
          }
        ]
      }
    }
  },
  {
    id: 'b-3',
    name: 'Liam Chen',
    birthDate: '1993-10-29', // In 7 days!
    phone: '+1 (555) 412-6789',
    relationship: 'friend',
    avatarColor: 'bg-indigo-500',
    avatarEmoji: '🎸',
    notes: 'Turning 33. Big milestone party at rooftop lounge!',
    favoriteThings: ['Vinyl records', 'Coffee brewing', 'Hiking'],
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: false,
      oneWeekBefore: true,
      time: '09:00'
    },
    customCardTheme: 'midnight',
    googleConnected: true,
    googleProfile: {
      googleEmail: 'liam.chen@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      connectedSince: 'Connected Feb 2024',
      driveFolderUrl: 'https://drive.google.com',
      recentEmails: [
        {
          id: 'em-6',
          subject: 'Acoustic Guitar tabs & playlist for Maya’s surprise brunch',
          snippet: 'Hey! Here is the chord sheet and playlist we planned for the acoustic set.',
          date: 'Oct 20, 3:15 PM',
          from: 'Liam Chen <liam.chen@example.com>'
        }
      ],
      chatConversations: [
        {
          id: 'ch-6',
          sender: 'Liam Chen',
          text: 'Got the portable amp tested and ready for the party! 🎸',
          timestamp: 'Yesterday',
          isSelf: false
        }
      ],
      sharedPhotos: [
        {
          id: 'ph-6',
          url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
          caption: 'Live Jam Session at Downtown Warehouse',
          date: 'Sep 04, 2026',
          album: 'Music & Concerts'
        }
      ],
      youtubeChannel: {
        channelTitle: 'Liam Chen Guitars & Vinyl',
        channelUrl: 'https://youtube.com',
        subscriberCount: '5.8K subscribers',
        highlightVideos: [
          {
            id: 'yt-4',
            title: 'Vintage Vinyl Collection Tour & Vinyl Setup',
            thumbnail: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&auto=format&fit=crop&q=80',
            duration: '15:20',
            url: 'https://youtube.com'
          }
        ]
      }
    }
  },
  {
    id: 'b-4',
    name: 'Mom (Elena)',
    birthDate: '1966-11-05',
    phone: '+1 (555) 901-2345',
    relationship: 'family',
    avatarColor: 'bg-emerald-500',
    avatarEmoji: '🌸',
    notes: 'Send fresh orchids and call first thing in the morning.',
    favoriteThings: ['Gardening', 'Watercolor', 'Italian food'],
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      oneWeekBefore: true,
      time: '08:00'
    },
    customCardTheme: 'champagne',
    googleConnected: true,
    googleProfile: {
      googleEmail: 'elena.family@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      connectedSince: 'Connected Forever ❤️',
      driveFolderUrl: 'https://drive.google.com',
      recentEmails: [
        {
          id: 'em-7',
          subject: 'Secret recipe for grandmother’s tiramisu 🍰',
          snippet: 'Darling, remember to use fresh mascarpone and double espresso for the cream layer!',
          date: 'Oct 12, 10:30 AM',
          from: 'Mom <elena.family@example.com>'
        }
      ],
      chatConversations: [
        {
          id: 'ch-7',
          sender: 'Mom (Elena)',
          text: 'Have a blessed day sweetheart! Don’t forget to hydrate. Call me later ❤️',
          timestamp: '8:45 AM',
          isSelf: false
        }
      ],
      sharedPhotos: [
        {
          id: 'ph-7',
          url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
          caption: 'Family Sunday Dinner & Botanical Garden Walk',
          date: 'Aug 20, 2026',
          album: 'Family Treasures'
        }
      ],
      youtubeChannel: {
        channelTitle: 'Elena’s Garden & Watercolor Kitchen',
        channelUrl: 'https://youtube.com',
        subscriberCount: '850 subscribers',
        highlightVideos: [
          {
            id: 'yt-5',
            title: 'Watercolor Orchids & Spring Garden Harvest',
            thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&auto=format&fit=crop&q=80',
            duration: '09:12',
            url: 'https://youtube.com'
          }
        ]
      }
    }
  },
  {
    id: 'b-5',
    name: 'David Miller',
    birthDate: '1989-11-18',
    phone: '+1 (555) 623-7744',
    relationship: 'colleague',
    avatarColor: 'bg-cyan-500',
    avatarEmoji: '🚀',
    notes: 'Team tech lead. Get group card signed by everyone.',
    favoriteThings: ['Sci-fi', 'Espresso', 'Gadgets'],
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: false,
      oneWeekBefore: false,
      time: '10:00'
    },
    customCardTheme: 'retro',
    googleConnected: true,
    googleProfile: {
      googleEmail: 'david.miller@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      connectedSince: 'Connected Sep 2023',
      driveFolderUrl: 'https://drive.google.com',
      recentEmails: [
        {
          id: 'em-8',
          subject: 'Team Q4 Retro & Celebration Lunch',
          snippet: 'Great job this sprint everyone! Pizza and cakes on Friday.',
          date: 'Oct 19, 5:00 PM',
          from: 'David Miller <david.miller@example.com>'
        }
      ],
      chatConversations: [
        {
          id: 'ch-8',
          sender: 'David Miller',
          text: 'Shared the sprint board documentation on Google Drive 👍',
          timestamp: 'Yesterday',
          isSelf: false
        }
      ],
      sharedPhotos: [
        {
          id: 'ph-8',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
          caption: 'Hackathon Celebration & Team Demo Day',
          date: 'Sep 15, 2026',
          album: 'Work & Tech'
        }
      ],
      youtubeChannel: {
        channelTitle: 'Tech Talk & Sci-Fi Reviews with Dave',
        channelUrl: 'https://youtube.com',
        subscriberCount: '2.1K subscribers',
        highlightVideos: [
          {
            id: 'yt-6',
            title: 'Top 5 Sci-Fi Books & Mechanical Keyboards',
            thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
            duration: '11:05',
            url: 'https://youtube.com'
          }
        ]
      }
    }
  }
];

export const INITIAL_PARTY_PLAN: PartyPlan = {
  id: 'p-1',
  birthdayId: 'b-2', // Maya Patel
  title: 'Maya’s Secret Neon Garden Brunch 🌿✨',
  theme: 'Botanical Neon & Acoustic Vibes',
  date: '2026-10-24',
  time: '11:30 AM',
  location: 'The Glasshouse Terrace, 422 Blossom Ave',
  isSurprise: true,
  budgetGoal: 450,
  guests: [
    { id: 'g-1', name: 'Alex Rivera', phone: '+15551112233', status: 'confirmed', role: 'Brings Birthday Cake 🎂' },
    { id: 'g-2', name: 'Kiran Rao', phone: '+15552223344', status: 'confirmed', role: 'Playlist & Speaker 🎵' },
    { id: 'g-3', name: 'Sam Taylor', phone: '+15553334455', status: 'confirmed', role: 'Polaroid Camera 📸' },
    { id: 'g-4', name: 'Jordan Lee', phone: '+15554445566', status: 'pending', role: 'Decorations & Balloons 🎈' },
    { id: 'g-5', name: 'Zoe Vance', phone: '+15555556677', status: 'pending', role: 'Confetti & Games 🎉' }
  ],
  wishlist: [
    {
      id: 'w-1',
      title: 'Fujifilm Instax Mini Evo Camera',
      estimatedCost: 199,
      contributedAmount: 150,
      contributors: [
        { name: 'Alex Rivera', amount: 50 },
        { name: 'Kiran Rao', amount: 50 },
        { name: 'Me', amount: 50 }
      ],
      link: 'https://example.com'
    },
    {
      id: 'w-2',
      title: 'Artisan Ceramic Pour-Over Dripper Set',
      estimatedCost: 85,
      contributedAmount: 85,
      contributors: [
        { name: 'Sam Taylor', amount: 85 }
      ]
    },
    {
      id: 'w-3',
      title: 'Gourmet French Bakery Custom Tart & Macarons',
      estimatedCost: 120,
      contributedAmount: 80,
      contributors: [
        { name: 'Me', amount: 80 }
      ]
    }
  ],
  checklist: [
    { id: 'c-1', text: 'Confirm reservation at Glasshouse Terrace', done: true },
    { id: 'c-2', text: 'Pick up customized birthday cake by 10 AM', done: false },
    { id: 'c-3', text: 'Coordinate surprise arrival: Maya arrives at 11:45 AM', done: true },
    { id: 'c-4', text: 'Set up neon sign & acoustic playlist', done: false },
    { id: 'c-5', text: 'Prepare group digital card & video compilation', done: false }
  ],
  notes: 'Remind everyone to arrive by 11:15 AM so everyone is hidden when Maya walks in!'
};

export const MESSAGE_TEMPLATES = [
  {
    tone: 'Heartfelt',
    emoji: '💖',
    templates: [
      "Happy Birthday, {name}! 🎉 Wishing you a year filled with immense joy, peace, and dreams turning into reality. You bring so much light into the lives of everyone around you. Have the most magical day!",
      "Dearest {name}, on your special day, I just want to remind you how deeply appreciated and loved you are. May every step of this upcoming year bring you closer to all your aspirations. Happy Birthday! 🎂✨",
      "Happy Birthday to someone who makes the world brighter simply by being in it! Thank you for your warmth, your kindness, and all the memories we share. Celebrating you today! 🥂"
    ]
  },
  {
    tone: 'Funny & Playful',
    emoji: '😂',
    templates: [
      "Happy Birthday, {name}! 🎂 They say wisdom comes with age... which means you must be practically a certified genius by now! Enjoy your cake before I eat it all!",
      "Happy Birthday to my favorite human! 🎉 Don't worry about getting older—you're not old, you're just vintage and increasingly limited edition!",
      "Happy Birthday, {name}! Another year older, wiser, and still completely incapable of blowing out candles without making a dramatic wish. Let's party! 🥳"
    ]
  },
  {
    tone: 'Short & Sweet',
    emoji: '⚡',
    templates: [
      "Happy Birthday, {name}! 🎈 Wishing you endless smiles, love, and cake today!",
      "Cheers to you on your birthday, {name}! 🥂 Hope your day is as incredible as you are!",
      "Happy, happy birthday {name}! May this year be your best chapter yet! ✨🎂"
    ]
  },
  {
    tone: 'Poetic & Soulful',
    emoji: '🌿',
    templates: [
      "Like good wine and timeless melodies, you only grow richer with every passing season. May this year shower you with quiet peace and triumphant happiness. Happy Birthday, {name}! 🌸",
      "May the sun shine warmest on your doorstep, may laughter fill your halls, and may peace crown your days. Celebrating the gift that is your life today, {name}. Happy Birthday! 💫"
    ]
  },
  {
    tone: 'Family & Bond',
    emoji: '🏡',
    templates: [
      "Happy Birthday to the rock of our family, {name}! Thank you for all the love, laughs, and constant support through the years. We cherish you beyond measure! ❤️🎂",
      "To my dearest {name}: Family is life’s greatest blessing, and having you is the greatest gift. Wishing you all the happiness and health in the world today!"
    ]
  }
];
