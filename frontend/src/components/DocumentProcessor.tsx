import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';


import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Send,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HighlightedClause {
  id: string;
  text: string;
  risk: 'high' | 'moderate';
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
  
    setFile(selectedFile);
    setIsProcessing(true);
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      // Send file to the backend API for processing using fetch
      const response = await fetch('http://127.0.0.1:8000/extract-text/', {
        method: 'POST',
        body: formData, // Send FormData directly in the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      const data = await response.json();
  
      // Assuming the API returns an object similar to the example you provided
      const { clauses } = data;
  
      // Create a summary with all the clauses
      const summaryText = clauses.map((clause: any, index: number) => 
        `${index + 1}. ${clause.clause}`).join("\n");
  
      // Set the summary to print all clauses
      setSummary(summaryText);
  
      // Process the clauses for the highlightedClauses
      setHighlightedClauses(clauses.map((clause: any, index: number) => ({
        id: index.toString(),
        text: clause.clause,
        risk: clause.prediction.risk,
        explanation: clause.prediction.explanation,
        category: clause.prediction.category,
      })));
  
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error (show a notification or alert)
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = [
      "Based on your uploaded document, this policy does cover cancer treatments, but only after the 12-month waiting period for pre-existing conditions if cancer was previously diagnosed.",
      "The policy covers prescription medications at 80% after you meet your $1,000 deductible. Brand-name drugs may require prior authorization.",
      "For emergency situations, you're covered at 100% if it's truly life-threatening. However, non-emergency ER visits may require prior authorization.",
      "The annual out-of-pocket maximum for this policy is $8,000 for individual coverage and $16,000 for family coverage."
    ];

    const assistantMessage: Message = {
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    const reportContent = `TLDR Insurance Policy Analysis Report

Document: ${file?.name || 'Insurance Policy'}
Analysis Date: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
${summary}

HIGH-RISK CLAUSES:
${highlightedClauses.filter(c => c.risk === 'high').map((clause, i) => `${i + 1}. ${clause.text}\n   Risk: ${clause.explanation}\n`).join('\n')}

MODERATE-RISK CLAUSES:
${highlightedClauses.filter(c => c.risk === 'moderate').map((clause, i) => `${i + 1}. ${clause.text}\n   Risk: ${clause.explanation}\n`).join('\n')}

Generated by TLDR - Insurance Policy Simplification Platform`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TLDR_Report_${file?.name || 'Policy'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                className="w-full"
              >
                Upload Different Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                Download Report
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
                          : "bg-yellow-500/5 border-l-yellow-500"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge 
                          variant={clause.risk === 'high' ? 'destructive' : 'secondary'}
                          className={cn(
                            clause.risk === 'moderate' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          )}
                        >
                          {clause.risk === 'high' ? 'High Risk' : 'Moderate Risk'}
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
          <div className="space-y-4">
            <ScrollArea className="h-[300px] border rounded-lg p-4 bg-background/50">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div 
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        message.role === 'user' 
                          ? "bg-primary text-primary-foreground ml-auto" 
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask TLDR about your insurance policy..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentProcessor;