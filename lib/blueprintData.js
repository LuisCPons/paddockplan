export const BLUEPRINT_DETAILS = {
  monza: {
    name: 'Italian Grand Prix',
    location: 'Monza, Italy',
    detailedBudget: {
      foodDaily: '€40 - €80',
      trackTransport: '€10 - €20 (Train/Shuttle)',
      flightsAvg: '€150 - €400 (to Milan)',
      miscellaneous: '€50 (Merchandise & Buffer)'
    },
    stayZones: [
      {
        neighborhood: 'Milan Centrale',
        pros: 'Direct train access to Monza, wide range of hotels.',
        cons: 'Crowded on race weekend, busy transit hub.',
        connectionTime: '35 mins'
      },
      {
        neighborhood: 'Monza Town',
        pros: 'Walking distance to track gates, local atmosphere.',
        cons: 'Extremely limited availability, high premium prices.',
        connectionTime: '15-20 mins (Walk)'
      },
      {
        neighborhood: 'Brera District (Milan)',
        pros: 'Premium dining, beautiful architecture, great nightlife.',
        cons: 'Requires metro transfer to reach Centrale for the train.',
        connectionTime: '55 mins'
      }
    ],
    transportTimeline: {
      friday: { departure: '08:30', return: '18:00' },
      saturday: { departure: '07:30', return: '19:00' },
      sunday: { departure: '06:30', return: '19:30' }
    },
    expertSecrets: [
      'The exact gate for the podium run is Gate 4 (Vedano). Be there 5 laps before the finish.',
      'Take the "Black" shuttle from Monza station for the fastest route to the Ascari chicane.',
      'Avoid the official track food; there is a local panino stand near the Curva Grande that is legendary.',
      'The best view for General Admission is the internal side of the Serraglio straight.',
      'Validation of train tickets is mandatory in Milan; save your 50€ fine for more beer instead.'
    ],
    packingChecklist: [
      'Comfortable walking shoes (15km+ per day)',
      'Portable power bank (10,000mAh minimum)',
      'Lightweight rain poncho (Monza storms are sudden)',
      'Noise-canceling earplugs (Essentials for the start)',
      'Refillable water bottle (Fountains available inside)',
      'Physical printout of tickets (Backup for spotty data)',
      'Sunscreen (SPF 50 - Italian sun is brutal)',
      'Small microfiber towel (for dusty grandstands)',
      'F1 app installed with offline maps',
      'Cash (20€-50€ - some local vendors are cash-only)'
    ]
  },
  silverstone: {
    name: 'British Grand Prix',
    location: 'Silverstone, UK',
    detailedBudget: {
      foodDaily: '£30 - £60',
      trackTransport: '£15 - £30 (Park & Ride)',
      flightsAvg: '£100 - £300 (to London)',
      miscellaneous: '£40 (Programs & Ponchos)'
    },
    stayZones: [
      {
        neighborhood: 'Milton Keynes',
        pros: 'High hotel capacity, easy Park & Ride access.',
        cons: 'Corporate feel, requires car/shuttle for everything.',
        connectionTime: '40 mins'
      },
      {
        neighborhood: 'Northampton',
        pros: 'Closer to track, good local pubs, cheaper than Milton Keynes.',
        cons: 'Traffic bottlenecks can be severe.',
        connectionTime: '30 mins'
      },
      {
        neighborhood: 'Oxford',
        pros: 'Historic beauty, great sightseeing for non-race hours.',
        cons: 'Longer commute, expensive boutique hotels.',
        connectionTime: '60 mins'
      }
    ],
    transportTimeline: {
      friday: { departure: '08:00', return: '17:30' },
      saturday: { departure: '07:00', return: '18:30' },
      sunday: { departure: '06:00', return: '19:00' }
    },
    expertSecrets: [
      'The Luffield corner allows you to see the cars for the longest duration of any spot.',
      'Book the Park & Ride from M40/Towcester for the fastest entry route.',
      'The bridge between the Fan Zone and Abbey is the best spot for driver sightings.',
      'Radio Silverstone (87.7 FM) is essential—bring a small portable radio.',
      'The "After Party" concerts are included in your ticket; stay late to avoid the first exit surge.'
    ],
    packingChecklist: [
      'Full waterproof jacket (Essential in the UK)',
      'Wellies or waterproof boots (Field parking can get muddy)',
      'Binoculars (For seeing across the massive circuit)',
      'Foldable camp chair (If in General Admission)',
      'Sunscreen (Yes, even in the UK, you will burn)',
      'Portable radio for commentary',
      'Hand sanitizer and tissues',
      'Layers (British weather can change every 20 minutes)',
      'Credit card (Silverstone is mostly cashless)',
      'Large backpack with rain cover'
    ]
  },
  barcelona: {
    name: 'Spanish Grand Prix',
    location: 'Circuit de Barcelona-Catalunya, Spain',
    detailedBudget: {
      foodDaily: '€30 - €60',
      trackTransport: '€10 - €15 (R2 Nord Train)',
      flightsAvg: '€120 - £350 (to El Prat)',
      miscellaneous: '€40 (Fan Zone merch)'
    },
    stayZones: [
      {
        neighborhood: 'Eixample (Barcelona)',
        pros: 'Central, amazing food, direct train to Montmeló.',
        cons: 'Very noisy at night, popular pickpocket area.',
        connectionTime: '45 mins'
      },
      {
        neighborhood: 'Poblenou',
        pros: 'Near the beach, modern hotels, quieter than center.',
        cons: 'Requires a metro ride before getting on the track train.',
        connectionTime: '60 mins'
      },
      {
        neighborhood: 'Granollers',
        pros: 'The closest significant town, avoid the city traffic.',
        cons: 'Very few hotels, nothing to do after the race.',
        connectionTime: '15 mins'
      }
    ],
    transportTimeline: {
      friday: { departure: '09:00', return: '18:00' },
      saturday: { departure: '08:00', return: '19:00' },
      sunday: { departure: '07:00', return: '19:30' }
    },
    expertSecrets: [
      'Take the train to Montmeló station and then use the local "Tractor" shuttles.',
      'Corner 1 (Grandstand G) is the best for overtaking action.',
      'The shade is nonexistent; stand under the trees near Turn 7 if GA and desperate.',
      'Avoid the main circuit exit after the race; walk to the town for tapas and wait 2 hours.',
      'Check the Sagrada Familia tickets 3 weeks out if you want to visit while in the city.'
    ],
    packingChecklist: [
      'Wide-brimmed hat (The sun is unrelenting)',
      'UV-blocking sunglasses',
      'Travel misting fan',
      'Comfortable sandals or breathable sneakers',
      'Spanish phrasebook (or app) for town orders',
      'Plenty of liquid IV or hydration salts',
      'Lightweight linen clothing',
      'Anti-theft belt or bag for the city center',
      'Track map downloaded to your phone',
      'Euro coins for shuttle buses'
    ]
  }
};
