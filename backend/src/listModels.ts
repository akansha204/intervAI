import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('🔍 Fetching available models...\n');

        // Try to list models - the API might not support this
        console.log('Trying to fetch models with your API key...\n');

        // Just try a known working model
        const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        console.log('✅ gemini-pro works!');
        console.log('Response:', response.text());

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.log('\nTry these models:');
        console.log('- models/gemini-pro');
        console.log('- models/gemini-1.5-flash');
        console.log('- models/gemini-1.5-pro');
    }
}

listModels();
