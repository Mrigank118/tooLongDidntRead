// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Bot, User, Send } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useTranslation } from 'react-i18next';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// interface ChatbotProps {
//   onSendMessage: (message: string) => Promise<string>;
// }

// const Chatbot: React.FC<ChatbotProps> = ({ onSendMessage }) => {
//   const { t } = useTranslation();

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: 'assistant',
//       content: t("chatbot.welcome"),
//       timestamp: new Date(),
//     }
//   ]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSendMessage = async () => {
//     if (!currentMessage.trim()) return;

//     const userMessage: Message = {
//       role: 'user',
//       content: currentMessage,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setCurrentMessage('');
//     setIsTyping(true);

//     try {
//       const assistantMessageContent = await onSendMessage(currentMessage);
//       const assistantMessage: Message = {
//         role: 'assistant',
//         content: assistantMessageContent,
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, assistantMessage]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       const errorMessage: Message = {
//         role: 'assistant',
//         content: t("chatbot.error"),
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div className="w-full space-y-6">
//       <ScrollArea className="h-[300px] border rounded-lg p-4 bg-background/50">
//         <div className="space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={cn(
//                 "flex gap-3",
//                 message.role === 'user' ? "justify-end" : "justify-start"
//               )}
//             >
//               {message.role === 'assistant' && (
//                 <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
//                   <Bot className="h-4 w-4 text-primary-foreground" />
//                 </div>
//               )}

//               <div
//                 className={cn(
//                   "max-w-[80%] p-3 rounded-lg",
//                   message.role === 'user'
//                     ? "bg-primary text-primary-foreground ml-auto"
//                     : "bg-muted"
//                 )}
//               >
//                 <p className="text-sm">{message.content}</p>
//                 <p className="text-xs opacity-70 mt-1">
//                   {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </p>
//               </div>

//               {message.role === 'user' && (
//                 <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
//                   <User className="h-4 w-4" />
//                 </div>
//               )}
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex gap-3 justify-start">
//               <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
//                 <Bot className="h-4 w-4 text-primary-foreground" />
//               </div>
//               <div className="bg-muted p-3 rounded-lg">
//                 <div className="flex gap-1">
//                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       <div className="flex gap-2">
//         <Input
//           value={currentMessage}
//           onChange={(e) => setCurrentMessage(e.target.value)}
//           placeholder={t("chatbot.placeholder")}
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//           className="flex-1"
//         />
//         <Button
//           onClick={handleSendMessage}
//           disabled={!currentMessage.trim() || isTyping}
//           size="icon"
//         >
//           <Send className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';


interface Message {
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
}


interface ChatbotProps {
 onSendMessage: (message: string) => Promise<string>;
}


const Chatbot: React.FC<ChatbotProps> = ({ onSendMessage }) => {
 const [messages, setMessages] = useState<Message[]>([
   {
     role: 'assistant',
     content: "Hello! I'm your AI assistant. Ask me anything about your insurance policy.",
     timestamp: new Date(),
   }
 ]);
 const [currentMessage, setCurrentMessage] = useState('');
 const [isTyping, setIsTyping] = useState(false);


 const handleSendMessage = async () => {
   if (!currentMessage.trim()) return;


   const userMessage: Message = {
     role: 'user',
     content: currentMessage,
     timestamp: new Date(),
   };


   setMessages(prev => [...prev, userMessage]);
   setCurrentMessage('');
   setIsTyping(true);


   try {
     const assistantMessageContent = await onSendMessage(currentMessage); // Call the passed function
     const assistantMessage: Message = {
       role: 'assistant',
       content: assistantMessageContent,
       timestamp: new Date(),
     };
     setMessages(prev => [...prev, assistantMessage]);
   } catch (error) {
     console.error("Error sending message:", error);
     const errorMessage: Message = {
       role: 'assistant',
       content: "Sorry, I couldn't process your request. Please try again later.",
       timestamp: new Date(),
     };
     setMessages(prev => [...prev, errorMessage]);
   } finally {
     setIsTyping(false);
   }
 };


 return (
   <div className="w-full space-y-6">
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
 );
};


// Frontend function to call API
const onSendMessage = async (message: string) => {
 try {
   // Use POST request for the /ask-question route
   const response = await fetch(`http://localhost:8000/ask-question/?query=${encodeURIComponent(message)}`, {
     method: "POST",   
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ query: message }), // Sending the message in JSON
   });


   const data = await response.json();
   return data.answer; // Return the assistant's answer
 } catch (error) {
   console.error("Error in API call:", error);
   return "Sorry, I couldn't fetch an answer right now. Please try again later.";
 }
};




export default Chatbot;




