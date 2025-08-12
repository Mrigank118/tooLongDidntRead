import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Layers, Grid3x3, ListCheck, BookOpen, Star, LayoutDashboard } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  const features = [
    {
      title: "AI Document Analysis",
      description: "Upload insurance policies and get instant AI-powered analysis and summaries.",
      expandedDescription: "Our advanced AI processes complex insurance documents in seconds, extracting key information and creating easy-to-understand summaries. Upload PDFs, DOCs, or text files and get comprehensive analysis including coverage details, exclusions, and important terms.",
      icon: (
        <BookOpen size={24} className="text-white" />
      )
    },
    {
      title: "Risk Clause Detection",
      description: "Automatically identify and highlight high-risk clauses in your insurance policies.",
      expandedDescription: "TLDR scans your documents for potentially problematic clauses, categorizing them by risk level. High-risk clauses are highlighted in red, moderate-risk in orange, with detailed explanations of why each clause matters to you personally.",
      icon: (
        <Layers size={24} className="text-white" />
      )
    },
    {
      title: "Interactive AI Chatbot",
      description: "Ask specific questions about your policy and get instant, accurate answers.",
      expandedDescription: "Chat with TLDR about your uploaded documents. Ask questions like 'Does this cover cancer treatments?' or 'What's my deductible?' and get clear, contextual answers based on your specific policy terms.",
      icon: (
        <LayoutDashboard size={24} className="text-white" />
      )
    },
    {
      title: "Executive Summaries",
      description: "Transform dense legal language into clear, digestible summaries.",
      expandedDescription: "Never struggle with complex insurance jargon again. Our AI creates concise executive summaries that highlight key benefits, coverage limits, deductibles, and important policy details in plain English.",
      icon: (
        <ListCheck size={24} className="text-white" />
      )
    },
    {
      title: "Downloadable Reports",
      description: "Generate comprehensive risk analysis reports for your records.",
      expandedDescription: "Download detailed PDF reports containing your policy summary, highlighted clauses, risk assessments, and explanations. Perfect for sharing with family members, financial advisors, or keeping for your records.",
      icon: (
        <Star size={24} className="text-white" />
      )
    },
    {
      title: "Multi-Format Support",
      description: "Upload documents in various formats including PDF, DOC, and TXT files.",
      expandedDescription: "TLDR supports all major document formats. Whether your insurance policy is a PDF from your provider, a Word document, or plain text, our platform can analyze it and provide comprehensive insights.",
      icon: (
        <Grid3x3 size={24} className="text-white" />
      )
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
            Powerful Features for Insurance Clarity
          </h2>
          <p className="text-cosmic-muted text-lg">
            Advanced AI tools to help you understand insurance policies quickly and make informed decisions
          </p>
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
                <h3 className="text-xl font-medium tracking-tighter mb-3">{feature.title}</h3>
                <p className="text-cosmic-muted">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-cosmic-light/10">
                  <p className="text-cosmic-muted">{feature.expandedDescription}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm font-medium">
                      Learn more →
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
