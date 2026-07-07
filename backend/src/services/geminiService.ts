import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const MODEL_NAME = 'gemini-3-flash-preview';

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

    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const objectMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
    if (objectMatch && !jsonMatch) {
      jsonText = objectMatch[0];
    }

    // Clean up the text
    jsonText = jsonText.trim();

    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error(
      '❌ Gemini JSON Parse Error:',
      error.message,
      'Raw text:',
      text.substring(0, 200),
    );
    throw new Error('Failed to parse AI JSON response');
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await generateContent('Say "Hello" in one word');
    logger.info('Gemini API connection successful');
    return true;
  } catch {
    logger.error('Gemini API connection failed');
    return false;
  }
};
