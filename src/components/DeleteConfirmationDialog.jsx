// import { Button, Box } from "@mui/material";
// import CustomButton from "./CustomButton";

// const DeleteConfirmationDialog = ({
//   open,
//   onClose,
//   onConfirm,
//   deleteItem,
//   deleteMessage,
// }) => {
//   if (!open) return null;

//   return (
//     <Box
//       onClick={onClose}
//       sx={{
//         width: 400,
//         height: 200,
//         position: "absolute",
//         top: "30%",
//         right: "30%",
//         // left: "50%",
//         textAlign: "center",
//         background: "black",
//         borderRadius: "20px",
//         zIndex: "10",
//       }}
//     >
//       <h2 id="parent-modal-title">{deleteItem}</h2>
//       <p id="parent-modal-description">{deleteMessage}</p>

//       <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>

//         <CustomButton btn="primary" label="Delete" onClick={onConfirm} />
//       </Box>
//     </Box>
//   );
// };

// export default DeleteConfirmationDialog;
import { Button, Box } from "@mui/material";
import CustomButton from "./CustomButton";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  deleteItem,
  deleteMessage,
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        height: 200,
        background: "black",
        borderRadius: "20px",
        zIndex: "10",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <h2 id="parent-modal-title">{deleteItem}</h2>
        <p id="parent-modal-description">{deleteMessage}</p>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          mt: "auto",
        }}
      >
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <CustomButton btn="primary" label="Delete" onClick={onConfirm} />
      </Box>
    </Box>
  );
};

export default DeleteConfirmationDialog;
