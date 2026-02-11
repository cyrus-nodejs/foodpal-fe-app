import React, { useState, useEffect } from "react";
import { apiConnection } from "../config/connectionTest";

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({
  className = "",
}: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check connection on component mount
    checkConnection();

    // Set up periodic connection checks (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await apiConnection.checkConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualCheck = () => {
    checkConnection();
  };

  if (isConnected === null) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-500">Connecting...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleManualCheck}
        disabled={isChecking}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        title={`Backend: ${
          isConnected ? "Connected" : "Disconnected"
        } - Click to refresh`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isChecking
              ? "bg-yellow-400 animate-pulse"
              : isConnected
              ? "bg-green-400"
              : "bg-red-400"
          }`}
        />
        <span
          className={`text-xs ${
            isConnected ? "text-green-600" : "text-red-600"
          }`}
        >
          {isChecking ? "Checking..." : isConnected ? "Online" : "Offline"}
        </span>
      </button>
    </div>
  );
}
