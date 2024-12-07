import TextRecognition from '@react-native-ml-kit/text-recognition';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    console.log('Starting OCR process for image at path:', imagePath);

    // Ensure the path is properly formatted
    const formattedPath = imagePath.startsWith('file://') 
      ? imagePath 
      : `file://${imagePath}`;

    console.log('Attempting OCR with formatted path:', formattedPath);

    const result = await TextRecognition.recognize(formattedPath);

    console.log('Raw OCR result:', JSON.stringify(result, null, 2));

    if (!result || !result.blocks || result.blocks.length === 0) {
      console.warn('No text blocks found in the image');
      throw new Error('Ingen text kunde hittas i bilden. Se till att bilden är skarp och välbelyst.');
    }

    // Process text from all blocks
    const processedText = result.blocks
      .map(block => {
        console.log(`Processing text block: "${block.text}"`);
        return block.text;
      })
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim();

    if (!processedText) {
      throw new Error('Ingen text kunde extraheras från bilden');
    }

    console.log('Final processed text:', processedText);
    return processedText;

  } catch (error) {
    console.error('OCR Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Ett problem uppstod vid textläsningen');
  }
}