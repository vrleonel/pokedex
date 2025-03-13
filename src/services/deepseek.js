import OpenAI from "openai";

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


async function deepSeek(description) {
  try {

    const openai = new OpenAI({
      baseURL: process.env.OPENROUTER_URL,
      apiKey: process.env.OPENROUTER_KEY,
      "HTTP-Referer": "https://pokedex.vrleonel.dev",
      "X-Title": "Pokemon Search", // Optional. Site title for rankings on openrouter.ai.
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: `${description}`},
        { role: "system", content: systemPrompt }
      ],
      respose_format: {
        type: "json_schema",
      },
      model: "deepseek/deepseek-chat:free",
    });

    console.log({completion});
    return completion.choices[0].message.content;
  } catch (err) {
    console.error('Erro na API do OPENROUTER:', err);
    return null;
  }
}

export { deepSeek };