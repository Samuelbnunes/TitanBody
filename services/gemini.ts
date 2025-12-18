
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, TrainingPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBodybuildingPlan = async (profile: UserProfile): Promise<TrainingPlan> => {
  const prompt = `
    Crie um plano de treino de musculação completo e profissional para o seguinte perfil:
    Nome: ${profile.name}
    Idade: ${profile.age} anos
    Peso: ${profile.weight}kg
    Altura: ${profile.height}cm
    Experiência: ${profile.experience}
    Frequência: ${profile.daysPerWeek} dias por semana
    Foco: ${profile.focusArea}
    
    O plano deve seguir as metodologias de Bodybuilding mais eficazes (PPL, Arnold Split, Upper/Lower, etc.) dependendo da frequência.
    Gere exercícios específicos, séries, repetições (com base no foco do usuário), carga inicial sugerida em kg (baseada no peso e experiência do usuário) e tempo de descanso.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          methodology: { type: Type.STRING, description: "Breve explicação da metodologia escolhida." },
          workouts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: "Ex: Treino A - Peito e Tríceps" },
                description: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      muscleGroup: { type: Type.STRING },
                      sets: { type: Type.INTEGER },
                      reps: { type: Type.STRING },
                      weight: { type: Type.NUMBER },
                      restTime: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ["id", "name", "sets", "reps", "weight", "restTime"]
                  }
                }
              },
              required: ["id", "name", "exercises"]
            }
          }
        },
        required: ["methodology", "workouts"]
      }
    }
  });

  const rawPlan = JSON.parse(response.text);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    methodology: rawPlan.methodology,
    workouts: rawPlan.workouts
  };
};
