import { useEffect, useRef, useCallback } from "react";

interface PromptInputProps {
  prompt: string;
  onSubmit: () => void;
  updatePrompt: (prompt: string) => void;
  isLoading?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  updatePrompt,
  prompt,
  isLoading = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const checkKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.ctrlKey || e.shiftKey) {
          document.execCommand("insertText", false, "\n\n");
        } else if (!isLoading) {
          onSubmit();
        }
      }
    },
    [isLoading, onSubmit]
  );

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, [checkKeyPress]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={prompt}
        disabled={isLoading}
        placeholder="Ask me anything about your health..."
        className={`w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900
          placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50
          disabled:bg-gray-100 disabled:text-gray-500 min-h-[44px] max-h-[200px]
          shadow-sm transition-colors duration-200
          ${isLoading ? "cursor-not-allowed" : ""}`}
        onChange={(event) => updatePrompt(event.target.value)}
        rows={1}
        style={{ height: "auto", overflowY: "hidden" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default PromptInput;
