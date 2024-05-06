const token = process.env.REACT_APP_OPENAI_API_KEY;
if (!token) {
  throw new Error("OpenAI API key not found");
}

export const readImageContent = async (data: string) => {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "The image will contain pieces of paper with text on them. Please list all the pieces of paper by only outputting the text on them, each in new line. If you do not see square pieces of paper with text on them, simply output 'NO'",
            },
            {
              type: "image_url",
              image_url: {
                url: data,
              },
            },
          ],
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.choices) {
        throw new Error("No response from OpenAI");
      }
      return response.choices[0].message.content
        .split("\n")
        .map((line: string) => line.trim());
    });
};

export const generateSiteName = async () => {
  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt:
        "Please come up with a random name for website.Return only the website name without any additional text or quotes.",
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      return response.choices[0].text
        .trim()
        .replace(/"/g, "")
        .replace(/'/g, "");
    });
};
