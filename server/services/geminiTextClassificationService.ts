import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const geminiTextClassification = async (
  input: string
): Promise<{ categories: string, keyInfo: Record<string, any> }> => {
  const apiKey = process.env.GEMINI_API_KEY; // Replace with your API key
  if (apiKey) {
    const generationConfig = {
      temperature: 0.5,
      topP: 0.95,
      topK: 40,
      // maxOutputTokens: 200,
      responseMimeType: "text/plain",
    };
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt =
      "Which category does this text belong to? Your options are Health, Education and Career, Government and Utilities, Finance, Family and Relationships, Warranties and Memberships, Social and Leisure, Personal. Also extract any key info from the text. Return a JSON object with exactly two keys: 'categories' and 'keyInfo'.\n" +
      "- 'categories' should be a string of categories ranked from most relevant to least, separated by commas.\n" +
      "- 'keyInfo' should be a JSON object of key/value where both are strings pairs representing any important information extracted from the text.\n" +
      "- 'Make sure the overall response isn't over 70 words so make sure to get the most important info for keyInfo.\n" +
      "Do not include any additional text or explanations outside the JSON object, dont include keys which dont have values, dont forget to close all JSON brackets, if you have to leave out some info to do this within the word limit, do it.\n\n" +
      input;

    try {
      const chatSession = await model.startChat({
        generationConfig,
        history: [],
      });
      const res = await chatSession.sendMessage(prompt);
      

      // Parse the response to extract the top 3 categories
      const responseText = await res.response.text();

      const startIndex = responseText.indexOf('{');
      const endIndex = responseText.lastIndexOf('}') + 1;
      const jsonText = responseText.substring(startIndex, endIndex);

      let result: { categories: string; keyInfo: Record<string, any> } = { categories: "", keyInfo: {} };

      try {
        result = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return { categories: '', keyInfo: {} };
      }
      return result;
    } catch (error) {
      console.error("Error during text classification:", error);
      return {categories: '', keyInfo: JSON};
    }
  } else {
    console.error("API key is undefined");
    return {categories: '', keyInfo: JSON};
  }
};
