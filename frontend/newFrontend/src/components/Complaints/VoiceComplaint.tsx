import { Mic } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceComplaint() {
  const [timer, setTimer] = useState<number>(30)
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:8000/checkAuth", {
          withCredentials: true,
        });
        if (!(response.status === 200 && response.data.authenticated && response.data.role === "user")) {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        navigate("/signin");
      }
    };

    checkAuthentication();
  }, [navigate]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      setTimer(30); 

    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true; // Keep listening
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      try {
        const response = await axios.post(
          "http://localhost:8000/callComplaint",
          { description: transcript },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Complaint sent successfully!");
        } else {
          alert("Failed to send complaint.");
        }
      } catch (error) {
        console.error("Error sending complaint:", error);
        alert("Error sending complaint. Please try again.");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error. Try again.");
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognition.start();
    
    setTimer(30);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          stopListening();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Stop after 30 seconds automatically
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      stopListening();
    }, 30000);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic className="h-12 w-12 text-[#FF4D4D]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Report</h2>
        <p className="text-gray-600">
          Record your complaint using your voice. Click the button below to start.
        </p>
      </div>    
      <div className="text-center mb-6">
        <p className="text-5xl font-bold text-[#FF4D4D] mb-2">{timer}</p>
        <p className="text-sm text-gray-500">Available 24/7 in 50+ languages</p>
      </div>
      <Button className="bg-[#FF4D4D] hover:bg-[#e63e3e] text-white w-full" onClick={handleSpeechRecognition}>
        {isListening? "Stop Recording" : "Start Recording"}
      </Button>
      <p className="mt-4 text-sm text-gray-500">
        Your call will be recorded and securely stored on our blockchain for
        evidence purposes.
      </p>
    </div>
  );
}