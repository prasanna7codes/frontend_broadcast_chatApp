import { useState,useRef, useEffect } from "react";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function App() {
 
 const [roomId,setRoomId]= useState<string>();
  const [socket,setSocket]= useState<WebSocket>();


const roomRef = useRef<HTMLInputElement>(null);

// first sending the value to backend , then doing  setRoomId(id) , bcoz if first doing setRoomId(id) and then sending roomId , it was sending a empty payload bcoz  roomId wasn't updated yet due to React state being asynchronous


function handlesubmit() {
  if (roomRef.current) {
    const id = roomRef.current.value;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: id },
        })
      );
    } else {
      console.warn("Socket not ready yet");
    }

    setRoomId(id);
  }
}




useEffect(()=>{
      const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
    console.log("WebSocket connection opened");
    setSocket(ws);
  };

    ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };


},[])
 
  return ( 
   <>



<div className="bg-red-50 flex items-center">
  <Input ref={roomRef} className="max-w-xs mr-6" type="text" placeholder="roomId"/>
<Button className="bg-yellow-200" onClick={handlesubmit}>submit</Button>


{roomRef.current && (
  <span>{roomRef.current.value}</span>
)}
</div>


   </>
  )
}

export default App  