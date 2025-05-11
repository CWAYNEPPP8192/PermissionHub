import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
}

const CodeExample = ({ title, description, code }: CodeExampleProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "The code has been copied to your clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy code to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-medium">{title}</h3>
        <button 
          onClick={copyToClipboard}
          className="text-sm text-primary flex items-center hover:text-primary/90"
        >
          <span className="material-icons text-sm mr-1">{isCopied ? "check" : "content_copy"}</span>
          <span>{isCopied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>
      
      <div className="p-4 bg-gray-50 overflow-x-auto dark:bg-gray-900">
        <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: code }} />
        </pre>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default CodeExample;
