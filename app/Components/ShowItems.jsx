import { useState } from "react";

export default function ShowItems({ inventory, addItem, removeItem }) {
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
    <div className="border border-gray-400 rounded-md w-full max-w-[800px] h-[calc(100vh-200px)] overflow-auto">
      <div className="bg-blue-200 p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <h2 className="text-lg font-bold">Inventory Items</h2>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Ascending)</option>
          <option value="quantity-desc">Quantity (Descending)</option>
        </select>
      </div>
      <div className="p-4 space-y-4">
        {/* Header row */}
        <div className="grid grid-cols-3 gap-4 items-center font-bold text-gray-700 bg-gray-200 p-2 rounded-md">
          <div className="pl-4">Name</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Configure</div>
        </div>
        {/* Inventory items */}
        {filteredInventory.map(({ name, quantity }) => (
          <div
            className="bg-gray-100 p-4 grid grid-cols-3 gap-4 items-center grid-flow-col"
            key={name}
          >
            <h3 className="text-lg font-bold text-gray-700 capitalize truncate pl-4">
              {name}
            </h3>
            <p className="text-lg font-bold text-gray-700 text-center">
              {quantity}
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={() => addItem(name)}
              >
                Add
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={() => removeItem(name)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
