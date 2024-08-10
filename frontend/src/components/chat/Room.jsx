import { HStack, Input, VStack, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const Room = () => {
  const [newRoomDetails, setNewRoomDetails] = useState({
    method: "",
    roomId: "",
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
  };
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
            <Button onClick={generateRoomId}>Generate Room ID</Button>
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
