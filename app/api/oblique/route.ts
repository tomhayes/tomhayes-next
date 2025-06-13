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
    const strategies: string[] = [];

    // Try to generate using Gemini first
    if (genAI && count > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
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

        // Add randomization to prevent repetitive responses
        const randomSeed = Math.random().toString(36).substring(7);
        const approaches = [
          "Create an imperative statement",
          "Ask a thought-provoking question", 
          "Suggest a constraint or limitation",
          "Propose a perspective shift",
          "Recommend an action or behavior",
          "Present a paradox or contradiction",
          "Offer a metaphorical suggestion",
          "Encourage experimentation"
        ];

        for (let i = 0; i < count; i++) {
          const randomApproach = approaches[Math.floor(Math.random() * approaches.length)];
          
          // Add strong anti-repetition measures
          const bannedStarters = ["Embrace", "Accept", "Consider", "Try", "Think", "Use", "Look"];
          const encouragedStarters = [
            "What if", "Where is", "How might", "Why not", "When does", "Who would",
            "Remove", "Add", "Subtract", "Multiply", "Reverse", "Ignore", "Amplify",
            "Whisper", "Shout", "Freeze", "Accelerate", "Simplify", "Complicate"
          ];
          
          const randomBannedWord = bannedStarters[Math.floor(Math.random() * bannedStarters.length)];
          const randomEncouragedStarter = encouragedStarters[Math.floor(Math.random() * encouragedStarters.length)];
          
          const prompt = `Session ID: ${randomSeed}-${i}-${Date.now()}

You are Brian Eno creating oblique strategy card #${i + 1} of ${count}.

CRITICAL ANTI-REPETITION RULES:
- NEVER start with "${randomBannedWord}" or any form of "Embrace"
- AVOID overused words like: ${bannedStarters.join(", ")}
- Consider starting with: "${randomEncouragedStarter}" or similar
- Each strategy must be completely different from others
- Break patterns and surprise the user

Requirements for this strategy:
- Length: ${lengthDescriptions[length]}
- Approach: ${randomApproach}
- ${moodDescription}

Generate something in the authentic style of these originals:
- "What would your closest friend do?"
- "Honor thy error as a hidden intention"
- "Is it finished?"
- "What mistakes did you make last time?"
- "Where is the edge?"
- "Add something that shouldn't be there"
- "Make a blank valuable by putting it in an exquisite frame"
- "Change instrument roles"
- "Go slowly all the way round the outside"
- "Use filters"
- "Repetition is a form of change"
- "What context would look right?"
- "Reverse"

IMPORTANT: Be genuinely creative and unexpected. Avoid clichés and overused patterns.

Generate ONE completely unique oblique strategy:`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text().trim();
          
          // Clean up the response and check for banned words
          let cleanedStrategy = text
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/\.$/, '') // Remove trailing period
            .trim();

          // If it starts with banned words, try to fix it or regenerate fallback
          if (bannedStarters.some(word => cleanedStrategy.toLowerCase().startsWith(word.toLowerCase()))) {
            console.log(`Rejected repetitive strategy: ${cleanedStrategy}`);
            // Use a fallback from authentic strategies instead
            const fallback = authenticStrategies[Math.floor(Math.random() * authenticStrategies.length)];
            cleanedStrategy = fallback;
          }

          if (cleanedStrategy && cleanedStrategy.length > 0) {
            strategies.push(cleanedStrategy);
          }
        }

        if (strategies.length > 0) {
          return NextResponse.json({
            strategies,
            source: 'gemini'
          });
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Fall through to use authentic strategies
      }
    }

    // Fallback to authentic oblique strategies
    const selectedStrategies = authenticStrategies
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    return NextResponse.json({
      strategies: selectedStrategies,
      source: 'authentic'
    });

  } catch (error) {
    console.error('Error generating oblique strategies:', error);
    
    // Always return something, even if there's an error
    const fallbackStrategies = authenticStrategies
      .sort(() => Math.random() - 0.5)
      .slice(0, options.count);
      
    return NextResponse.json({
      strategies: fallbackStrategies,
      source: 'fallback'
    });
  }
}
