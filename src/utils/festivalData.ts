import { FestivalCatalogItem, CustomEvent } from '../types/birthday';

export const FESTIVALS_CATALOG: FestivalCatalogItem[] = [
  {
    id: 'fest-halloween',
    name: 'Halloween',
    date: '2026-10-31',
    emoji: '🎃',
    category: 'seasonal',
    color: 'from-orange-500 to-amber-700',
    description: 'Festive autumn celebration with costume parties, pumpkin carving, and trick-or-treating treats.',
    traditions: ['Costume parties', 'Carving jack-o-lanterns', 'Sharing candy & chocolates'],
    suggestedCarryItems: [
      'Gourmet pumpkin candy & chocolates 🍫',
      'Costume accessories & face paint 🎭',
      'Spooky themed cupcakes or cookies 🧁'
    ],
    suggestedShopItems: [
      'Halloween party decor & fairy lights',
      'Assorted trick-or-treat chocolate box'
    ],
    defaultWishes: [
      'Wishing you a spooktacular Halloween full of sweet treats and delightful frights! 🎃👻',
      'Happy Halloween! Hope your night is full of laughter, great costumes, and tons of candy! 🍬🦇'
    ]
  },
  {
    id: 'fest-diwali',
    name: 'Diwali (Festival of Lights)',
    date: '2026-11-08',
    emoji: '🪔',
    category: 'cultural',
    color: 'from-amber-500 via-rose-500 to-yellow-600',
    description: 'Grand celebration of light over darkness, prosperity, joy, and family gatherings with festive feasts.',
    traditions: ['Lighting clay diyas and lanterns', 'Sharing festive sweets & dry fruits', 'Rangoli designs at entrance', 'Family blessings'],
    suggestedCarryItems: [
      'Box of fresh Kaju Katli & Motichoor Laddoos 🍬',
      'Set of handcrafted brass or terracotta Diyas 🪔',
      'Silver coin or dry fruits gift hamper 🎁',
      'Fresh floral garland / marigolds 🌼'
    ],
    suggestedShopItems: [
      'Buy artisanal Indian sweets online',
      'Order eco-friendly brass diya lamps',
      'Shop luxury dry fruits gift box on web'
    ],
    defaultWishes: [
      'Wishing you and your family a gleaming and prosperous Diwali! May the divine lights bring joy, health, and limitless blessings! 🪔✨',
      'Happy Diwali! May this sacred festival illuminate your life with laughter, good fortune, and wonderful moments with loved ones. 🎆🪔'
    ]
  },
  {
    id: 'fest-thanksgiving',
    name: 'Thanksgiving',
    date: '2026-11-26',
    emoji: '🦃',
    category: 'global',
    color: 'from-amber-600 to-stone-800',
    description: 'A time of gratitude, heartwarming reunion with family and friends, and sharing a bountiful feast.',
    traditions: ['Family reunion dinner', 'Sharing gratitude toasts', 'Pumpkin & pecan pie sharing'],
    suggestedCarryItems: [
      'Freshly baked spiced pumpkin pie 🥧',
      'Cranberry artisanal sauce or sparkling cider 🍾',
      'Warm autumn floral arrangement 💐'
    ],
    suggestedShopItems: [
      'Order gourmet baking ingredients & spices',
      'Buy family gratitude game or card deck'
    ],
    defaultWishes: [
      'Happy Thanksgiving! Warmest wishes of gratitude, joy, and delicious food with everyone around your table. 🍂🦃',
      'Thinking of you with heartfelt gratitude this Thanksgiving. Cherishing our bond and friendship! 🍁🥧'
    ]
  },
  {
    id: 'fest-christmas',
    name: 'Christmas',
    date: '2026-12-25',
    emoji: '🎄',
    category: 'global',
    color: 'from-emerald-700 via-red-600 to-red-800',
    description: 'Celebrating love, kindness, festive cheer, carols, and exchanging gifts by the Christmas tree.',
    traditions: ['Trimming the tree', 'Singing carols', 'Secret Santa gifts', 'Plum cake & gingerbread'],
    suggestedCarryItems: [
      'Traditional spiced Christmas plum cake 🎂',
      'Wrapped gift boxes with festive ribbons 🎁',
      'Handmade gingerbread cookies & candy canes 🍪',
      'Scented pine & cinnamon candle 🕯️'
    ],
    suggestedShopItems: [
      'Shop secret Santa gifts online',
      'Order gourmet Christmas chocolate hamper',
      'Buy cozy festive sweaters or woolen socks'
    ],
    defaultWishes: [
      'Merry Christmas! May your home be filled with warmth, peace, love, and sweet festive memories! 🎄✨',
      'Wishing you the most joyful Christmas season! May the holidays bring endless smiles and laughter to you and your family. 🎅🎁'
    ]
  },
  {
    id: 'fest-newyear',
    name: 'New Year’s Day 2027',
    date: '2027-01-01',
    emoji: '🥂',
    category: 'global',
    color: 'from-indigo-600 via-purple-600 to-amber-500',
    description: 'Welcoming the fresh dawn of the new year with resolutions, champagne toasts, and fresh beginnings.',
    traditions: ['Midnight countdown', 'Champagne toast', 'Setting positive resolutions'],
    suggestedCarryItems: [
      'Bottle of sparkling champagne / cider 🍾',
      'Midnight party poppers & confetti 🎉',
      'New year desk planner or journal 📖'
    ],
    suggestedShopItems: [
      'Order party poppers & celebration props',
      'Buy resolution diary or calendar'
    ],
    defaultWishes: [
      'Happy New Year 2027! 🥂 May this year unfold 365 days of good health, bold adventures, and triumphant happiness! ✨🎉',
      'Cheers to new beginnings, cherished memories, and boundless success in the upcoming year! 🌟🥂'
    ]
  },
  {
    id: 'fest-pongal',
    name: 'Makar Sankranti / Pongal / Lohri',
    date: '2027-01-14',
    emoji: '🪁',
    category: 'cultural',
    color: 'from-yellow-500 via-orange-500 to-red-500',
    description: 'Vibrant harvest festival celebrating the transition of the sun, sweet pongal, bonfire warmth, and colorful kites.',
    traditions: ['Flying kites in open skies', 'Cooking sweet jaggery Pongal in clay pots', 'Sharing sesame til-laddoo & chikki'],
    suggestedCarryItems: [
      'Box of freshly made Til-Gud (Sesame-Jaggery) sweets 🍬',
      'Colorful paper kites and spools 🪁',
      'Fresh sugarcane & seasonal harvest fruits 🌾'
    ],
    suggestedShopItems: [
      'Buy artisanal til chikki & jaggery sweets online',
      'Order colorful handmade fighter kites on web'
    ],
    defaultWishes: [
      'Wishing you a joyous and sweet Makar Sankranti & Pongal! May your aspirations soar as high as the kites in the sky! 🪁🌾',
      'May the harvest festival bring warmth, sweet treats, and abundance to your hearth and home! 🪔✨'
    ]
  },
  {
    id: 'fest-lunarnewyear',
    name: 'Lunar New Year',
    date: '2027-02-06',
    emoji: '🏮',
    category: 'cultural',
    color: 'from-red-600 to-amber-600',
    description: 'Welcoming the Lunar New Year with family banquets, red lanterns, dragon dances, and prosperous red envelopes.',
    traditions: ['Family reunion feast', 'Gifting red envelopes (Hongbao)', 'Sharing dumplings and mandarin oranges'],
    suggestedCarryItems: [
      'Lucky red envelopes with new banknotes 🧧',
      'Golden sweet mandarin oranges 🍊',
      'Handmade sweet rice cakes (Nian Gao) 🥮'
    ],
    suggestedShopItems: [
      'Shop luxury Chinese tea set online',
      'Order festive red paper-cut decorations'
    ],
    defaultWishes: [
      'Happy Lunar New Year! Wishing you overflowing prosperity, robust health, and good fortune! 🏮🧧',
      'Gong Xi Fa Cai! May this new spring season bring radiant harmony and success to your whole family! 🐉✨'
    ]
  },
  {
    id: 'fest-valentines',
    name: 'Valentine’s Day',
    date: '2027-02-14',
    emoji: '🌹',
    category: 'global',
    color: 'from-orange-500 to-red-600',
    description: 'A celebration of romance, affection, cherished friendships, and heartfelt appreciation.',
    traditions: ['Giving flowers & roses', 'Gifting handmade cards & chocolates', 'Romantic dinners'],
    suggestedCarryItems: [
      'Bouquet of fresh red roses or peonies 💐',
      'Box of Belgian artisan chocolate truffles 🍫',
      'Handwritten wax-sealed card 💌'
    ],
    suggestedShopItems: [
      'Order customized flower arrangement online',
      'Shop luxury scented perfume or candles'
    ],
    defaultWishes: [
      'Happy Valentine’s Day! You make every day warmer, brighter, and infinitely more special. ❤️🌹',
      'Celebrating you and the beautiful love and friendship we share. Have the sweetest day! 💕🥂'
    ]
  },
  {
    id: 'fest-eid',
    name: 'Eid al-Fitr',
    date: '2027-03-10',
    emoji: '🌙',
    category: 'cultural',
    color: 'from-emerald-600 via-teal-700 to-amber-500',
    description: 'Joyous festival of breaking the fast, charity, family reunions, delicious Sheer Khurma, and sharing gifts.',
    traditions: ['Morning Eid prayers', 'Cooking rich Sheer Khurma dessert', 'Gifting Eidi to youth', 'Visiting relatives'],
    suggestedCarryItems: [
      'Artisanal dates stuffed with almonds & pistachios 🌴',
      'Freshly cooked rich Sheer Khurma or Baklava 🍯',
      'Gift envelopes (Eidi) for younger relatives ✉️',
      'Traditional attar or scented oud perfume 🌸'
    ],
    suggestedShopItems: [
      'Buy Medjool gourmet dates box online',
      'Order custom Eid sweet hampers and pastries'
    ],
    defaultWishes: [
      'Eid Mubarak! May this joyous day bring boundless peace, blessings, and warm prosperity to you and your family. 🌙✨',
      'Wishing you a sweet and memorable Eid filled with laughter, delicious feasts, and cherished moments! 💫🕌'
    ]
  },
  {
    id: 'fest-holi',
    name: 'Holi (Festival of Colors)',
    date: '2027-03-22',
    emoji: '🎨',
    category: 'cultural',
    color: 'from-orange-500 via-indigo-600 to-amber-400',
    description: 'Celebration of spring, victory of goodness, joy, and washing away grudges in vibrant clouds of herbal color.',
    traditions: ['Playing with organic herbal Gulal colors', 'Sharing fresh Mawa Gujiyas', 'Refreshing chilled Thandai drink'],
    suggestedCarryItems: [
      'Pack of organic herbal skin-safe Gulal colors 🎨',
      'Box of crisp homemade Mawa Gujiyas 🥟',
      'Chilled artisanal saffron Thandai drink 🥛'
    ],
    suggestedShopItems: [
      'Shop eco-friendly herbal Holi powder online',
      'Buy traditional dry-fruit Gujiyas box on web'
    ],
    defaultWishes: [
      'Happy Holi! May your life be splashed with the vibrant colors of peace, happiness, and friendship! 🎨✨',
      'Wishing you a joyous and colorful Holi! May you celebrate with sweet Gujiyas and hearty laughter! 🌸🎉'
    ]
  }
];

