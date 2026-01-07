import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AIPersonalPlan } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFitnessPlan(profile: UserProfile): Promise<AIPersonalPlan> {
  const prompt = `Crie um plano de fitness e nutrição para um usuário com o seguinte perfil:
    - Nome: ${profile.name}
    - Idade: ${profile.age}
    - Sexo: ${profile.sex}
    - Peso: ${profile.weight}kg
    - Altura: ${profile.height}cm
    - Objetivo: ${profile.goal}
    - Nível: ${profile.level}
    - Local de treino: ${profile.location}
    - Dias disponíveis por semana: ${profile.daysPerWeek}
    
    O plano deve ser focado em alimentos comuns no Brasil. O plano de treino deve ser dividido em Treino A, B e C.
    Considere um déficit calórico moderado para o objetivo de emagrecimento.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalDailyCalories: { type: Type.NUMBER },
          workouts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["name", "sets", "reps", "rest", "description"]
                  }
                }
              },
              required: ["title", "exercises"]
            }
          },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } },
                calories: { type: Type.NUMBER }
              },
              required: ["time", "title", "items", "calories"]
            }
          }
        },
        required: ["totalDailyCalories", "workouts", "meals"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as AIPersonalPlan;
  } catch (error) {
    console.error("Erro ao parsear plano da IA:", error);
    throw new Error("Falha ao gerar seu plano personalizado.");
  }
}