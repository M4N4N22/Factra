"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CreateInvoiceForm } from "@/components/dashboard/CreateInvoiceForm";
import { InvoiceMarketplace } from "@/components/dashboard/InvoiceMarketplace";
import { Footer } from "@/components/Footer";
import CreatedInvoices from "@/components/dashboard/invoice/CreatedInvoices";
import FundedInvoices from "@/components/dashboard/invoice/FundedInvoices";
import { InvoiceDetail } from "@/components/dashboard/invoice/InvoiceDetail";
import { RawInvoice } from "@/components/dashboard/DashboardStats";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Store, FilePlus, Images } from "lucide-react";
import { MyNFTs } from "@/components/dashboard/nft/MyNFTs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedInvoice, setSelectedInvoice] = useState<RawInvoice | null>(
    null
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Sidebar (fixed) */}
      <aside className="fixed top-[70px] left-0 w-56 h-[calc(100vh-80px)]  p-4 bg-card hidden md:block z-0 ">
        <span className="text-muted-foreground/70">Quick Menu</span>
        <nav className="flex flex-col gap-4 mt-4">
          <Button
            variant="ghost"
            className={cn(
              "justify-start",
              activeTab === "dashboard" && "bg-muted"
            )}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "justify-start",
              activeTab === "marketplace" && "bg-muted"
            )}
            onClick={() => setActiveTab("marketplace")}
          >
            <Store className="mr-2 h-4 w-4" />
            Marketplace
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "justify-start",
              activeTab === "create" && "bg-muted"
            )}
            onClick={() => setActiveTab("create")}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "justify-start",
              activeTab === "mynfts" && "bg-muted"
            )}
            onClick={() => setActiveTab("mynfts")}
          >
            <Images className="mr-2 h-4 w-4" />
            My NFTs
          </Button>
        </nav>
      </aside>

      <main className="flex-1 ml-56 min-h-[calc(100vh-40px)] mt-[50px]">
        {/* Main Content */}
        <div className="flex-1 px-6 py-12 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-12 overflow-hidden">
              <DashboardStats />

              <div className="flex flex-col lg:flex-row gap-8 overflow-hidden items-center">
                {/* Left side: invoice tables */}
                <div className="flex flex-col gap-12 flex-1 min-w-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Your Created Invoices
                    </h2>
                    <CreatedInvoices onSelectInvoice={setSelectedInvoice} />
                  </div>
                  <div>
                    <FundedInvoices onSelectInvoice={setSelectedInvoice} />
                  </div>
                </div>

                {/* Right side: invoice detail */}
                <div className="w-full lg:max-w-[350px] xl:max-w-[450px] shrink-0 overflow-auto shadow-lg rounded-xl">
                  <InvoiceDetail invoice={selectedInvoice} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "marketplace" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Invoice Marketplace</h2>
                  <p className="text-muted-foreground">
                    Fund invoices and earn yield on Bitcoin payments
                  </p>
                </div>
              </div>
              <InvoiceMarketplace />
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Create New Invoice</h2>
                <p className="text-muted-foreground">
                  Tokenize your Bitcoin invoice and get early access to funds
                </p>
              </div>
              <CreateInvoiceForm />
            </div>
          )}

          {activeTab === "mynfts" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">My Invoice NFTs</h2>
                <p className="text-muted-foreground">
                  View all NFTs you’ve received from tokenized invoices
                </p>
              </div>
              <MyNFTs />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
