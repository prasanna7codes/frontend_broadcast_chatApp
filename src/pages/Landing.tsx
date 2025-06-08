import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {useRef} from 'react'
import { useNavigate } from "react-router-dom"



function Landing() {

const roomRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);

const navigate= useNavigate();



function handleroom (){
    const roomId = roomRef.current?.value;
    const password = passwordRef.current?.value.trim();

    if (!roomId) return alert("Room ID is required");

  if (password !== undefined && password.trim() === "") {
    return alert("Password cannot be empty spaces. Leave it blank if not needed.");
  }

    if(roomId){
      navigate("/chat", { state: { roomId,password:password?.trim() } });
    }
}




  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4">
      <div className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg mb-8">
        Quick Chat
      </div>

      <div className="flex gap-3 max-w-md w-full">
        <Input ref={roomRef}
          placeholder="Enter Room ID"
          className="bg-zinc-800 text-white border-zinc-700 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-yellow-400"
          onKeyDown={(e) => {// code to send message on enter  from chatgpt
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleroom();
    }
}
          }
        />

        <Input ref={passwordRef}
          placeholder="Enter Room Password"
          className="bg-zinc-800 text-white border-zinc-700 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {// code to send message on enter  from chatgpt
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleroom();
    }
}
          }
        />
        <Button onClick = {handleroom}  className="bg-yellow-400 text-black hover:bg-yellow-300 rounded-full px-6 py-2 text-base transition-all duration-200">
          Join
        </Button>

      </div>
              <div  className="text-yellow-400 text-xs opacity-50 py-6 flex flex-col items-center justify-center">*If a room alreay exists you will be added to that room,if not a new room will be created .
                <br /> 
              <div>Leaving the password blank makes the room public </div>
              </div>
              

    </div>
  )
}


export default Landing
