import React, { useState, useRef, useCallback } from 'react';
import Button from './Button';
import { useToast } from './Toast';

interface ScanResult {
  type: 'ingredient' | 'recipe' | 'barcode';
  confidence: number;
  data: any;
}

interface CameraScannerProps {
  onScanResult: (result: ScanResult) => void;
  onClose: () => void;
  scanType?: 'ingredient' | 'recipe' | 'barcode' | 'all';
}

export default function CameraScanner({ 
  onScanResult, 
  onClose, 
  scanType = 'all' 
}: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      showToast('Camera started! Point at ingredients, recipes, or barcodes', 'success');
    } catch (error: any) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        showToast('Camera permission denied. Please enable camera access.', 'error');
      } else if (error.name === 'NotFoundError') {
        showToast('No camera found on this device.', 'error');
      } else {
        showToast('Failed to start camera. Please try again.', 'error');
      }
    }
  }, [showToast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      showToast('Analyzing image...', 'info');

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Capture current frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob for analysis
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Simulate AI analysis (replace with real API calls)
        const result = await analyzeImage(blob, scanType);
        
        if (result) {
          onScanResult(result);
          showToast(`${result.type} detected with ${Math.round(result.confidence * 100)}% confidence!`, 'success');
        } else {
          showToast('No recognizable items found. Try different angle or lighting.', 'warning');
        }
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Image analysis error:', error);
      showToast('Failed to analyze image. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [scanType, onScanResult, showToast, isProcessing]);

  // Simulated AI analysis function (replace with real implementation)
  const analyzeImage = async (imageBlob: Blob, type: string): Promise<ScanResult | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock results based on scan type
    const mockResults: { [key: string]: ScanResult } = {
      ingredient: {
        type: 'ingredient',
        confidence: 0.85,
        data: {
          name: 'Roma Tomatoes',
          category: 'Vegetables',
          freshness: 'Good',
          estimated_quantity: '500g'
        }
      },
      recipe: {
        type: 'recipe',
        confidence: 0.78,
        data: {
          name: 'Jollof Rice Recipe',
          source: 'Cookbook scan',
          ingredients_detected: ['rice', 'tomatoes', 'onions', 'spices']
        }
      },
      barcode: {
        type: 'barcode',
        confidence: 0.95,
        data: {
          code: '123456789012',
          product_name: 'Uncle Bens Jasmine Rice',
          brand: 'Uncle Bens',
          size: '1kg'
        }
      }
    };

    // Random selection for demo (replace with real AI)
    const types = type === 'all' ? ['ingredient', 'recipe', 'barcode'] : [type];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return mockResults[randomType] || null;
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Camera Permission Required
          </h3>
          <p className="text-gray-600 mb-6">
            To scan ingredients, recipes, or barcodes, we need access to your camera. 
            Please enable camera permission in your browser settings.
          </p>
          <div className="flex gap-3">
            <Button onClick={startCamera} className="flex-1">
              Try Again
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Scanner
              </h3>
              <p className="text-sm text-gray-600">
                Scan {scanType === 'all' ? 'ingredients, recipes, or barcodes' : scanType}
              </p>
            </div>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative bg-black">
          {!isScanning ? (
            <div className="aspect-video flex items-center justify-center">
              <Button onClick={startCamera} size="lg">
                📷 Start Camera
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-green-400 rounded-lg w-64 h-64 relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                </div>
              </div>

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-900 font-medium">Analyzing image...</p>
                    <p className="text-gray-600 text-sm">This may take a few seconds</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        {isScanning && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3 justify-center">
              <Button
                onClick={captureAndAnalyze}
                disabled={isProcessing}
                size="lg"
                className="flex items-center gap-2"
              >
                📸 Capture & Analyze
              </Button>
              <Button
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                variant="outline"
                size="lg"
              >
                Cancel
              </Button>
            </div>
            
            {/* Instructions */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Position the item in the green frame and tap "Capture & Analyze"
              </p>
            </div>
          </div>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}