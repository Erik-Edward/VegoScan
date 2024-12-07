import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://api.anthropic.com/v1/messages';

export interface IngredientAnalysisResult {
  isVegan: boolean;
  ingredients: string[];
  explanation?: string;
}

export async function analyzeIngredients(text: string): Promise<IngredientAnalysisResult> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Analysera dessa ingredienser och avgör om produkten är vegansk. Svara på svenska i JSON-format med 'isVegan' (boolean), 'ingredients' (array av strängar), och 'explanation' (sträng med förklaring på svenska). Förklaringen ska beskriva varför produkten är vegansk eller inte baserat på ingredienserna. Här är ingredienserna:\n\n${text}`
        }]
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        }
      }
    );

    const result = response.data.content[0].text;
    return JSON.parse(result);
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    throw error;
  }
}