
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { storageService } from '../services/storage';
import { AppData, TrainingPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou seu treinador Titan. Como posso ajustar seus treinos hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const data = storageService.getData();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const prompt = `
        Você é o TitanBody AI, um coach de fisiculturismo de elite. 
        O usuário está conversando com você. Ele possui o seguinte perfil: ${JSON.stringify(data.profile)}.
        O plano de treino atual dele é: ${JSON.stringify(data.currentPlan)}.

        OBJETIVO: Responda as dúvidas do usuário de forma motivadora e técnica (bodybuilding).
        Se o usuário pedir para mudar o treino, você pode sugerir um NOVO plano completo.
        Para atualizar o plano, você DEVE retornar sua resposta em formato JSON contendo um campo "text" (sua resposta em linguagem natural) e um campo opcional "newPlan" que segue a estrutura de TrainingPlan definida anteriormente.

        Exemplo de formato de resposta esperado se houver mudança de treino:
        {
          "text": "Com certeza! Vamos focar mais em membros inferiores agora...",
          "newPlan": { ... estrutura de TrainingPlan ... }
        }

        Se não houver mudança de treino, apenas responda normalmente em texto.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [
          { role: 'user', parts: [{ text: prompt + "\n\nMensagem do usuário: " + userMsg }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text);
      
      if (result.newPlan) {
        storageService.savePlan(result.newPlan);
        setMessages(prev => [...prev, { role: 'ai', text: result.text + " (Treino Atualizado!)" }]);
      } else if (typeof result === 'string') {
        setMessages(prev => [...prev, { role: 'ai', text: result }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: result.text || "Entendido." }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Desculpe, tive um problema técnico. Pode repetir?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-black flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
          Titan AI Coach
        </h1>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-4 rounded-3xl rounded-tl-none border border-zinc-800">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Pergunte qualquer coisa..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-emerald-500 shadow-xl"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
