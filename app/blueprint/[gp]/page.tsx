import { BLUEPRINT_DETAILS } from '@/lib/blueprintData';
import { BlueprintDashboard } from '@/components/BlueprintDashboard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Object.keys(BLUEPRINT_DETAILS).map((gp) => ({
    gp: gp,
  }));
}

export default async function BlueprintPage({ params }: { params: Promise<{ gp: string }> }) {
  const gpKey = (await params)?.gp?.toLowerCase();
  
  if (!gpKey) {
    notFound();
  }

  const data = (BLUEPRINT_DETAILS as any)[gpKey];

  if (!data) {
    notFound();
  }

  // Calculate total budget (average of ranges) in local currency
  const calculateTotal = () => {
    const getAvg = (item: any) => (item.min + item.max) / 2;

    const food = getAvg(data.detailedBudget.foodDaily) * 3; // 3 days
    const transport = getAvg(data.detailedBudget.trackTransport) * 3;
    const flights = getAvg(data.detailedBudget.flightsAvg);
    const misc = getAvg(data.detailedBudget.miscellaneous);

    return Math.round(food + transport + flights + misc);
  };

  const totalBudget = {
    amount: calculateTotal(),
    currency: data.detailedBudget.foodDaily.currency
  };

  return <BlueprintDashboard data={data} totalBudget={totalBudget} gpKey={gpKey} />;
}
