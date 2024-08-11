import { motion } from "framer-motion";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ShowItems({
  inventory,
  addItem,
  removeItem,
  deleteItem,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const filteredInventory = inventory
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "quantity-asc") {
        return a.quantity - b.quantity;
      } else if (sortOption === "quantity-desc") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  return (
    <div className="w-full max-w-5xl mx-auto shadow-xl rounded-lg bg-white flex flex-col h-[calc(80vh-100px)] overflow-y-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-purple-500 p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 bg-white"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto bg-white"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Ascending)</option>
          <option value="quantity-desc">Quantity (Descending)</option>
        </select>
      </div>
      <div className="flex-grow overflow-y-scroll">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-teal-500 to-purple-500 text-white sticky top-0">
            <tr>
              <th className="px-6 py-3 w-1/2">Item</th>
              <th className="px-6 py-3 w-1/4">Quantity</th>
              <th className="px-6 py-3 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <motion.tr
                key={item.name}
                className="border-b border-gray-200 hover:bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 font-medium w-1/2">{item.name}</td>
                <td className="px-6 py-4 w-1/4">{item.quantity}</td>
                <td className="px-6 py-4 w-1/4">
                  <div className="flex items-center justify-start space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                      onClick={() => addItem(item.name)}
                      aria-label="Add item"
                    >
                      <CirclePlus size={20} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                      onClick={() => removeItem(item.name)}
                      aria-label="Remove item"
                    >
                      <CircleMinus size={20} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                      onClick={() => deleteItem(item.name)}
                      aria-label="Delete item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
