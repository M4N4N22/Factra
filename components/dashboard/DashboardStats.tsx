import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Outstanding Invoices',
      value: '12',
      subtext: '4.2 BTC total',
      trend: '+2 this week'
    },
    {
      title: 'Purchased Invoices',
      value: '8',
      subtext: '2.1 BTC invested',
      trend: '+1 this week'
    },
    {
      title: 'Available Balance',
      value: '2.3457 BTC',
      subtext: '$95,234.50',
      trend: '+5.2% this month'
    },
    {
      title: 'Expected Payouts',
      value: '2.8 BTC',
      subtext: 'Next 30 days',
      trend: '3 invoices maturing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-sm text-muted-foreground mt-1">{stat.subtext}</p>
            <p className="text-xs text-primary-foreground bg-primary font-semibold w-fit px-4 p-1 rounded-full mt-2">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
