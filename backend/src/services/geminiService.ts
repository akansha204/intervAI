import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    logger.error({ err: error }, 'Gemini API error');
    throw new Error('Failed to generate AI response');
  }
};

export const generateJSONContent = async <T>(prompt: string): Promise<T> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    logger.debug({ snippet: text.substring(0, 200) }, 'Gemini raw response');

    let jsonText = text;

    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const objectMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
    if (objectMatch && !jsonMatch) {
      jsonText = objectMatch[0];
    }

    jsonText = jsonText.trim();
    return JSON.parse(jsonText) as T;
  } catch (error: unknown) {
    logger.error({ err: error }, 'Gemini JSON parse error');
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
