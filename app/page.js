"use client";
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddItem from "./Components/AddItem";
import ShowItems from "./Components/ShowItems";

export default function Home() {
  // Create states to hold firebase data
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  
  const updateInventory = async () => {
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
    console.log(inventoryList)
  }

  //Only run updateInventory on mount(page load)
  useEffect(() => {
    updateInventory();
  }, []);

  //Delete item
  const removeItem = async (item) => {
    //get Reference
    const docRef = doc(collection(firestore, "inventory"), item);
    //get snapshot
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1});
      }
    }
    await updateInventory();
  }

  //Add item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1});
    } else {
      await setDoc(docRef, { quantity: 1});
    }
    await updateInventory();
  };

  //helper functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={handleOpen}
      > Add New Item
      </button>
      {open && (
        <AddItem handleClose={handleClose} itemName={itemName} setItemName={setItemName} addItem={addItem}/>
      )}
      <ShowItems addItem={addItem} removeItem={removeItem} inventory={inventory}/>
    </div>
    </>
  );
}
