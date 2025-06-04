import { useState,useRef, useEffect } from "react";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

function App() {
 
 const [roomId,setRoomId]= useState<string>();
  const [socket,setSocket]= useState<WebSocket>();
  const[message ,setMessage]=useState<string>("");
    const[messages ,setMessages]=useState<string[]>([])



const roomRef = useRef<HTMLInputElement>(null);
const textRef = useRef<HTMLTextAreaElement>(null);


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


function sendText(){

  if(textRef.current){
   const text= textRef.current.value;

   if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "message",
          payload: { message: text },
        })
      );
    } else {
      console.warn("Socket not ready yet");
    }

    //setMessage(text);
      textRef.current.value = ""; // ✅ Clear the textarea after sending


  }

}




useEffect(()=>{
      const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

    ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };


  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      if (data.type === "message") {
        const s = data.payload.message;
        setMessages(prev => [...prev, s])
      
      }

      if (data.type === "history") {
            const msgs = data.payload;// receive a array of messages 
            setMessages(msgs); // Replace the existing message list
}
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

      setSocket(ws);



},[])
 
  return ( 
   <>

<div className="bg-red-50 flex items-center">
  <Input ref={roomRef} className="max-w-xs mr-6" type="text" placeholder="roomId"/>
<Button className="bg-yellow-200" onClick={handlesubmit}>submit</Button>

{roomRef.current && (
  <span>you have joined the room { roomId}</span>
)}
</div>


 //we will put messages inside the scroll are  here
 <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  {messages.map((msg, idx) => (
    <div key={idx} className="mb-2">
      {msg}
    </div>
  ))}
</ScrollArea>




<Textarea ref={textRef} className="max-w-xl mt-6" />
<Button className="bg-yellow-200" onClick={sendText}>submit</Button>


   </>
  )
}

export default App  