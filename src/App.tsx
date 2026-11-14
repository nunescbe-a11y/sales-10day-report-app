import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SalesProvider, useSales } from './context/SalesContext';
import { Header } from './components/Header';
import { MDDashboard } from './components/MDDashboard';
import { SalesRepView } from './components/SalesRepView';
import { AddEditSaleModal } from './components/AddEditSaleModal';
import { CycleManagerModal } from './components/CycleManagerModal';
import { AddRepModal } from './components/AddRepModal';
import { PasswordResetModal } from './components/PasswordResetModal';
import { ProfessionalLogin } from './components/ProfessionalLogin';
import { PortfolioLandingPage } from './components/3d-portfolio/PortfolioLandingPage';
import type { SaleItem } from './types';

const MainContent: React.FC = () => {
  const { isMD, session, theme } = useSales();

  // Direct access to Sales Hub - no login barrier
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isAddRepModalOpen, setIsAddRepModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState('md');
  const [itemToEdit, setItemToEdit] = useState<SaleItem | null>(null);

  const handleEditItem = (item: SaleItem) => {
    setItemToEdit(item);
    setIsAddModalOpen(true);
  };

  const handleAddNewItem = () => {
    setItemToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenReset = (username = 'md') => {
    setResetTargetUser(username);
    setIsResetModalOpen(true);
  };

  // Optional: 3D Creator Portfolio Landing Page (only if explicitly opened)
  if (showLandingPage) {
    return (
      <PortfolioLandingPage
        onDirectLogin={() => setShowLandingPage(false)}
      />
    );
  }

  // Clean, White & Simple Professional Login Gate (verifies exact person)
  if (!session.isAuthenticated) {
    return <ProfessionalLogin />;
  }

  return (
    <div className={`h-screen max-h-screen w-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0B0E] text-[#D7E2EA]' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Crisp Header - Fixed height */}
      <Header
        onOpenAddModal={handleAddNewItem}
        onOpenCycleModal={() => setIsCycleModalOpen(true)}
        onOpenAddRepModal={() => setIsAddRepModalOpen(true)}
      />

      {/* Main Viewport Container - Strictly Fills Height */}
      <main className="flex-1 h-full min-h-0 w-full px-3 sm:px-5 py-2 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {isMD ? (
            <motion.div
              key="md-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 h-full min-h-0 flex flex-col overflow-hidden"
            >
              <MDDashboard
                onEditItem={handleEditItem}
                onAddNewItem={handleAddNewItem}
                onOpenCycleModal={() => setIsCycleModalOpen(true)}
                onOpenResetPassword={handleOpenReset}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`rep-view-${session.repId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 h-full min-h-0 flex flex-col overflow-hidden"
            >
              <SalesRepView
                onEditItem={handleEditItem}
                onAddNewItem={handleAddNewItem}
                onOpenCycleManager={() => setIsCycleModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AddEditSaleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setItemToEdit(null);
        }}
        itemToEdit={itemToEdit}
        onOpenCycleModal={() => setIsCycleModalOpen(true)}
      />

      <CycleManagerModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
      />

      <AddRepModal
        isOpen={isAddRepModalOpen}
        onClose={() => setIsAddRepModalOpen(false)}
      />

      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        defaultUsername={resetTargetUser}
      />

      {/* Ultra-Compact Footer */}
      <footer className="border-t border-slate-200 bg-white py-1 px-4 sm:px-6 text-center text-[10px] text-slate-500 shrink-0">
        <div className="w-full flex items-center justify-between gap-2">
          <p className="font-semibold text-slate-600">
            10-Day Sales Reporting Suite
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>18% Standard GST</span>
            <span>•</span>
            <span>Formula: Sell Cost + GST + Pck + Fwd</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">100% Viewport Page-Fit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SalesProvider>
      <MainContent />
    </SalesProvider>
  );
}
