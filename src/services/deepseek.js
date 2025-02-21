import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: process.env.REACT_APP_OPENROUTERURL,
        apiKey: process.env.REACT_APP_OPENROUTERKEY,
        dangerouslyAllowBrowser: true,
});

const systemPrompt = `
O usuário fará uma pergunta sobre um pokemon e você deve responder com uma resposta curta (answer) o nome (name) do pokemon, o tipo (type) e o número na pokedex (pokedex).

EXAMPLE INPUT: 
Qual é o pokemon do tipo fogo mais forte?

EXAMPLE JSON OUTPUT:
{
    "question": "Qual é o pokemon do tipo fogo mais forte?",
    "answer": "Charizard",
    "name": "Charizard",
    "type": "fogo",
    "pokedex": 6
}
`;

//const userPropt = "Which is the longest river in the world? The Nile River."

// messages = [{"role": "system", "content": system_prompt},
//             {"role": "user", "content": user_prompt}]


async function deepSeek(description) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: `${description}`},
      { role: "system", content: systemPrompt }
    ],
    respose_format: {
      type: "json_schema",
    },
    // model: "deepseek-chat",
    model: "deepseek/deepseek-chat:free",
    // model: "openai/gpt-4o",
  });

  console.log({completion});
  return completion.choices[0].message.content;
}

// ```
// {
//   "messages": [
//     { "role": "user", "content": "What's the weather like in London?" }
//   ],
//   "response_format": {
//     "type": "json_schema",
//     "json_schema": {
//       "name": "weather",
//       "strict": true,
//       "schema": {
//         "type": "object",
//         "properties": {
//           "location": {
//             "type": "string",
//             "description": "City or location name"
//           },
//           "temperature": {
//             "type": "number",
//             "description": "Temperature in Celsius"
//           },
//           "conditions": {
//             "type": "string",
//             "description": "Weather conditions description"
//           }
//         },
//         "required": ["location", "temperature", "conditions"],
//         "additionalProperties": false
//       }
//     }
//   }
// }
// ```

export { deepSeek };