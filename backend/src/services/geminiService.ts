import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate text content using Gemini
 */
export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error('❌ Gemini API Error:', error.message);
        throw new Error('Failed to generate AI response');
    }
};

/**
 * Generate structured JSON response from Gemini
 */
export const generateJSONContent = async <T>(prompt: string): Promise<T> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    let text: string;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
    } catch (error: any) {
        console.error('❌ Gemini API Error:', error.message);
        throw new Error('Failed to generate AI response');
    }

    try {
        // Try multiple extraction methods
        let jsonText = text;

        // Method 1: Extract from markdown code blocks
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        // Method 2: Extract JSON object/array
        const objectMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
        if (objectMatch && !jsonMatch) {
            jsonText = objectMatch[0];
        }

        // Clean up the text
        jsonText = jsonText.trim();

        return JSON.parse(jsonText);
    } catch (error: any) {
        console.error('❌ Gemini JSON Parse Error:', error.message, 'Raw text:', text.substring(0, 200));
        throw new Error('Failed to parse AI JSON response');
    }
};

/**
 * Test Gemini API connection
 */
export const testConnection = async (): Promise<boolean> => {
    try {
        await generateContent('Say "Hello" in one word');
        console.log('✅ Gemini API connection successful');
        return true;
    } catch (error) {
        console.error('❌ Gemini API connection failed');
        return false;
    }
};
