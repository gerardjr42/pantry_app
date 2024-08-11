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
    <div className="border border-gray-400 rounded-md w-[800px] h-[500px] overflow-auto">
      <div className="bg-blue-200 p-4 flex justify-between items-center">
        <h2>Inventory Items</h2>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Ascending)</option>
          <option value="quantity-desc">Quantity (Descending)</option>
        </select>
      </div>
      <div className="p-4 space-y-4">
        {filteredInventory.map(({ name, quantity }) => (
          <div
            className="bg-gray-100 p-4 flex justify-between items-center"
            key={name}
          >
            <h3 className="text-xl font-bold text-gray-700 capitalize">
              {name}
            </h3>
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
  );
}
