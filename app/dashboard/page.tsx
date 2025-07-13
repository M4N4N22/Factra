"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InvoiceTable } from '@/components/dashboard/InvoiceTable';
import { CreateInvoiceForm } from '@/components/dashboard/CreateInvoiceForm';
import { InvoiceMarketplace } from '@/components/dashboard/InvoiceMarketplace';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const sellerInvoices = [
    {
      id: '1',
      tokenId: 'TKN-001',
      amount: 0.5,
      dueDate: '2024-02-15',
      status: 'active' as const
    },
    {
      id: '2',
      tokenId: 'TKN-002',
      amount: 1.2,
      dueDate: '2024-02-28',
      status: 'funded' as const
    }
  ];

  const buyerInvoices = [
    {
      id: '3',
      tokenId: 'TKN-003',
      amount: 0.8,
      dueDate: '2024-03-01',
      status: 'active' as const,
      business: 'TechCorp Ltd',
      discount: 8.5
    },
    {
      id: '4',
      tokenId: 'TKN-004',
      amount: 0.3,
      dueDate: '2024-01-30',
      status: 'matured' as const,
      business: 'Retail Solutions',
      discount: 12.0
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Factra
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock liquidity from your future Bitcoin payments
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <DashboardStats />
            
            <div className=" gap-8 lg:grid-cols-2 hidden">
              <InvoiceTable
                title="Your Invoices"
                invoices={sellerInvoices}
                type="seller"
              />
              <InvoiceTable
                title="Your Investments"
                invoices={buyerInvoices}
                type="buyer"
              />
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Invoice Marketplace</h2>
                <p className="text-muted-foreground">
                  Fund invoices and earn yield on Bitcoin payments
                </p>
              </div>
            </div>
            <InvoiceMarketplace />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Create New Invoice</h2>
              <p className="text-muted-foreground">
                Tokenize your Bitcoin invoice and get early access to funds
              </p>
            </div>
            <CreateInvoiceForm />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
