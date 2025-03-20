interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  stream: boolean;
  model: string;
  messages: Message[];
}

const API_URL = 'https://api.sambanova.ai/v1/chat/completions';
const MODEL = 'Meta-Llama-3.1-8B-Instruct';

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
    stream: true,
    model: MODEL,
    messages,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // 将 Uint8Array 转换为字符串
      const chunk = new TextDecoder().decode(value);
      result += chunk;
    }

    return result;
  } catch (error) {
    console.error('Error calling SambaNova API:', error);
    throw error;
  }
} 