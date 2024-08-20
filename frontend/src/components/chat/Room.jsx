import { HStack, Input, VStack, Button, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../../socket";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const Room = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [newRoomDetails, setNewRoomDetails] = useState({
    method: "",
    roomId: uuidv4(), //already gets a new room id by default
  });
  const [joinRoomDetails, setJoinRoomDetails] = useState({
    method: "",
    roomId: "",
  });
  const generateRoomId = () => {
    const id = uuidv4();
    setNewRoomDetails((prev) => ({ method: "new", roomId: id }));
  };
  const joinRoom = () => {
    console.log(joinRoomDetails.roomId);
    const id = joinRoomDetails.roomId;
    socket.emit("join_existing_room", id);
    setAuth((prev) => ({ ...prev, roomid: joinRoomDetails.roomId }));
    localStorage.setItem("roomid", id);
    navigate("/test");
  };
  const createRoom = () => {
    const id = newRoomDetails.roomId;
    socket.emit("create_new_room", id); //tell backend to create a room and let this user join that room
    setAuth((prev) => ({ ...prev, roomid: newRoomDetails.roomId }));
    localStorage.setItem("roomid", id);
    navigate("/test");
  };

  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <>
      <HStack>
        <VStack>
          <Text>Create a Room</Text>
          <VStack>
            <Input
              placeholder="Click the below button to auto-generate new Room ID"
              value={newRoomDetails.roomId}
              isDisabled={true}
              onChange={(e) =>
                setNewRoomDetails((prev) => ({
                  method: "new",
                  roomId: e.target.value,
                }))
              }
            />
            <Button onClick={generateRoomId}>Generate New Room ID</Button>
            <Button onClick={createRoom}>Create Room</Button>
          </VStack>
        </VStack>

        <VStack>
          <Text>Join a Room</Text>
          <VStack>
            <Input
              placeholder="Enter a valid Room Id"
              value={joinRoomDetails.roomId}
              onChange={(e) =>
                setJoinRoomDetails((prev) => ({
                  method: "join",
                  roomId: e.target.value,
                }))
              }
            />
            <Button onClick={joinRoom}>Join Room</Button>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
};

export default Room;
