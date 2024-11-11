import { useState } from "react";
import axios from "axios";
import PromptInput from "../PromptInput/PromptInput";
import {
  ResponseInterface,
  ApiResponse
} from "../PromptResponseList/response-interface";
import PromptResponseList from "../PromptResponseList/PromptResponseList";

const App = () => {
  const [responseList, setResponseList] = useState<ResponseInterface[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  };

  const addResponse = (selfFlag: boolean, response?: ApiResponse): string => {
    const id = generateUniqueId();
    const newResponse: ResponseInterface = {
      id,
      response,
      selfFlag,
      image: selfFlag ? "/verified-user.png" : "/chatbot.png"
    };
    setResponseList((prev) => [...prev, newResponse]);
    return id;
  };

  const updateResponse = (id: string, updates: Partial<ResponseInterface>) => {
    setResponseList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    const userPromptId = addResponse(true, {
      text: {
        temporal_context: {
          history_context: prompt
        }
      }
    });

    const loadingResponseId = addResponse(false, {
      text: {
        temporal_context: {
          history_context: "Loading..."
        }
      }
    });

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/get-prompt-result`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      );

      if (data.error) {
        throw new Error(data.error);
      }

      updateResponse(loadingResponseId, {
        response: data.data,
        error: false
      });
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.error ||
        (error as Error).message ||
        "An error occurred while processing your request";

      updateResponse(loadingResponseId, {
        response: {
          text: {
            temporal_context: {
              history_context: `Error: ${errorMessage}`
            }
          }
        },
        error: true
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-emerald-600 text-white py-4 px-4 shadow-lg z-50">
        <div className="flex items-center justify-center space-x-4 max-w-7xl mx-auto">
          <div className="bg-white p-2 rounded-full shadow-md">
            <img
              src="/chatbot.png"
              width={40}
              height={40}
              alt="MediSearch Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MediSearch</h1>
            <p className="text-lg opacity-90">Your AI Health Assistant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
        <div className="h-full flex flex-col pt-6 pb-32">
          <div className="flex-1 min-h-0">
            <PromptResponseList responseList={responseList} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-6 pt-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <PromptInput
              prompt={prompt}
              onSubmit={handlePromptSubmit}
              updatePrompt={setPrompt}
              isLoading={isLoading}
            />
            <button
              className={`w-full mt-3 px-4 py-3 bg-emerald-600 text-white rounded-lg
                         hover:bg-emerald-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-sm`}
              onClick={handlePromptSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
