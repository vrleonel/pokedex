import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: process.env.OPENROUTER_URL,
        apiKey: process.env.OPENROUTER_KEY,
        "HTTP-Referer": "https://pokedex.vrleonel.dev", 
        "X-Title": "Pokemon Search", // Optional. Site title for rankings on openrouter.ai.
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
  try {

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
  } catch (err) {
    console.error('Erro na API do OPENROUTER:', err);
    return null;
  }
}

export { deepSeek };