"use client";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";

const CameraModal = ({ open, onClose, onCapture }) => {
  const [image, setImage] = useState(null);
  const [frontView, setFrontView] = useState("user");
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  const takePhoto = () => {
    const imageSrc = cameraRef.current.takePhoto();
    setImage(imageSrc);
  };

  const retakePhoto = () => {
    setImage(null);
  };

  const confirmPhoto = async () => {
    setLoading(true);
    await onCapture(image);
    setLoading(false);
    setImage(null);
    onClose();
  };

  const switchView = () => {
    setFrontView(frontView === "user" ? "environment" : "user");
  };

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.switchView();
    }
  }, [frontView]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {!image ? (
          <div className="relative w-full h-96 bg-black flex flex-col justify-center items-center">
            <Camera
              ref={cameraRef}
              facingMode={frontView}
              aspectRatio="cover"
              className="w-full h-full"
            />
            <button
              className="absolute bottom-4 bg-gray-800 text-white p-2 rounded-full"
              onClick={takePhoto}
            >
              <CameraAltIcon className="w-6 h-6" />
            </button>
            <button
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
              onClick={switchView}
            >
              <SyncIcon className="w-6 h-6" />
            </button>
            <button
              className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full"
              onClick={onClose}
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="text-center relative">
            <img
              src={image}
              alt="Captured"
              className="w-full h-96 object-cover"
            />
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-gray-800 text-white p-2 rounded-full"
                onClick={retakePhoto}
              >
                <SyncIcon className="w-6 h-6" />
              </button>
              <button
                className="bg-gray-800 text-white p-2 rounded-full"
                onClick={confirmPhoto}
              >
                <CheckIcon className="w-6 h-6" />
              </button>
            </div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="loader"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
