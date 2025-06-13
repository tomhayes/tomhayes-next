import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Authentic oblique strategies as fallback
const authenticStrategies = [
  "Use an old idea",
  "What would your closest friend do?",
  "Honor thy error as a hidden intention",
  "Try fasting",
  "What to increase? What to reduce?",
  "Are there sections? Consider transitions",
  "Don't be frightened of clichés",
  "What mistakes did you make last time?",
  "Only one element of each kind",
  "The inconsistency principle",
  "Go slowly all the way round the outside",
  "Infinitesimal gradations",
  "Repetition is a form of change",
  "You can only make one dot at a time",
  "Trust in the you of now",
  "What are you really thinking about just now? Incorporate",
  "Work at a different speed",
  "Look closely at the most embarrassing details and amplify them",
  "Towards the insignificant",
  "Accept advice",
  "Describing is discovering",
  "Children's voices -speaking -singing",
  "Do the washing up",
  "Use filters",
  "Now that you have 4 minutes left, what will you do?",
  "Is it finished?",
  "Put in earplugs",
  "Take a break",
  "Fill every beat with something",
  "What sections do you need?",
  "Use fewer notes",
  "What context would look right?",
  "Cluster analysis",
  "Do the words need changing?",
  "Emphasise the flaws",
  "Voice your suspicions",
  "Remove ambiguities and convert to specifics",
  "What would happen if you crushed it to 1/10 of its size?",
  "Can you make it more human?",
  "You don't have to be ashamed of using your own ideas"
];

const genAI = process.env.GOOGLE_AI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

interface GenerationOptions {
  count: number;
  length: 'concise' | 'medium' | 'verbose';
  moods: string[];
}

// Keep GET for backwards compatibility
export async function GET() {
  return generateStrategies({ count: 1, length: 'concise', moods: [] });
}

// New POST endpoint with options
export async function POST(request: Request) {
  try {
    const options: GenerationOptions = await request.json();
    return generateStrategies(options);
  } catch (error) {
    console.error('Error parsing request:', error);
    return generateStrategies({ count: 1, length: 'concise', moods: [] });
  }
}

async function generateStrategies(options: GenerationOptions) {
  try {
    const { count, length, moods } = options;

    // Only try to generate using Gemini - no fallbacks to authentic strategies
    if (!genAI) {
      return NextResponse.json({
        error: 'AI service is not configured. Please check API key configuration.'
      }, { status: 500 });
    }

    if (count <= 0) {
      return NextResponse.json({
        error: 'Invalid count specified'
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.9,
      }
    });
    
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timeout')), 8000);
    });
    
    // Build length description
    const lengthDescriptions = {
      concise: "very brief (3-8 words maximum)",
      medium: "moderate length (5-12 words)",
      verbose: "more detailed (8-20 words)"
    };

    // Build mood description
    const moodDescription = moods.length > 0 
      ? `The tone should reflect these moods: ${moods.join(', ')}. `
      : 'Use a neutral, thoughtful tone. ';

    // Define banned and encouraged starters
    const bannedStarters = ["Embrace", "Accept", "Consider", "Try", "Think", "Use", "Look"];
    const encouragedStarters = [
      "What if", "Where is", "How might", "Why not", "When does", "Who would",
      "Remove", "Add", "Subtract", "Multiply", "Reverse", "Ignore", "Amplify",
      "Whisper", "Shout", "Freeze", "Accelerate", "Simplify", "Complicate"
    ];

    // Generate all strategies in parallel
    const strategyPromises = Array.from({ length: count }, async (_, i) => {
      const randomBannedWord = bannedStarters[Math.floor(Math.random() * bannedStarters.length)];
      const randomEncouragedStarter = encouragedStarters[Math.floor(Math.random() * encouragedStarters.length)];
      
      const prompt = `Create 1 oblique strategy. ${lengthDescriptions[length]}. ${moodDescription}Style: "${randomEncouragedStarter}..." Avoid: "${randomBannedWord}"`;

      // Wrap the API call with timeout
      const generateWithTimeout = async () => {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      };

      const text = await Promise.race([
        generateWithTimeout(),
        timeoutPromise
      ]) as string;
      
      // Clean up the response
      let cleanedStrategy = text
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/\.$/, '') // Remove period
        .trim();

      // Reject if it starts with banned words - throw error instead of fallback
      if (bannedStarters.some(word => cleanedStrategy.toLowerCase().startsWith(word.toLowerCase()))) {
        throw new Error(`Generated strategy starts with banned word: ${cleanedStrategy}`);
      }

      if (!cleanedStrategy || cleanedStrategy.length === 0) {
        throw new Error('Empty strategy generated');
      }

      return cleanedStrategy;
    });

    // Wait for all strategies to complete (or timeout/fail)
    const results = await Promise.allSettled(strategyPromises);
    const strategies: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        strategies.push(result.value);
      } else {
        console.error(`Strategy ${index + 1} failed:`, result.reason);
      }
    });

    // If no strategies were successfully generated, return error
    if (strategies.length === 0) {
      return NextResponse.json({
        error: 'Unable to generate AI strategies at this time. Please try again later.'
      }, { status: 504 });
    }

    // Return only AI-generated strategies
    return NextResponse.json({
      strategies,
      source: 'gemini'
    });

  } catch (error) {
    console.error('Error generating oblique strategies:', error);
    
    // Return error instead of fallback strategies
    return NextResponse.json({
      error: 'Unable to generate AI strategies at this time. Please try again later.'
    }, { status: 504 });
  }
}
