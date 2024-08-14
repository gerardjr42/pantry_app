"use client";
import { firestore } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { analyzeImage } from "./api/vision";
import AddItem from "./Components/AddItem";
import CameraModal from "./Components/CameraModal";
import RecipeSuggestion from "./Components/RecipeSuggestion";
import ShowItems from "./Components/ShowItems";
import "./globals.css";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);

  const handleCapture = useCallback(async (image) => {
    const base64Image = image.split(",")[1];
    const imageName = await analyzeImage(base64Image);
    if (imageName) {
      await addItem(imageName);
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

  const deleteItem = async (itemName) => {
    try {
      const docRef = doc(collection(firestore, "inventory"), itemName);
      await deleteDoc(docRef);
      await updateInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Camera Modal
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleCameraOpen = useCallback(() => setCameraOpen(true), []);
  const handleCameraClose = useCallback(() => setCameraOpen(false), []);

  //Recipe Modal
  const handleRecipeOpen = useCallback(() => setRecipeOpen(true), []);

  const handleRecipeClose = useCallback(() => setRecipeOpen(false), []);

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-800 min-h-screen">
      <h1 className="text-4xl font-bold text-center py-8 text-white">
        Pantry Management
      </h1>
      <div className="flex flex-col items-center justify-start w-screen min-h-screen gap-6 p-4">
        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-[800px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={handleOpen}
          >
            Add New Item
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={handleCameraOpen}
          >
            Open Camera
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={handleRecipeOpen}
          >
            Suggest Recipe
          </button>
        </motion.div>
        {open && (
          <AddItem
            handleClose={handleClose}
            itemName={itemName}
            setItemName={setItemName}
            addItem={addItem}
          />
        )}
        <motion.div
          className="w-full max-w-[800px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ShowItems
            inventory={inventory}
            addItem={addItem}
            removeItem={removeItem}
            deleteItem={deleteItem}
          />
        </motion.div>
        <CameraModal
          open={cameraOpen}
          onClose={handleCameraClose}
          onCapture={handleCapture}
        />
        <RecipeSuggestion
          open={recipeOpen}
          onClose={handleRecipeClose}
          inventory={inventory}
        />
      </div>
    </div>
  );
}
