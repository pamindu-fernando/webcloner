import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
You are an expert Frontend Engineer specializing in React, HTML, and Tailwind CSS.
Your goal is to accept a screenshot of a website and replicate it as faithfully as possible using a SINGLE HTML file.

Technical Constraints:
1. Use HTML5 and Tailwind CSS (via CDN) for styling.
2. DO NOT use external CSS files.
3. DO NOT use any React logic or imports in the output HTML (it should be pure HTML/JS suitable for an iframe).
4. Use standard <img> tags with "https://picsum.photos/width/height" for placeholder images. Try to estimate the correct aspect ratio.
5. Use "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" for icons if needed.
6. The layout MUST be responsive (mobile-first approach).
7. Ensure high contrast and accessibility best practices.
8. Make the design look modern, clean, and professional.

Output Format:
Return the result inside a standard markdown code block labeled 'html'.
Example:
\`\`\`html
<!DOCTYPE html>
...
\`\`\`
`;

export const generateWebsiteFromImage = async (base64Image: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    // We use gemini-3-pro-preview for complex coding tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG, but API is flexible with standard image types
              data: base64Image
            }
          },
          {
            text: "Turn this screenshot into a fully functional, responsive HTML website using Tailwind CSS. Replicate the layout, colors, and typography as closely as possible."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Using a high thinking budget if available for better code structure, 
        // but since this is a visual replication task, standard reasoning is usually enough.
        // We'll stick to standard generation configuration.
        temperature: 0.4, // Lower temperature for more deterministic code
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // Extract HTML from markdown code blocks
    const match = text.match(/```html\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Fallback: if no code blocks, return raw text if it looks like HTML
    if (text.includes("<!DOCTYPE html>")) {
      return text;
    }

    throw new Error("Could not parse HTML from response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};