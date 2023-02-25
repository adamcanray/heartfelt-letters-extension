const BASE_PROMPT_PREFIX = `Write me a love letter based on prompt below. Please make sure the love letter goes in-depth on the topic. Also I want the message is not too formal, make it more natural.
`;

const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(tabs);
    console.log(content);

    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        console.log(response);
        if (response.status === "failed") {
          console.log("injection failed.");
        }
      }
    );
  });
};

// Function to get + decode API key
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      if (result["openai-key"]) {
        const decodedKey = atob(result["openai-key"]);
        resolve(decodedKey);
      }
    });
  });
};

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      // model: "text-davinci-003",
      // prompt: prompt,
      // max_tokens: 1250,
      // temperature: 0.7,
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.85,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    }),
  });

  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    sendMessage("generating...");

    const { selectionText } = info;

    // Add this to call GPT-3
    const baseCompletion = await generate(
      `${BASE_PROMPT_PREFIX}${selectionText}`
    );

    // Let's see what we get!
    // console.log(baseCompletion.text);

    // Send the output when we're all done
    sendMessage(baseCompletion.text);
  } catch (error) {
    console.log(error);

    // Add this here as well to see if we run into any errors!
    sendMessage(error.toString());
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "Heartfelt Letters",
    contexts: ["selection"],
  });
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
