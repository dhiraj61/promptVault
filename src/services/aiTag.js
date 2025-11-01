import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function generateTag(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Give the three precise tag seperated by comma for given prompt:${prompt}`,
  });
  return response.text;
}

module.exports = generateTag;
