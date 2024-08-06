import * as dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this image"
        },
        {
          type: "image_url",
          image_url: {
            url: "https://images.unsplash.com/photo-1490682143684-14369e18dce8?ixid=M3wxMTI1OHwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjg0MDI1OXw&ixlib=rb-4.0.3&q=85&w=3360",
            detail: "auto"
          }
        }
      ]
    }
  ]
})

console.log(response.choices[0]);