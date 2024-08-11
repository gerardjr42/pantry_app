import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, TextField } from "@mui/material";
import { useEffect, useRef } from "react";

export default function AddItem({
  handleClose,
  itemName,
  setItemName,
  addItem,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(itemName);
    setItemName("");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-4">Add Item</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <TextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
          <Button variant="contained" color="primary" fullWidth type="submit">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
