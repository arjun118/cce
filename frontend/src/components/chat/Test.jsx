import React, { useEffect, useState } from "react";
import { socket, io } from "../../socket";
import { Button, Textarea } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Select } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const Test = () => {
  const navigate = useNavigate();
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
    const code = localStorage.getItem("code");
    const language = localStorage.getItem("language");
    if (storedRoomId) {
      setAuth((prev) => ({ ...prev, roomid: storedRoomId }));
      socket.emit("join_existing_room", storedRoomId); //join the existing room upon refresh
      if (code && language) {
        // if code and language is set, then store the
        socket.emit("change_language", {
          message: code,
          roomid: storedRoomId,
        });
        //set the code already stored
        socket.emit("set_code_client", { message: code, storedRoomId });
        setCode(code);
        setSelectedLanguage(language);
      }
    }
    socket.on("set_code_server", (data) => {
      setCode(data);
      localStorage.setItem("code", data);
    });
    socket.on("change_language_server", (data) => {
      setSelectedLanguage(data);
      localStorage.setItem("language", data);
    });
    return () => {
      socket.off("set_code_server");
      socket.off("change_language_server");
    };
  }, []);
  const handleChange = (e) => {
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
              socket.emit("change_language_client", {
                message: e.target.value,
                roomid: auth.roomid,
              });
              localStorage.setItem("language", e.target.value);
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
        navigate("/room")
      )}
    </>
  );
};

export default Test;
