import React from 'react';
import DocumentProcessor from './DocumentProcessor';
import { useTranslation } from 'react-i18next';

const DashboardPreview = () => {
  const { t } = useTranslation();

  return (
    <section id="dashboard" className="w-full py-12 md:py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">
            {t("dashboard.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("dashboard.description")}
          </p>
        </div>
        
        <div className="relative rounded-xl overflow-hidden border border-border cosmic-glow">
          <div className="absolute inset-0 cosmic-grid opacity-20"></div>
          <div className="relative bg-card/50 backdrop-blur-sm p-6 md:p-8">
            <DocumentProcessor />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
