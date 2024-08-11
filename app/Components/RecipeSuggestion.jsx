"use client";

import { motion } from "framer-motion";
import { OpenAI } from "openai";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function RecipeSuggestion({ open, onClose, inventory }) {
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecipeSuggestion = async () => {
    setLoading(true);
    try {
      const inventoryList = inventory
        .map((item) => `${item.name} (${item.quantity})`)
        .join(", ");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that suggests recipes based on available ingredients. Provide the recipe in Markdown format.",
          },
          {
            role: "user",
            content: `Given the following ingredients: ${inventoryList}, suggest a recipe that uses some or all of these ingredients. Provide a brief description and simple instructions.`,
          },
        ],
        max_tokens: 500,
      });

      setRecipe(response.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error suggesting recipe:", error);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Recipe Suggestion</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
          onClick={getRecipeSuggestion}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Recipe Suggestion"}
        </button>
        {recipe && (
          <div className="mt-4 prose prose-sm">
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}
        <button
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
