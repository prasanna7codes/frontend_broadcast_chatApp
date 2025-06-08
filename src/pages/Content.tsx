import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

function Content() {
  const [socket, setSocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>([]);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.roomId;
  const pass = location.state?.password;

  useEffect(() => {
    const ws = new WebSocket(
      import.meta.env.MODE === "development"
        ? "ws://localhost:8080"
        : "wss://broadcastingchatappbackend-production.up.railway.app"
    );

    ws.onopen = () => {
      console.log("WebSocket opened");
      setSocket(ws);
    };

    ws.onerror = err => console.error("WebSocket error:", err);

    ws.onmessage = ev => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "message") {
          setMessages(prev => [...prev, data.payload.message]);
        } else if (data.type === "history") {
          setMessages(data.payload);
        } else if (data.type === "error") {
          alert(data.payload.message);
          navigate("/");
        }
      } catch (err) {
        console.error("Parsing error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && room) {
      console.log("🔗 Sending join with room:", room);
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: room, password: pass },
        })
      );
    }
  }, [socket, room]);

  const sendText = () => {
    if (textRef.current && socket && socket.readyState === WebSocket.OPEN) {
      const text = textRef.current.value.trim();
      if (text !== "") {
        socket.send(
          JSON.stringify({
            type: "message",
            payload: { message: text },
          })
        );
      }
      textRef.current.value = "";
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-yellow-400 text-xl">You’re In!</CardTitle>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-300"
              onClick={() => navigate("/")}
            >
              Change room
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {room && (
            <div className="text-sm text-zinc-400">
              Joined room:{" "}
              <span className="text-white font-medium">{room}</span>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendText();
                }
              }}
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
  );
}

export default Content;
