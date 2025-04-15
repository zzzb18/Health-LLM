interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  stream: boolean;
  model: string;
  messages: Message[];
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const API_URL = 'https://api.chatanywhere.org/v1';
const MODEL = 'gpt-3.5-turbo';

export async function getChatCompletion(
  userMessage: string,
  apiToken: string,
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: '你是一个专业的健康顾问，可以为用户提供健康相关的建议和指导。请用简单易懂的语言回答用户的问题。',
    },
    {
      role: 'user',
      content: userMessage,
    },
  ];

  const requestBody: ChatCompletionRequest = {
    stream: false,
    model: MODEL,
    messages,
  };

  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '抱歉，无法获取回答';
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
} 