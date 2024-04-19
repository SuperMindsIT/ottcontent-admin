import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Link, Stack } from "@mui/material";
import useGamesApi from "../../api/useGamesApi";
import MainLayout from "../../layouts/MainLayout";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

const GamesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteData } = useGamesApi();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (gameId) => {
    setDeleteId(gameId);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteData(deleteId);
    setOpen(false);
  };

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const columns = [
    { field: "createdAt", headerName: "Date Created", flex: 1 },
    { field: "title", headerName: "Name", flex: 1 },
    {
      field: "iframe",
      headerName: "iframe",
      sortable: false,
      renderCell: (params) => (
        <Link
          sx={{
            textDecoration: "none",
            color: "#0E8BFF",
            fontWeight: 500,
            textDecorationLine: "underline",
          }}
          target="_blank"
          href={`${params.row.iframe}`}
        >
          LINK
        </Link>
      ),
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ px: 0, minWidth: 0 }}
              onClick={() => handleGameClick(params.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g opacity="0.7">
                  <path
                    d="M16.1669 6.11606L13.8836 3.83273C13.5856 3.55281 13.1951 3.39219 12.7864 3.38144C12.3776 3.37068 11.9792 3.51053 11.6669 3.77439L4.16691 11.2744C3.89755 11.546 3.72983 11.9021 3.69191 12.2827L3.33358 15.7577C3.32235 15.8798 3.33819 16.0028 3.37996 16.118C3.42174 16.2333 3.48842 16.3379 3.57525 16.4244C3.65311 16.5016 3.74546 16.5627 3.84699 16.6042C3.94852 16.6457 4.05724 16.6667 4.16691 16.6661H4.24191L7.71691 16.3494C8.09758 16.3115 8.45361 16.1438 8.72525 15.8744L16.2252 8.37439C16.5163 8.06687 16.6737 7.65648 16.6627 7.23317C16.6518 6.80986 16.4735 6.40815 16.1669 6.11606ZM13.3336 8.89939L11.1002 6.66606L12.7252 4.99939L15.0002 7.27439L13.3336 8.89939Z"
                    fill="white"
                  />
                </g>
              </svg>
            </Button>
            <Button
              sx={{ px: 0, minWidth: 0, position: "relative" }}
              onClick={() => handleDeleteClick(params.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
              >
                <g opacity="0.74">
                  <path
                    d="M18.0384 5.0005H13.8717V3.60883C13.8522 3.07535 13.6219 2.57138 13.2314 2.20741C12.8409 1.84344 12.3219 1.64916 11.7884 1.66716H9.28841C8.75487 1.64916 8.23596 1.84344 7.84544 2.20741C7.45491 2.57138 7.22463 3.07535 7.20508 3.60883V5.0005H3.03841C2.8174 5.0005 2.60544 5.0883 2.44916 5.24458C2.29288 5.40086 2.20508 5.61282 2.20508 5.83383C2.20508 6.05484 2.29288 6.26681 2.44916 6.42309C2.60544 6.57937 2.8174 6.66716 3.03841 6.66716H3.87174V15.8338C3.87174 16.4969 4.13514 17.1328 4.60398 17.6016C5.07282 18.0704 5.7087 18.3338 6.37174 18.3338H14.7051C15.3681 18.3338 16.004 18.0704 16.4728 17.6016C16.9417 17.1328 17.2051 16.4969 17.2051 15.8338V6.66716H18.0384C18.2594 6.66716 18.4714 6.57937 18.6277 6.42309C18.7839 6.26681 18.8717 6.05484 18.8717 5.83383C18.8717 5.61282 18.7839 5.40086 18.6277 5.24458C18.4714 5.0883 18.2594 5.0005 18.0384 5.0005ZM8.87174 3.60883C8.87174 3.4755 9.04674 3.33383 9.28841 3.33383H11.7884C12.0301 3.33383 12.2051 3.4755 12.2051 3.60883V5.0005H8.87174V3.60883ZM15.5384 15.8338C15.5384 16.0548 15.4506 16.2668 15.2943 16.4231C15.1381 16.5794 14.9261 16.6672 14.7051 16.6672H6.37174C6.15073 16.6672 5.93877 16.5794 5.78249 16.4231C5.62621 16.2668 5.53841 16.0548 5.53841 15.8338V6.66716H15.5384V15.8338Z"
                    fill="white"
                  />
                  <path
                    d="M8.03841 14.166C8.25943 14.166 8.47139 14.0782 8.62767 13.9219C8.78395 13.7657 8.87174 13.5537 8.87174 13.3327V9.99935C8.87174 9.77834 8.78395 9.56637 8.62767 9.41009C8.47139 9.25381 8.25943 9.16602 8.03841 9.16602C7.8174 9.16602 7.60544 9.25381 7.44916 9.41009C7.29288 9.56637 7.20508 9.77834 7.20508 9.99935V13.3327C7.20508 13.5537 7.29288 13.7657 7.44916 13.9219C7.60544 14.0782 7.8174 14.166 8.03841 14.166ZM13.0384 14.166C13.2594 14.166 13.4714 14.0782 13.6277 13.9219C13.7839 13.7657 13.8717 13.5537 13.8717 13.3327V9.99935C13.8717 9.77834 13.7839 9.56637 13.6277 9.41009C13.4714 9.25381 13.2594 9.16602 13.0384 9.16602C12.8174 9.16602 12.6054 9.25381 12.4492 9.41009C12.2929 9.56637 12.2051 9.77834 12.2051 9.99935V13.3327C12.2051 13.5537 12.2929 13.7657 12.4492 13.9219C12.6054 14.0782 12.8174 14.166 13.0384 14.166Z"
                    fill="white"
                  />
                </g>
              </svg>
            </Button>
            <DeleteConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleDeleteConfirm}
              deleteItem={"Delete Game?"}
              deleteMessage={"Are you sure you want to delete this Game?"}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <MainLayout
      title="Games"
      rows={data}
      columns={columns}
      isLoading={isLoading}
      onAddClick={() => navigate("/games/add")}
      searchFields={["title"]}
    />
  );
};

export default GamesPage;
