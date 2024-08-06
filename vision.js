import * as dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Hello"
        }
      ]
    }
  ]
})

console.log(response.choices[0]);