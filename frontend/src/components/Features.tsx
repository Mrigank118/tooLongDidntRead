import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Layers, Grid3x3, ListCheck, BookOpen, Star, LayoutDashboard } from "lucide-react";

const Features = () => {
  
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const { t } = useTranslation(); 
 const features = [
  {
    titleKey: 'featuresSection.featuresList.0.title',
    descriptionKey: 'featuresSection.featuresList.0.description',
    expandedDescriptionKey: 'featuresSection.featuresList.0.expandedDescription',
    icon: <BookOpen size={24} className="text-white" />,
  },
  {
    titleKey: 'featuresSection.featuresList.1.title',
    descriptionKey: 'featuresSection.featuresList.1.description',
    expandedDescriptionKey: 'featuresSection.featuresList.1.expandedDescription',
    icon: <Layers size={24} className="text-white" />,
  },
  {
    titleKey: 'featuresSection.featuresList.2.title',
    descriptionKey: 'featuresSection.featuresList.2.description',
    expandedDescriptionKey: 'featuresSection.featuresList.2.expandedDescription',
    icon: <LayoutDashboard size={24} className="text-white" />,
  },
  {
    titleKey: 'featuresSection.featuresList.3.title',
    descriptionKey: 'featuresSection.featuresList.3.description',
    expandedDescriptionKey: 'featuresSection.featuresList.3.expandedDescription',
    icon: <ListCheck size={24} className="text-white" />,
  },
  {
    titleKey: 'featuresSection.featuresList.4.title',
    descriptionKey: 'featuresSection.featuresList.4.description',
    expandedDescriptionKey: 'featuresSection.featuresList.4.expandedDescription',
    icon: <Star size={24} className="text-white" />,
  },
  {
    titleKey: 'featuresSection.featuresList.5.title',
    descriptionKey: 'featuresSection.featuresList.5.description',
    expandedDescriptionKey: 'featuresSection.featuresList.5.expandedDescription',
    icon: <Grid3x3 size={24} className="text-white" />,
  }
];


  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };

  return (
    <section id="features" className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">
             {t('featuresSection.title')}
          </h2>
          <p className="text-cosmic-muted text-lg">
            {t('featuresSection.subtitle')}          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Collapsible
              key={index}
              open={openFeature === index}
              onOpenChange={() => toggleFeature(index)}
              className={`rounded-xl border ${openFeature === index ? 'border-cosmic-light/40' : 'border-cosmic-light/20'} cosmic-gradient transition-all duration-300`}
            >
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-cosmic-muted transition-transform duration-200 ${
                      openFeature === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3">{t(feature.titleKey)}</h3>
                <p className="text-cosmic-muted">{t(feature.descriptionKey)}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-cosmic-light/10">
                  <p className="text-cosmic-muted">{t(feature.expandedDescriptionKey)}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm font-medium">
                      {t('featuresSection.learnMore')}
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
