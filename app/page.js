"use client";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { analyzeImage } from "./api/vision";
import AddItem from "./Components/AddItem";
import CameraModal from "./Components/CameraModal";
import ShowItems from "./Components/ShowItems";
import "./globals.css";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCapture = useCallback(async (image) => {
    const base64Image = image.split(",")[1];
    const imageName = await analyzeImage(base64Image);
    if (imageName) {
      await addItem(imageName);
      setPendingItem(imageName);
      setConfirmOpen(true);
    } else {
      console.log("Image not recognized");
    }
  }, []);

  const updateInventory = debounce(async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  }, 300);

  useEffect(() => {
    updateInventory();
  }, []);

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        const batch = writeBatch(firestore);
        if (quantity === 1) {
          batch.delete(docRef);
        } else {
          batch.set(docRef, { quantity: quantity - 1 });
        }
        await batch.commit();
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);
      const batch = writeBatch(firestore);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        batch.set(docRef, { quantity: quantity + 1 });
      } else {
        batch.set(docRef, { quantity: 1 });
      }
      await batch.commit();
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleCameraOpen = useCallback(() => setCameraOpen(true), []);
  const handleCameraClose = useCallback(() => setCameraOpen(false), []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleOpen}
        >
          Add New Item
        </button>
        {open && (
          <AddItem
            handleClose={handleClose}
            itemName={itemName}
            setItemName={setItemName}
            addItem={addItem}
          />
        )}
        <ShowItems
          addItem={addItem}
          removeItem={removeItem}
          inventory={inventory}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleCameraOpen}
        >
          Open Camera
        </button>
        <CameraModal
          open={cameraOpen}
          onClose={handleCameraClose}
          onCapture={handleCapture}
        />
      </div>
    </>
  );
}
