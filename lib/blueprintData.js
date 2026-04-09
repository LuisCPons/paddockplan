export const BLUEPRINT_DETAILS = {
  monza: {
    name: 'Italian Grand Prix',
    location: 'Monza, Italy',
    coordinates: { lat: 45.62, lng: 9.28 },
    raceMonth: 'September',
    detailedBudget: {
      foodDaily: { min: 40, max: 80, currency: 'EUR' },
      trackTransport: { min: 10, max: 20, currency: 'EUR', note: 'Train/Shuttle' },
      flightsAvg: { min: 150, max: 400, currency: 'EUR', note: 'to Milan' },
      miscellaneous: { min: 50, max: 50, currency: 'EUR', note: 'Merchandise & Buffer' }
    },
    emergencyInfo: {
      contact: '+39 039 24821',
      wifi: 'MonzaCircuit_Free',
      guideUrl: 'https://www.monzanet.it/en/'
    },
    stayZones: [
      {
        neighborhood: 'Milan Centrale',
        coordinates: { lat: 45.485, lng: 9.204 },
        pros: 'Direct train access to Monza, wide range of hotels.',
        cons: 'Crowded on race weekend, busy transit hub.',
        connectionTime: '35 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Milano+Centrale&query_place_id=ChIJQ1j3T8XGhkcRKs-XGhSxJiI'
      },
      {
        neighborhood: 'Monza Town',
        coordinates: { lat: 45.584, lng: 9.272 },
        pros: 'Walking distance to track gates, local atmosphere.',
        cons: 'Extremely limited availability, high premium prices.',
        connectionTime: '15-20 mins (Walk)',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Autodromo+Nazionale+Monza&query_place_id=ChIJfb1IDja6hkcRMqbTqfV-XmQ'
      },
      {
        neighborhood: 'Brera District (Milan)',
        coordinates: { lat: 45.471, lng: 9.189 },
        pros: 'Premium dining, beautiful architecture, great nightlife.',
        cons: 'Requires metro transfer to reach Centrale for the train.',
        connectionTime: '55 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Brera+District+Milan&query_place_id=ChIJCYiuC7PGhkcRz09nwZLNenU'
      }
    ],
    logistics: {
      publicTransport: {
        hubName: 'Milano Centrale',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Milano+Centrale&query_place_id=ChIJQ1j3T8XGhkcRKs-XGhSxJiI',
        timeline: {
          friday: { departure: '08:30', return: '18:00', note: 'Trenord S8/S11' },
          saturday: { departure: '07:30', return: '19:00', note: 'Increased Frequency' },
          sunday: { departure: '06:30', return: '19:30', note: 'The "Black" shuttle is fastest' }
        },
        tips: [
          'The Black Shuttle is the fastest route to the Ascari chicane.',
          'Validation of train tickets is mandatory in Milan; save your 50€ fine.'
        ]
      },
      privateCar: {
        hubName: 'Monza Circuit Parking',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Autodromo+Nazionale+Monza&query_place_id=ChIJfb1IDja6hkcRMqbTqfV-XmQ',
        timeline: {
          friday: { departure: '07:30', return: '18:00', note: 'Park & Ride Gold/Green' },
          saturday: { departure: '06:30', return: '19:00', note: 'Severe traffic expected' },
          sunday: { departure: '05:30', return: '20:30', note: 'Arrive 4h before lights out' }
        },
        tips: [
          'Park & Ride "Gold" or "Green" are the most reliable options.',
          'Avoid the inner track roads; walk from Vedano for faster exit.'
        ]
      }
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
    coordinates: { lat: 52.07, lng: -1.02 },
    raceMonth: 'July',
    detailedBudget: {
      foodDaily: { min: 30, max: 60, currency: 'GBP' },
      trackTransport: { min: 15, max: 30, currency: 'GBP', note: 'Park & Ride' },
      flightsAvg: { min: 100, max: 300, currency: 'GBP', note: 'to London' },
      miscellaneous: { min: 40, max: 40, currency: 'GBP', note: 'Programs & Ponchos' }
    },
    emergencyInfo: {
      contact: '+44 1327 320280',
      wifi: 'Silverstone_Guest_WiFi',
      guideUrl: 'https://www.silverstone.co.uk/'
    },
    stayZones: [
      {
        neighborhood: 'Milton Keynes',
        coordinates: { lat: 52.0406, lng: -0.7594 },
        pros: 'High hotel capacity, easy Park & Ride access.',
        cons: 'Corporate feel, requires car/shuttle for everything.',
        connectionTime: '40 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Milton+Keynes+City+Centre'
      },
      {
        neighborhood: 'Northampton',
        coordinates: { lat: 52.2405, lng: -0.9027 },
        pros: 'Closer to track, good local pubs, cheaper than Milton Keynes.',
        cons: 'Traffic bottlenecks can be severe.',
        connectionTime: '30 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Northampton+Station&query_place_id=ChIJT3_wR-QOd0gRAlLq5wPQoX8'
      },
      {
        neighborhood: 'Oxford',
        coordinates: { lat: 51.7520, lng: -1.2577 },
        pros: 'Historic beauty, great sightseeing for non-race hours.',
        cons: 'Longer commute, expensive boutique hotels.',
        connectionTime: '60 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oxford+City+Centre'
      }
    ],
    logistics: {
      publicTransport: {
        hubName: 'Northampton Station',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Northampton+Station&query_place_id=ChIJT3_wR-QOd0gRAlLq5wPQoX8',
        timeline: {
          friday: { departure: '08:00', return: '17:30', note: 'Shuttles from Wolverton/MK' },
          saturday: { departure: '07:00', return: '18:30', note: 'Peak shuttle demand' },
          sunday: { departure: '06:00', return: '19:00', note: 'Allow 2h for exit queue' }
        },
        tips: [
          'Pre-book your shuttle slots to avoid the longest queues.',
          'Bring a physical radio; track commentary is essential here.'
        ]
      },
      privateCar: {
        hubName: 'Silverstone Circuit',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Silverstone+Circuit&query_place_id=ChIJJWySI1gcd0gRpiTDkbWvQhE',
        timeline: {
          friday: { departure: '07:00', return: '17:30', note: 'Park & Ride M40' },
          saturday: { departure: '06:00', return: '18:30', note: 'Early arrival advised' },
          sunday: { departure: '05:00', return: '20:00', note: 'The Great Gate Exit' }
        },
        tips: [
          'Use the Park & Ride from M40/Towcester for the fastest entry route.',
          'Arrive at least 4 hours before the lights out on Sunday.'
        ]
      }
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
    coordinates: { lat: 41.57, lng: 2.26 },
    raceMonth: 'June',
    detailedBudget: {
      foodDaily: { min: 30, max: 60, currency: 'EUR' },
      trackTransport: { min: 10, max: 15, currency: 'EUR', note: 'R2 Nord Train' },
      flightsAvg: { min: 120, max: 350, currency: 'EUR', note: 'to El Prat' },
      miscellaneous: { min: 40, max: 40, currency: 'EUR', note: 'Fan Zone merch' }
    },
    emergencyInfo: {
      contact: '+34 938 717 200',
      wifi: 'Circuit_Barcelona_Catalunya',
      guideUrl: 'https://www.circuitcat.com/'
    },
    stayZones: [
      {
        neighborhood: 'Eixample (Barcelona)',
        coordinates: { lat: 41.3902, lng: 2.1540 },
        pros: 'Central, amazing food, direct train to Montmeló.',
        cons: 'Very noisy at night, popular pickpocket area.',
        connectionTime: '45 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Eixample+Barcelona'
      },
      {
        neighborhood: 'Poblenou',
        coordinates: { lat: 41.4000, lng: 2.2000 },
        pros: 'Near the beach, modern hotels, quieter than center.',
        cons: 'Requires a metro ride before getting on the track train.',
        connectionTime: '60 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Poblenou+Barcelona&query_place_id=ChIJoa4TSxWjpBIRM9ft9a1VYHo'
      },
      {
        neighborhood: 'Granollers',
        coordinates: { lat: 41.6078, lng: 2.2877 },
        pros: 'The closest significant town, avoid the city traffic.',
        cons: 'Very few hotels, nothing to do after the race.',
        connectionTime: '15 mins',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Granollers+City+Centre'
      }
    ],
    logistics: {
      publicTransport: {
        hubName: 'Barcelona-Sants',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Barcelona-Sants+Station',
        timeline: {
          friday: { departure: '09:00', return: '18:00', note: 'R2 Nord to Montmeló' },
          saturday: { departure: '08:00', return: '19:00', note: 'Sagrera transfer busy' },
          sunday: { departure: '07:00', return: '19:30', note: 'Expect heavy train crowds' }
        },
        tips: [
          'Take the train to Montmeló station and use the "Tractor" shuttles.',
          'Avoid the main circuit exit; walk to the town for tapas after.'
        ]
      },
      privateCar: {
        hubName: 'Circuit de Barcelona-Catalunya',
        hubUrl: 'https://www.google.com/maps/search/?api=1&query=Circuit+de+Barcelona-Catalunya',
        timeline: {
          friday: { departure: '08:00', return: '18:00', note: 'AP-7 Toll road' },
          saturday: { departure: '07:00', return: '19:00', note: 'Parking fills by 9am' },
          sunday: { departure: '06:00', return: '20:00', note: '4h wait likely at exit' }
        },
        tips: [
          'Pre-book parking or you will be stuck in a 5km dirt track queue.',
          'The AP-7 highway is fast but expensive; have your credit card ready.'
        ]
      }
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

