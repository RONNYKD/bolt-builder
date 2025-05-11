import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

interface SandboxEditorProps {
  files: Record<string, string>;
}

export const SandboxEditor: React.FC<SandboxEditorProps> = ({ files }) => {
  // Provide a default file if none are passed
  const defaultFiles = {
    "/App.js": `export default function App() {\n  return <h1>Hello from Sandpack!</h1>;\n}`
  };

  return (
    <Sandpack
      template="react"
      files={Object.keys(files).length ? files : defaultFiles}
      options={{
        showLineNumbers: true,
        showTabs: true,
        wrapContent: true,
        editorHeight: 400,
      }}
    />
  );
}; 