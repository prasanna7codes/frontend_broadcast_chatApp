import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"



 

function App() {
  const [roomId, setRoomId] = useState<string>()
  const [socket, setSocket] = useState<WebSocket>()
  const [messages, setMessages] = useState<string[]>([])


  const roomRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)



  function handleSubmit() {
    if (roomRef.current) {
      const id = roomRef.current.value

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ 
          type: "join",
           payload: { roomId: id } 
        }))
      }

      setRoomId(id)
    }
  }

  function sendText() {
    if (textRef.current) {
      const text = textRef.current.value

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
           type: "message", 
          payload: { message: text } 
        }))
      }

      textRef.current.value = ""
    }
  }




  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => console.log("WebSocket opened")

    ws.onerror = err => console.error("WebSocket error:", err)


    ws.onmessage = ev => {
      try {
        const data = JSON.parse(ev.data)

        if (data.type === "message") {
          setMessages(prev => [...prev, data.payload.message])
        }

        if (data.type === "history") {
          setMessages(data.payload)
        }
      } catch (err) {
        console.error("Parsing error:", err)
      }
    }

    setSocket(ws)
  }, [])



  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])




  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
        <CardHeader>
          <CardTitle className="text-yellow-400 text-xl">Quick Chat</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              ref={roomRef}
              placeholder="Enter Room ID"
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Button
              onClick={handleSubmit}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              Join
            </Button>
          </div>



          {roomId && (
            <div className="text-sm text-zinc-400">
              Joined room: <span className="text-white font-medium">{roomId}</span>
            </div>
          )}



          <ScrollArea
            ref={scrollAreaRef}
            className="h-[220px] rounded-md border border-zinc-700 bg-zinc-800 p-3"
          >
            <div className="flex flex-col gap-2 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm border border-zinc-600"
                >
                  {msg}
                </div>
              ))}
            </div>
          </ScrollArea>


          <div className="space-y-2">
            <Textarea
              ref={textRef}
              className="w-full resize-none bg-zinc-800 border-zinc-700 text-white"
              placeholder="Type a message..."
            />
            <Button
              onClick={sendText}
              className="bg-yellow-400 text-black hover:bg-yellow-300 w-full"
            >
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default App
