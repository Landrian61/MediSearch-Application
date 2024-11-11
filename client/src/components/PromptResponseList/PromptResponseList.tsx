import React, { FC, useEffect, useRef } from "react";
import { ResponseInterface, ApiResponse } from "./response-interface";
import hljs from "highlight.js";

interface PromptResponseListProps {
  responseList: ResponseInterface[];
}

const PromptResponseList: FC<PromptResponseListProps> = ({ responseList }) => {
  const responseListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hljs.highlightAll();
    if (responseListRef.current) {
      responseListRef.current.scrollTop = responseListRef.current.scrollHeight;
    }
  }, [responseList]);

  const renderContent = (response: ApiResponse) => {
    const { text } = response;
    const { temporal_context, main_response, disclaimer } = text;

    return (
      <div className="space-y-4">
        {temporal_context?.history_context && (
          <p className="text-gray-700">
            {temporal_context.history_context}
          </p>
        )}

        {main_response && (
          <div className="prose max-w-none space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">Summary</h2>
              <p className="text-gray-700">{main_response.summary}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                Detailed Information
              </h2>
              <p className="text-gray-700">{main_response.detailed_info}</p>
            </div>

            {main_response.key_points.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Key Points</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {main_response.key_points.map((point, index) => (
                    <li key={index} className="text-gray-700">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {disclaimer && (
          <p className="text-sm text-gray-500 italic mt-4 mb-2">{disclaimer}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="space-y-6 overflow-y-auto h-full scroll-smooth px-2 pb-4"
      ref={responseListRef}
      style={{ maxHeight: 'calc(100vh - 180px)' }}
    >
      {responseList.map((responseData) => {
        const { response, selfFlag, id, error, image } = responseData;

        return (
          <div
            className={`flex gap-4 ${selfFlag ? "flex-row-reverse" : ""}`}
            key={id}
          >
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full overflow-hidden shadow-sm
                  ${selfFlag ? "bg-emerald-100" : "bg-white border border-gray-200"}`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={image || (selfFlag ? "/verified-user.png" : "/chatbot.png")}
                  alt={selfFlag ? "User Avatar" : "Assistant Avatar"}
                />
              </div>
            </div>

            <div className={`flex-1 max-w-3xl ${selfFlag ? "text-right" : ""}`}>
              <div
                className={`inline-block rounded-lg px-6 py-4 shadow-sm
                  ${selfFlag
                    ? "bg-emerald-600 text-white"
                    : error
                    ? "bg-red-50 text-red-900 border border-red-200"
                    : "bg-white border border-gray-200"
                  }`}
              >
                {response && renderContent(response)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PromptResponseList;