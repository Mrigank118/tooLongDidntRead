
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Chatbot from './Chatbot';

import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HighlightedClause {
  id: string;
  text: string;
  risk: 'high' | 'moderate' | 'low';
  explanation: string;
  category: string;
}

const DocumentProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [highlightedClauses, setHighlightedClauses] = useState<HighlightedClause[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m TLDR, your AI assistant for insurance document analysis. Upload a document to get started, or ask me any questions about insurance policies.',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Remove Markdown stars and bold symbols from text
  const cleanMarkdown = (mdText: string) => {
    return mdText
      .replace(/\*\*/g, '')  // remove bold **
      .replace(/\*/g, '')    // remove italics and bullet *
      .trim();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Step 1: Upload file and extract clauses
      const extractResponse = await fetch('http://127.0.0.1:8000/extract-text/', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const extractData = await extractResponse.json();
      const { clauses } = extractData;

      // Prepare and set highlighted clauses
      setHighlightedClauses(clauses.map((clause: any, index: number) => ({
        id: index.toString(),
        text: clause.clause,
        risk: clause.prediction.risk,
        explanation: clause.prediction.explanation,
        category: clause.prediction.category,
      })));

   const prompt = `
You are an expert insurance analyst tasked with processing the details of an insurance policy. Given a policy document, identify and summarize the categories covered along with what each category provides. Additionally, extract any hidden clauses or special conditions that might not be prominently featured in marketing materials or are buried in the fine print.

Instructions:

1. **Identify Coverage Categories**: List the major categories covered in the policy such as:
   - Hospitalization Expenses
   - Pre-existing Conditions
   - Waiting Periods
   - Room Rent Limits
   - Co-payment
   - Day Care Treatment
   - Post-Hospitalization Coverage
   - Any Optional Covers (e.g., AYUSH, Organ Donor)
   - Any exclusions or additional features (e.g., Worldwide Coverage, Ambulance, etc.)

2. **Describe What it Provides**: For each category, describe what the insurance policy covers and the conditions of that coverage (e.g., sums insured, limits, types of treatments, etc.).

3. **Highlight Hidden Clauses/Special Conditions**: For each category, identify any hidden clauses or exclusions. This includes conditions like:
   - Waiting periods for specific treatments or pre-existing conditions.
   - Proportionate deductions for room rent if a higher category is selected.
   - Any exclusions for overseas treatment or specific conditions like maternity, animal bite vaccination, etc.
   - Limits on coverage such as sub-limits for specific treatments (e.g., AYUSH, organ donor, ambulance, etc.).
   - Any requirements for additional actions like co-payment or mandatory pre-authorization.

Return the result in the following format, ensuring the category name is **bold** and each description is separated clearly:

- **Pre-existing Conditions**:
  Coverage for pre-existing conditions is eventually provided.  
  Excluded from coverage for the first 12 months of the policy.

- **Exclusions (Experimental/Investigational Treatments)**:
  No coverage for experimental or investigational treatments.  
  This policy explicitly does not provide coverage for experimental or investigational treatments.

- **Emergency Room Visits**:
  Coverage for emergency room visits.  
  Prior authorization is required for emergency room visits, except in cases determined to be life-threatening emergencies.

- **Network/Provider Coverage (Out-of-Network)**:
  Coverage for services received from out-of-network providers.  
  Coverage for out-of-network providers is limited to 60% of costs, and is only applicable after a $2,000 deductible has been met.

- **Prescription Drugs**:
  Coverage for prescription drugs.  
  Prescription drugs are covered at 80% of the cost, but only after the general policy deductible has been met.

- **Preventive Care Services**:
  Full coverage for preventive care services.  
  Preventive care services are fully covered with no deductible applied.

Make sure to follow the format with **bold** category names and separate each section with a newline for better readability.
`;


      // Step 2: Automatically call summarize API with fixed query "summarize"
      const summarizeResponse = await fetch('http://127.0.0.1:8000/ask-question/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt }),
      });

      if (!summarizeResponse.ok) {
        throw new Error('Failed to summarize document');
      }

      const summarizeData = await summarizeResponse.json();

      // Clean the Markdown formatting from summary before setting it
      setSummary(cleanMarkdown(summarizeData.answer));

    } catch (error) {
      console.error("Error processing file:", error);
      setSummary("Failed to process or summarize document. Please try again.");
      setHighlightedClauses([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!message.trim()) return "Please ask a question.";

    try {
      const response = await fetch('http://127.0.0.1:8000/ask-question/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error('Error processing message');
      }

      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, I couldn\'t process your request. Please try again later.';
    }
  };

const handleDownloadReport = () => {
  if (!file) return;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("TLDR Insurance Policy Analysis Report", 14, 20);

  // Document info
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Document: ${file.name}`, 14, 30);
  doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 14, 37);

  // Add a line separator
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Executive Summary (with word wrap)
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("EXECUTIVE SUMMARY:", 14, 50);
  doc.setFontSize(11);

  // Clean summary before PDF in case there are extra characters
  const cleanSummary = cleanMarkdown(summary);
  const splitSummary = doc.splitTextToSize(cleanSummary, 182);
  doc.text(splitSummary, 14, 57);

  let yPosition = 57 + splitSummary.length * 7 + 10;

  // Helper to add Clauses Section
  const addClausesSection = (title: string, clauses: HighlightedClause[], startY: number) => {
    if (clauses.length === 0) return startY;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(title, 14, startY);
    doc.setFontSize(11);

    // Prepare data for table: [Index, Clause Text, Risk, Explanation]
    const body = clauses.map((clause, i) => [
      i + 1,
      clause.text,
      clause.risk.charAt(0).toUpperCase() + clause.risk.slice(1),
      clause.explanation,
    ]);

    autoTable(doc, {
      startY: startY + 5,
      head: [["#", "Clause Text", "Risk Level", "Explanation"]],
      body,
      styles: { fontSize: 9, cellWidth: 'wrap' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 80 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 70 },
      },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 10;
      },
    });

    return yPosition;
  };

  // Add High risk clauses
  yPosition = addClausesSection("HIGH-RISK CLAUSES:", highlightedClauses.filter(c => c.risk === "high"), yPosition);

  // Add Moderate risk clauses
  yPosition = addClausesSection("MODERATE-RISK CLAUSES:", highlightedClauses.filter(c => c.risk === "moderate"), yPosition);

  // Add Low risk clauses
  yPosition = addClausesSection("LOW-RISK CLAUSES:", highlightedClauses.filter(c => c.risk === "low"), yPosition);

  // Footer
  if (yPosition + 20 > 290) doc.addPage();

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Generated by TLDR - Insurance Policy Simplification Platform", 14, yPosition + 15);

  // Save PDF
  doc.save(`TLDR_Report_${file.name}`);
};

  return (
    <div className="w-full space-y-6">
      {/* File Upload Section */}
      <Card className="cosmic-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">Analyzing document...</p>
                  <p className="text-sm text-muted-foreground">Please wait while our AI processes your insurance policy</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-12 w-12 text-primary" />
                  <p className="text-lg font-medium">{file.name}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready for analysis
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">Upload your insurance document</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, TXT, DOC, and DOCX files</p>
                </div>
              )}
            </div>

            {file && !isProcessing && (
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                className="w-full mt-2"
              >
                Upload Different Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Summary Panel */}
          <Card className="cosmic-glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Executive Summary
              </CardTitle>
              <Button 
                onClick={handleDownloadReport}
                size="sm" 
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line text-foreground leading-relaxed">
                    {summary}
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Highlighted Clauses Panel */}
          <Card className="cosmic-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Clauses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {highlightedClauses.map((clause) => (
                    <div 
                      key={clause.id}
                      className={cn(
                        "p-4 rounded-lg border-l-4",
                        clause.risk === 'high' 
                          ? "bg-destructive/5 border-l-destructive" 
                          : clause.risk === 'low'
                            ? "bg-green-500/5 border-l-green-500"
                            : "bg-yellow-500/5 border-l-yellow-500"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge 
                          variant={clause.risk === 'high' ? 'destructive' : 'secondary'}
                          className={cn(
                            clause.risk === 'moderate' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                            clause.risk === 'low' && "bg-green-500/10 text-green-700 dark:text-green-400"
                          )}
                        >
                          {clause.risk.charAt(0).toUpperCase() + clause.risk.slice(1)} Risk
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {clause.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{clause.text}</p>
                      <p className="text-xs text-muted-foreground">{clause.explanation}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chatbot Panel */}
      <Card className="cosmic-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat with TLDR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chatbot onSendMessage={handleSendMessage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentProcessor;