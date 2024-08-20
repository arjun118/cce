import React, { useEffect, useState } from "react";
import { socket, io } from "../../socket";
import { Button, Textarea } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Select } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
const Test = () => {
  const { auth, setAuth } = useAuth();
  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const [code, setCode] = useState("here is something for you");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  useEffect(() => {
    // socket.connect();
    // connected in the Room.jsx
    const storedRoomId = localStorage.getItem("roomid");
    if (storedRoomId) {
      setAuth((prev) => ({ ...prev, roomid: storedRoomId }));
    }

    socket.on("new user joined", () => {
      console.log("a new user joined your room");
    });
    socket.on("set_code_server", (data) => {
      console.log("set code server", data);
      setCode(data);
    });
    socket.on("change_language_server", (data) => {
      console.log("change lang server :", data);
      setSelectedLanguage(data);
    });
    console.log(socket);
    return () => {
      socket.off("set_code_server");
      socket.off("change_language_server");
    };
  }, []);
  const handleChange = (e) => {
    console.log(e);
    let content = e;
    setCode(content);
    socket.emit("set_code_client", { message: content, roomid: auth.roomid });
  };

  return (
    <>
      {auth?.roomid ? (
        <>
          <Select
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              socket.emit("change_language", {
                message: e.target.value,
                roomid: auth.roomid,
              });
            }}
            // defaultValue="python"
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
      ) : (
        <p> no room id set</p>
      )}
    </>
  );
};

export default Test;
