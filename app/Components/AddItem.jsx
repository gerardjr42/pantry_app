
export default function AddItem({handleClose, itemName, setItemName, addItem}) {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={handleClose}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Item</h2>
            <div className="flex space-x-2">
              <label htmlFor="itemName"></label>
              <input
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={(e) => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
              Add
              </button>
            </div>
          </div>
        </div>
  )
}