export const INITIAL_CUSTOM_EVENTS: CustomEvent[] = [
  {
    id: 'ev-1',
    title: 'Visit Mom & Parents in Hometown 🏡',
    type: 'visit',
    date: '2026-11-07',
    time: '10:30 AM',
    personId: 'b-4',
    personName: 'Mom (Elena)',
    personPhone: '+1 (555) 901-2345',
    location: 'Family Home, 12 Garden View Lane',
    notes: 'Going for weekend family reunion before Diwali festivities. Spend time in garden & cook together.',
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      twoHoursBefore: true
    },
    isAddedToReminder: true,
    emoji: '🏡',
    color: 'from-emerald-500 to-teal-700',
    prepItems: [
      {
        id: 'prep-1',
        text: 'Carry fresh Kaju Katli & Mysore Pak sweets from bakery 🍬',
        category: 'to-carry',
        done: false,
        webShopQuery: 'buy fresh Kaju Katli sweets online'
      },
      {
        id: 'prep-2',
        text: 'Bring framed family portrait from summer vacation 🖼️',
        category: 'to-carry',
        done: true
      },
      {
        id: 'prep-3',
        text: 'Shop soft cashmere winter shawl for Mom on web 🧣',
        category: 'to-shop',
        done: false,
        webShopQuery: 'buy cashmere wool shawl for women'
      },
      {
        id: 'prep-4',
        text: 'Order organic green tea assortment gift tin online 🍵',
        category: 'to-shop',
        done: false,
        webShopQuery: 'order organic herbal green tea gift tin'
      },
      {
        id: 'prep-5',
        text: 'Call Mom 1 day before to confirm lunch timings 📞',
        category: 'todo',
        done: false
      }
    ]
  },
  {
    id: 'ev-2',
    title: 'Diwali Celebration with Family & Friends 🪔',
    type: 'festival',
    date: '2026-11-08',
    time: '06:00 PM',
    festivalId: 'fest-diwali',
    location: 'Community Center / Home Terrace',
    notes: 'Evening prayer puja, lighting 51 diyas, and grand sweet exchange with neighbors and relatives.',
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: true,
      twoHoursBefore: false
    },
    isAddedToReminder: true,
    emoji: '🪔',
    color: 'from-amber-500 to-rose-600',
    prepItems: [
      {
        id: 'prep-6',
        text: 'Pick up 50 clay diyas and mustard oil for evening lamps 🪔',
        category: 'to-carry',
        done: true
      },
      {
        id: 'prep-7',
        text: 'Shop luxury assorted dry fruits gift boxes for relatives 🎁',
        category: 'to-shop',
        done: false,
        webShopQuery: 'buy luxury dry fruit boxes for Diwali online'
      },
      {
        id: 'prep-8',
        text: 'Order rangoli color powder stencils on web 🎨',
        category: 'to-shop',
        done: false,
        webShopQuery: 'order rangoli powder and stencils online'
      },
      {
        id: 'prep-9',
        text: 'Prepare WhatsApp Diwali greeting cards for group chat 📱',
        category: 'todo',
        done: false
      }
    ]
  },
  {
    id: 'ev-3',
    title: 'Acoustic Jam & Dinner with Liam & Maya 🎸',
    type: 'visit',
    date: '2026-10-30',
    time: '07:00 PM',
    personId: 'b-3',
    personName: 'Liam Chen',
    personPhone: '+1 (555) 412-6789',
    location: 'Liam’s Studio Loft, 4th Floor',
    notes: 'Rehearsing acoustic songs for Maya’s upcoming celebration brunch and trying out new vinyl records.',
    reminders: {
      sameDay: true,
      oneDayBefore: true,
      threeDaysBefore: false,
      twoHoursBefore: true
    },
    isAddedToReminder: true,
    emoji: '🎸',
    color: 'from-indigo-600 to-blue-700',
    prepItems: [
      {
        id: 'prep-10',
        text: 'Carry acoustic guitar tuner, capo & extra picks 🎸',
        category: 'to-carry',
        done: false
      },
      {
        id: 'prep-11',
        text: 'Shop artisan cold brew coffee concentrate & pastries 🥐',
        category: 'to-carry',
        done: false
      },
      {
        id: 'prep-12',
        text: 'Order vinyl record outer sleeves from web 📦',
        category: 'to-shop',
        done: false,
        webShopQuery: 'buy vinyl record protective sleeves online'
      }
    ]
  }
];
