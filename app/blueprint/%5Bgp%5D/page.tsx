import { BLUEPRINT_DETAILS } from '@/lib/blueprintData';
import { BlueprintDashboard } from '@/components/BlueprintDashboard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Object.keys(BLUEPRINT_DETAILS).map((gp) => ({
    gp: gp,
  }));
}

export default async function BlueprintPage({ params }: { params: Promise<{ gp: string }> }) {
  const gpKey = (await params).gp.toLowerCase();
  
  if (!gpKey) {
    notFound();
  }

  const data = (BLUEPRINT_DETAILS as any)[gpKey];

  if (!data) {
    notFound();
  }

  // Calculate total budget (average of ranges)
  const calculateTotal = () => {
    const parseRange = (range: string) => {
      const numbers = range.match(/\d+/g);
      if (!numbers) return 0;
      if (numbers.length === 1) return parseInt(numbers[0]);
      return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    };

    const food = parseRange(data.detailedBudget.foodDaily) * 3; // 3 days
    const transport = parseRange(data.detailedBudget.trackTransport) * 3;
    const flights = parseRange(data.detailedBudget.flightsAvg);
    const misc = parseRange(data.detailedBudget.miscellaneous);

    return Math.round(food + transport + flights + misc);
  };

  const totalBudget = calculateTotal();

  return <BlueprintDashboard data={data} totalBudget={totalBudget} />;
}
