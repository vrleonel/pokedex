

const searchDeepSeek = (description) => {
  console.log('env', process.env.NODE_ENV );

  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {  
      "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTERURL}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-r1:free",
      "messages": [
        {
          "role": "user",
          "content": description || "",
        }
      ]
    })
  })
};

export { searchDeepSeek };