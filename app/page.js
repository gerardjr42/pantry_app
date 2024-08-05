"use client";
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddItem from "./Components/AddItem";

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
      >
        Add New Item
      </button>
      {open && (
        <AddItem handleClose={handleClose} itemName={itemName} setItemName={setItemName} addItem={addItem}/>
      )}
      {/* Show data */}
      <div className="border border-gray-400 rounded-md w-[800px] h-[500px] overflow-auto">
        <div className="bg-blue-200 p-4">
          <h2>Inventory Items</h2>
        </div>
        <div className="p-4 space-y-4">
          {inventory.map(({ name, quantity}) => (
            <div 
              className="bg-gray-100 p-4 flex justify-between items-center"
              key={name}
            >
              <h3 className="text-xl font-bold text-gray-700 capitalize">{name}</h3>
              <p className="text-xl font-bold text-gray-700">{quantity}</p>
              <div className="space-x-2">
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={() => addItem(name)}
                >
                  Add
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
