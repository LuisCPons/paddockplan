export type GP = 'Monza' | 'Silverstone' | 'Monaco' | 'Austin';
export type BudgetLevel = 'Value' | 'Standard' | 'Premium';
export type TripLength = 'Race Day' | 'Weekend' | 'Full Trip';
export type TravelStyle = 'Solo' | 'Couple' | 'Group';

export const GP_MAPPINGS: Record<GP, { baseCost: number, currency: string, tips: string[] }> = {
  'Monza': {
    baseCost: 350,
    currency: '€',
    tips: ['Book trains from Milan early.', 'Pack sun protection for the Parabolica.', 'General Admission fills up fast, arrive by 7AM.']
  },
  'Silverstone': {
    baseCost: 400,
    currency: '£',
    tips: ['Prepare for all four seasons in one day.', 'Camping is part of the classic Silverstone experience.', 'Book park-and-ride well in advance.']
  },
  'Monaco': {
    baseCost: 900,
    currency: '€',
    tips: ['Stay in Nice and take the train in.', 'Comfortable shoes are a must for the hills.', 'Many bars require smart casual attire.']
  },
  'Austin': {
    baseCost: 500,
    currency: '$',
    tips: ['Stay hydrated, the Texas sun is fierce.', 'Explore downtown Austin for great post-race concerts.', 'Shuttle wait times can be long, plan accordingly.']
  }
};

export function calculateEstimate(
  gp: GP,
  budget: BudgetLevel,
  length: TripLength,
  style: TravelStyle
) {
  const gpData = GP_MAPPINGS[gp];
  
  // Calculate Ticket Type
  let ticketType = 'Grandstand';
  if (budget === 'Value') ticketType = 'General Admission';
  if (budget === 'Premium') ticketType = 'VIP / Paddock Club';

  // Calculate Stay Style
  let stayStyle = 'City Hotel';
  if (budget === 'Value') stayStyle = 'Camping / Budget Airbnb';
  if (budget === 'Premium') stayStyle = '5-Star Hotel / Trackside Yacht';

  // Calculate Cost
  let multiplier = 1;
  if (budget === 'Standard') multiplier *= 1.8;
  if (budget === 'Premium') multiplier *= 5.5;

  if (length === 'Weekend') multiplier *= 1.5;
  if (length === 'Full Trip') multiplier *= 2.5;

  if (style === 'Couple') multiplier *= 1.8;
  if (style === 'Group') multiplier *= 3.5;

  const totalCost = Math.round(gpData.baseCost * multiplier);

  // Return Output
  return {
    suggestedBudget: `${gpData.currency}${totalCost.toLocaleString()}`,
    ticketType,
    stayStyle,
    tips: gpData.tips
  };
}
