import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './pages/HomePage';
import { DealsPage } from './pages/DealsPage';
import { TaxesPage } from './pages/TaxesPage';
import { CashFlowPage } from './pages/CashFlowPage';
import { CompliancePage } from './pages/CompliancePage';
import { MarketTrendsPage } from './pages/MarketTrendsPage';
import { MyPeoplePage } from './pages/MyPeoplePage';
import { SettingsPage } from './pages/SettingsPage';
import { AIChatWidget } from './components/chat/AIChatWidget';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { homeData, dealsData, peopleData } from './data/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [deals, setDeals] = useState(dealsData.deals);
  const [people, setPeople] = useState(peopleData.people);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiInitialMessage, setAiInitialMessage] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [taxRate, setTaxRate] = useState(0.28); // Default 28% tax rate
  const [complianceItems, setComplianceItems] = useState(homeData.compliance.items);

  const updateDeal = (updatedDeal: any) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const deleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  const addDeal = (newDeal: any) => {
    const dealWithId = { ...newDeal, id: `deal_${Date.now()}` };
    setDeals(prev => [...prev, dealWithId]);
  };

  const updatePerson = (updatedPerson: any) => {
    setPeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  };

  const deletePerson = (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
  };

  const addPerson = (newPerson: any) => {
    const personWithId = { ...newPerson, id: `person_${Date.now()}` };
    setPeople(prev => [...prev, personWithId]);
  };

  const handleAIClick = (initialMessage?: string) => {
    setAiInitialMessage(initialMessage);
    setShowAIChat(true);
  };

  const markComplianceComplete = (itemId: string) => {
    setComplianceItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, status: 'completed' } : item))
    );
  };

  return (
    <div className={`min-h-screen text-base ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-neutral-950 text-neutral-100'}`}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onAIClick={() => handleAIClick()}
        theme={theme}
        complianceItems={complianceItems}
      />
      <main className={`ml-72 min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-neutral-950'}`}>
        <TopBar athlete={homeData.athlete} theme={theme} />
        {currentPage === 'home' && <HomePage theme={theme} onAIClick={handleAIClick} />}
        {currentPage === 'deals' && <DealsPage deals={deals} onUpdateDeal={updateDeal} onDeleteDeal={deleteDeal} onAddDeal={addDeal} theme={theme} />}
        {currentPage === 'taxes' && <TaxesPage theme={theme} taxRate={taxRate} onTaxRateChange={setTaxRate} />}
        {currentPage === 'cashflow' && <CashFlowPage theme={theme} />}
        {currentPage === 'compliance' && (
          <CompliancePage
            theme={theme}
            complianceItems={complianceItems}
            onMarkComplete={markComplianceComplete}
          />
        )}
        {currentPage === 'market' && <MarketTrendsPage onAIClick={handleAIClick} theme={theme} />}
        {currentPage === 'people' && <MyPeoplePage people={people} onUpdatePerson={updatePerson} onDeletePerson={deletePerson} onAddPerson={addPerson} theme={theme} />}
        {currentPage === 'settings' && <SettingsPage deals={deals} theme={theme} onThemeChange={setTheme} />}
      </main>

      {/* AI Chat Widget */}
      {showAIChat && (
        <AIChatWidget
          onClose={() => {
            setShowAIChat(false);
            setAiInitialMessage(undefined);
          }}
          initialMessage={aiInitialMessage}
          userData={{
            name: homeData.athlete.fullName,
            totalEarned: homeData.kpis.totalEarned,
            taxVault: homeData.kpis.taxVault,
            available: homeData.kpis.available,
            taxRate: taxRate, // Use the selected tax rate from state
            recentTransactions: homeData.recentActivity ? homeData.recentActivity.slice(0, 10).map((tx: any) => ({
              description: tx.description,
              amount: tx.amount,
              date: tx.date,
              category: tx.category
            })) : [],
            upcomingTasks: homeData.upcomingTasks ? homeData.upcomingTasks.map((task: any) => ({
              title: task.title,
              dueDate: task.dueDate
            })) : []
          }}
        />
      )}

      {/* Floating AI Assistant */}
      <FloatingAIAssistant
        userData={{
          name: homeData.athlete.fullName,
          totalEarned: homeData.kpis.totalEarned,
          taxVault: homeData.kpis.taxVault,
          available: homeData.kpis.available,
          taxRate: taxRate, // Use the selected tax rate from state
          recentTransactions: homeData.recentActivity ? homeData.recentActivity.slice(0, 10).map((tx: any) => ({
            description: tx.label || tx.description || 'Transaction',
            amount: tx.amount,
            date: tx.date,
            category: tx.type || tx.category || 'general'
          })) : [],
          upcomingTasks: homeData.upcoming ? homeData.upcoming.map((task: any) => ({
            title: task.label || task.title || 'Task',
            dueDate: task.date || task.dueDate || ''
          })) : []
        }}
      />
    </div>
  );
}
