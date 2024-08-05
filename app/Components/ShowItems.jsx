
export default function ShowItems({inventory, addItem, removeItem}) {
  return (
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
  )
}
