import { Box, Button, IconButton } from "@mui/material";
import useUsersAPI from "../../hooks/api/useUsersAPI";
import UsersTable from "./UsersTable";
import styles from "./style.module.scss";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";
import DeleteChatPopup from "../Chat/FileBar/DeleteChatPopup";
import toast from "react-hot-toast";

const Users = () => {
  const { data, isLoading, refetch, updateMutation } = useUsersAPI("Active");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletableUser, setDeletableUser] = useState(null);

  const toggleDeleteModal = (user) =>
    setDeletableUser((prev) => (!prev ? user : null));

  const toggleEditModal = (selectedUser) =>
    setSelectedUser((prev) => (!prev ? selectedUser : null));

  const toggleAddUserModal = () => setIsAddOpen((prev) => !prev);

  const onDeleteSubmit = () => {
    updateMutation.mutate(
      {
        userId: deletableUser.adId,
        roleIds: []
      },
      {
        onSuccess: () => {
          refetch();
          toggleDeleteModal();
        },
        onError: (err) => {
          toast.error(err.data.title);
        }
      }
    );
  };

  return (
    <>
      <section className={styles.container}>
        <Box display="flex" alignItems="center" gap="20px">
          <h1>Users</h1>

          <Button
            variant="contained"
            onClick={toggleAddUserModal}
            style={{
              minWidth: 40,
              maxWidth: 40,
              height: 40
            }}
          >
            <Add />
          </Button>
        </Box>

        <UsersTable
          users={data?.lists}
          isLoading={isLoading}
          toggleEditModal={toggleEditModal}
          toggleDeleteModal={toggleDeleteModal}
        />
      </section>

      <DeleteChatPopup
        title={`Are you sure want to remove ${deletableUser?.displayName} from active users?`}
        description=" "
        isOpen={!!deletableUser}
        close={toggleDeleteModal}
        onSubmit={onDeleteSubmit}
        isLoading={updateMutation.isLoading}
      />

      {isAddOpen && (
        <UserAddModal
          refetch={refetch}
          isOpen={isAddOpen}
          close={toggleAddUserModal}
        />
      )}

      {!!selectedUser && (
        <UserEditModal
          refetch={refetch}
          isOpen={!!selectedUser}
          close={toggleEditModal}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
};

export default Users;
