import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CloseIcon } from './icons/index';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };

    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      stopCamera();
    };
  }, [onClose, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
    if (!streamRef.current) {
      // Restart camera if it was stopped
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
            setError("Could not access the camera.");
        }
      };
      startCamera();
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60]" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-2xl p-4 w-full max-w-lg m-4 relative animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-white">{t('cameraModalTitle')}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4">{error}</div>}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${capturedImage || error ? 'hidden' : ''}`}
            />
            {capturedImage && (
                <img src={capturedImage} alt="Captured tree" className="w-full h-full object-cover" />
            )}
             <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-4 flex justify-center space-x-4">
            {!capturedImage ? (
                <button
                    onClick={handleCapture}
                    disabled={!!error}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors text-lg font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {t('takePicture')}
                </button>
            ) : (
                <>
                    <button
                        onClick={handleRetake}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors font-medium"
                    >
                        {t('retakePhoto')}
                    </button>
                    <button
                        onClick={handleUsePhoto}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors font-semibold"
                    >
                        {t('usePhoto')}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;