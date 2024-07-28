import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import { Button, Textarea } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Select } from "@chakra-ui/react";
const Test = () => {
  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const [code, setCode] = useState("here is something for you");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  useEffect(() => {
    socket.connect();
    socket.on("some_user", (data) => {
      setCode(data.message);
    });
    socket.on("set_language", (data) => {
      console.log(data);
      setSelectedLanguage(data);
    });
  }, []);
  const handleChange = (e) => {
    console.log(e);
    let content = e;
    setCode((prev) => content);
    socket.emit("from_client", { message: content });
  };
  useEffect(() => {}, [code]);
  return (
    <>
      <Select
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          socket.emit("change_language", e.target.value);
        }}
        defaultValue="python"
        value={selectedLanguage}
      >
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="javascript">Javascript</option>
      </Select>
      <div className="w-screen">
        <Editor
          value={code}
          className="h-screen"
          theme="vs-dark"
          height="100vh"
          width="100vh"
          // defaultLanguage="javascript"
          onChange={handleChange}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            // contextmenu: false,
          }}
          onMount={handleEditorDidMount}
          language={selectedLanguage}
        />
      </div>
    </>
  );
};

export default Test;
