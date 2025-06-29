import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Invoice {
  id: string;
  tokenId: string;
  amount: number;
  dueDate: string;
  status: 'active' | 'funded' | 'matured';
  discount?: number;
  business?: string;
}

interface InvoiceTableProps {
  title: string;
  invoices: Invoice[];
  type: 'seller' | 'buyer';
}

export const InvoiceTable = ({ title, invoices, type }: InvoiceTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/20 dark:bg-primary/20 dark:text-primary text-primary-foreground';
      case 'funded': return 'bg-secondary/20 dark:bg-secondary/20 dark:text-secondary text-secondary-foreground';
      case 'matured': return 'bg-yellow-500/20 ark:bg-yellow-500/20 dark:text-yellow-500  text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{invoice.amount} BTC</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  {invoice.business && (
                    <span className="text-sm text-muted-foreground">{invoice.business}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Due: {invoice.dueDate}</span>
                  <span>Token ID: {invoice.tokenId}</span>
                  {invoice.discount && (
                    <span className="text-muted-foreground">{invoice.discount}% discount</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {type === 'buyer' && invoice.status === 'active' && (
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Fund Invoice
                  </Button>
                )}
                {type === 'seller' && invoice.status === 'active' && (
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
