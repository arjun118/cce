import React, { useEffect, useState } from "react";
import { socket, io } from "../../socket";
import { Button, HStack, Input, Textarea, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Select } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
const EditorComponent = () => {
  const [message, setMessage] = useState("somethning");
  const [messageList, setMessageList] = useState([]);
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
    socket.on("new_message_server", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    if (!storedRoomId) {
      navigate("/room");
    }
    return () => {
      socket.off("set_code_server");
      socket.off("change_language_server");
      socket.off("new_message_server");
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
        <HStack>
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

          <VStack>
            {/* this one is for the live chat in the room */}

            {messageList?.length > 0 ? (
              <ul>
                {messageList.map((message, indx) => {
                  return <li key={indx}>{message}</li>;
                })}
              </ul>
            ) : (
              <p>no messages </p>
            )}

            <Input
              size="lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={() =>
                // sent the event to all the people in the room
                // then add the message to the chat area
                {
                  socket.emit("new_message_client", {
                    message: message,
                    roomid: auth.roomid,
                  });
                }
              }
            ></Button>
          </VStack>
        </HStack>
      ) : null}
    </>
  );
};

export default EditorComponent;
