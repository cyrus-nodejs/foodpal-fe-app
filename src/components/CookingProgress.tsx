import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { useToast } from "./Toast";
import VoiceInput from "./VoiceInput";

interface CookingStep {
  id: string;
  instruction: string;
  duration?: number; // in minutes
  type: "prep" | "cook" | "rest" | "serve";
  tips?: string[];
  temperature?: string;
  equipment?: string[];
}

interface Recipe {
  id: string;
  title: string;
  steps: CookingStep[];
  totalTime: number;
}

interface CookingProgressProps {
  recipe: Recipe;
  onComplete?: () => void;
  onExit?: () => void;
  className?: string;
}

export default function CookingProgress({
  recipe,
  onComplete,
  onExit,
  className = "",
}: CookingProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [stepTimers, setStepTimers] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState("");
  const [cookingNotes, setCookingNotes] = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [showSmartTips, setShowSmartTips] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { showToast } = useToast();

  const currentStep = recipe.steps[currentStepIndex];
  const isLastStep = currentStepIndex === recipe.steps.length - 1;
  const progressPercentage =
    ((currentStepIndex + 1) / recipe.steps.length) * 100;

  useEffect(() => {
    // Initialize audio for timer alerts
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Start step timer tracking
    if (!isPaused) {
      stepTimerRef.current = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
        setStepTimers((prev) => ({
          ...prev,
          [currentStep.id]: (prev[currentStep.id] || 0) + 1,
        }));
      }, 1000);
    }

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [currentStepIndex, isPaused, currentStep.id]);

  const startTimer = (minutes: number) => {
    setTimeRemaining(minutes * 60);
    setIsTimerActive(true);
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          playTimerAlert();
          showToast(
            `Timer finished! Time to move to the next step.`,
            "success"
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeTimer = () => {
    if (timeRemaining > 0) {
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            playTimerAlert();
            showToast(`Timer finished!`, "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setIsPaused(false);
    setTimeRemaining(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const playTimerAlert = () => {
    // Create timer sound using Web Audio API
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const nextStep = () => {
    if (currentStep) {
      setCompletedSteps((prev) => new Set([...prev, currentStep.id]));
    }

    stopTimer();

    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
      showToast("Great job! Moving to the next step.", "success");
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      stopTimer();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    stopTimer();
    setCurrentStepIndex(index);
  };

  const handleComplete = () => {
    showToast("🎉 Congratulations! You've completed the recipe!", "success");
    onComplete?.();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStepIcon = (step: CookingStep) => {
    switch (step.type) {
      case "prep":
        return "🔪";
      case "cook":
        return "🔥";
      case "rest":
        return "⏰";
      case "serve":
        return "🍽️";
      default:
        return "👩‍🍳";
    }
  };

  const getStepColor = (step: CookingStep) => {
    switch (step.type) {
      case "prep":
        return "bg-blue-100 text-blue-800";
      case "cook":
        return "bg-red-100 text-red-800";
      case "rest":
        return "bg-yellow-100 text-yellow-800";
      case "serve":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const processVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase().trim();
    setLastVoiceCommand(command);

    // Voice command patterns
    const commands = [
      {
        patterns: ["next", "next step", "continue", "move on", "go to next"],
        action: () => {
          nextStep();
          showToast("Moving to next step via voice command", "success");
        },
      },
      {
        patterns: ["previous", "back", "go back", "last step", "previous step"],
        action: () => {
          previousStep();
          showToast("Going back to previous step via voice command", "success");
        },
      },
      {
        patterns: ["start timer", "timer", "set timer", "begin timer"],
        action: () => {
          if (currentStep.duration && !isTimerActive) {
            startTimer(currentStep.duration);
            showToast(
              `Started ${currentStep.duration}-minute timer via voice`,
              "success"
            );
          } else if (isTimerActive) {
            showToast("Timer is already running", "info");
          } else {
            showToast("No timer available for this step", "info");
          }
        },
      },
      {
        patterns: ["pause", "pause timer", "stop timer", "hold"],
        action: () => {
          if (isTimerActive && !isPaused) {
            pauseTimer();
            showToast("Timer paused via voice command", "success");
          } else if (isPaused) {
            resumeTimer();
            showToast("Timer resumed via voice command", "success");
          } else {
            showToast("No active timer to pause", "info");
          }
        },
      },
      {
        patterns: ["resume", "resume timer", "continue timer", "unpause"],
        action: () => {
          if (isPaused) {
            resumeTimer();
            showToast("Timer resumed via voice command", "success");
          } else {
            showToast("Timer is not paused", "info");
          }
        },
      },
      {
        patterns: ["repeat", "repeat step", "read again", "what was that"],
        action: () => {
          // Use speech synthesis to read the current step
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
              `Step ${currentStepIndex + 1}: ${currentStep.instruction}`
            );
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
            showToast("Reading current step aloud", "info");
          }
        },
      },
      {
        patterns: ["help", "commands", "what can i say", "voice commands"],
        action: () => {
          setShowVoiceCommands(true);
          showToast("Showing available voice commands", "info");
        },
      },
      {
        patterns: ["done", "complete", "finished", "finish step"],
        action: () => {
          nextStep();
          showToast("Marked step as complete via voice", "success");
        },
      },
    ];

    // Find matching command
    const matchedCommand = commands.find((cmd) =>
      cmd.patterns.some(
        (pattern) =>
          command.includes(pattern) ||
          pattern.split(" ").every((word) => command.includes(word))
      )
    );

    if (matchedCommand) {
      matchedCommand.action();
    } else {
      showToast(
        `Voice command "${command}" not recognized. Say "help" for available commands.`,
        "warning"
      );
    }
  };

  const readCurrentStep = () => {
    if ("speechSynthesis" in window) {
      let text = `Step ${currentStepIndex + 1}: ${currentStep.instruction}`;
      if (currentStep.duration) {
        text += ` This step takes ${currentStep.duration} minutes.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const saveCookingNote = (stepId: string, note: string) => {
    setCookingNotes((prev) => ({ ...prev, [stepId]: note }));
    showToast("Note saved for this step", "success");
  };

  const generateSmartSuggestions = (step: CookingStep) => {
    const suggestions: string[] = [];

    // Generate suggestions based on step type and content
    if (step.type === "cook" && step.instruction.includes("oil")) {
      suggestions.push("💡 Heat oil until it shimmers but doesn't smoke");
      suggestions.push("🔥 Medium-high heat works best for most oils");
    }

    if (step.instruction.includes("onion")) {
      suggestions.push("🧅 Cook onions until translucent for best flavor");
      suggestions.push("⏰ This usually takes 3-5 minutes");
    }

    if (step.type === "prep" && step.instruction.includes("cut")) {
      suggestions.push("🔪 Keep fingers curled and knife sharp for safety");
      suggestions.push("📏 Uniform cuts cook more evenly");
    }

    if (step.temperature) {
      suggestions.push(`🌡️ Use a thermometer to check ${step.temperature}`);
    }

    setSmartSuggestions(suggestions);
  };

  const getIngredientSubstitutions = (ingredient: string) => {
    const substitutions: Record<string, string[]> = {
      butter: ["coconut oil", "olive oil", "vegetable oil"],
      milk: ["almond milk", "coconut milk", "oat milk"],
      eggs: ["flax eggs", "applesauce", "banana"],
      flour: ["almond flour", "coconut flour", "rice flour"],
      sugar: ["honey", "maple syrup", "stevia"],
    };

    return substitutions[ingredient.toLowerCase()] || [];
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate smart suggestions when step changes
  useEffect(() => {
    if (currentStep) {
      generateSmartSuggestions(currentStep);
    }
  }, [currentStepIndex, currentStep]);

  return (
    <div
      className={`h-full flex flex-col bg-gradient-to-br from-gray-50 to-white ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{recipe.title}</h2>
            <div className="flex items-center gap-3">
              {/* Voice Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isVoiceEnabled ? "secondary" : "outline"}
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  size="sm"
                  title="Toggle voice commands"
                >
                  🎤 Voice
                </Button>
                <Button
                  variant="outline"
                  onClick={readCurrentStep}
                  size="sm"
                  title="Read current step aloud"
                >
                  🔊
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowVoiceCommands(true)}
                  size="sm"
                  title="Show voice commands help"
                >
                  ❓
                </Button>
              </div>
              <Button variant="outline" onClick={onExit} className="text-sm">
                Exit Cooking Mode
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              Step {currentStepIndex + 1} of {recipe.steps.length}
            </span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step Instructions */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Current Step */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">
                  {getStepIcon(currentStep)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStepColor(
                    currentStep
                  )}`}
                >
                  {currentStep.type.charAt(0).toUpperCase() +
                    currentStep.type.slice(1)}{" "}
                  Step
                </span>
                {currentStep.duration && (
                  <span className="ml-auto text-sm text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {currentStep.duration} min
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Step {currentStepIndex + 1}:{" "}
                {currentStep.type.charAt(0).toUpperCase() +
                  currentStep.type.slice(1)}
              </h3>

              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                {currentStep.instruction}
              </p>

              {/* Additional Info */}
              {currentStep.temperature && (
                <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-800 font-medium">
                    🌡️ Temperature: {currentStep.temperature}
                  </span>
                </div>
              )}

              {currentStep.equipment && currentStep.equipment.length > 0 && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">
                    🔧 Equipment needed:{" "}
                  </span>
                  <span className="text-blue-700">
                    {currentStep.equipment.join(", ")}
                  </span>
                </div>
              )}

              {currentStep.tips && currentStep.tips.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">
                    💡 Pro Tips:
                  </span>
                  <ul className="text-green-700 mt-1 space-y-1">
                    {currentStep.tips.map((tip, index) => (
                      <li key={index} className="text-sm">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timer Section */}
              {currentStep.duration && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">
                      Step Timer
                    </span>
                    {isTimerActive && (
                      <span className="text-2xl font-bold text-primary">
                        {formatTime(timeRemaining)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!isTimerActive ? (
                      <Button
                        onClick={() => startTimer(currentStep.duration!)}
                        className="flex-1"
                      >
                        Start {currentStep.duration}-min Timer
                      </Button>
                    ) : (
                      <>
                        {isPaused ? (
                          <Button
                            onClick={resumeTimer}
                            variant="secondary"
                            className="flex-1"
                          >
                            Resume Timer
                          </Button>
                        ) : (
                          <Button
                            onClick={pauseTimer}
                            variant="secondary"
                            className="flex-1"
                          >
                            Pause Timer
                          </Button>
                        )}
                        <Button onClick={stopTimer} variant="outline">
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Voice Control Section */}
              {isVoiceEnabled && (
                <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                    🎤 Voice Commands
                    {lastVoiceCommand && (
                      <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        Last: "{lastVoiceCommand}"
                      </span>
                    )}
                  </h4>
                  <VoiceInput
                    onTranscript={processVoiceCommand}
                    placeholder="Say a command like 'next step', 'start timer', or 'repeat'..."
                    isListening={isListening}
                    onListeningChange={setIsListening}
                    className="mb-2"
                  />
                  <div className="text-xs text-purple-600 space-y-1">
                    <div>• "Next step" - Move to next step</div>
                    <div>• "Start timer" - Begin step timer</div>
                    <div>• "Pause" - Pause/resume timer</div>
                    <div>• "Repeat" - Read step aloud</div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={previousStep}
                  disabled={currentStepIndex === 0}
                  variant="outline"
                  className="flex-1"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isLastStep ? "Complete Recipe 🎉" : "Next Step →"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Step Overview */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              All Steps
            </h3>

            <div className="space-y-3">
              {recipe.steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentStepIndex
                      ? "bg-primary text-white shadow-md"
                      : completedSteps.has(step.id)
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {getStepIcon(step)} Step {index + 1}
                    </span>
                    {completedSteps.has(step.id) && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs opacity-90 line-clamp-2">
                    {step.instruction}
                  </p>
                  {step.duration && (
                    <span className="text-xs opacity-75 mt-1 block">
                      ⏱️ {step.duration} min
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Cooking Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Cooking Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium">
                    {formatTime(totalElapsedTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Steps Completed:</span>
                  <span className="font-medium">
                    {completedSteps.size}/{recipe.steps.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Remaining:</span>
                  <span className="font-medium">
                    {Math.max(
                      0,
                      recipe.totalTime - Math.floor(totalElapsedTime / 60)
                    )}{" "}
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Commands Help Modal */}
      {showVoiceCommands && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  🎤 Voice Commands Help
                </h3>
                <button
                  onClick={() => setShowVoiceCommands(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Navigation Commands
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div>
                      • <strong>"Next step"</strong> or{" "}
                      <strong>"Continue"</strong> - Move to next step
                    </div>
                    <div>
                      • <strong>"Previous"</strong> or{" "}
                      <strong>"Go back"</strong> - Return to previous step
                    </div>
                    <div>
                      • <strong>"Done"</strong> or <strong>"Finished"</strong> -
                      Mark current step complete
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Timer Commands
                  </h4>
                  <div className="space-y-1 text-sm text-green-800">
                    <div>
                      • <strong>"Start timer"</strong> - Begin the step timer
                    </div>
                    <div>
                      • <strong>"Pause"</strong> - Pause/resume the timer
                    </div>
                    <div>
                      • <strong>"Resume timer"</strong> - Resume paused timer
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Audio Commands
                  </h4>
                  <div className="space-y-1 text-sm text-purple-800">
                    <div>
                      • <strong>"Repeat"</strong> or{" "}
                      <strong>"Read again"</strong> - Read current step aloud
                    </div>
                    <div>
                      • <strong>"What was that"</strong> - Repeat last
                      instruction
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Help Commands
                  </h4>
                  <div className="space-y-1 text-sm text-yellow-800">
                    <div>
                      • <strong>"Help"</strong> or <strong>"Commands"</strong> -
                      Show this help
                    </div>
                    <div>
                      • <strong>"What can I say"</strong> - List available
                      commands
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    💡 Tips for Best Results
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>• Speak clearly and at normal volume</div>
                    <div>
                      • Wait for the listening indicator before speaking
                    </div>
                    <div>• Use simple, direct commands</div>
                    <div>• Commands work best in quiet environments</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 mt-6 border-t">
                <Button
                  onClick={() => setShowVoiceCommands(false)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
