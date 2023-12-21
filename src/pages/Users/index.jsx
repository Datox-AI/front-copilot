import { Box, Button, IconButton } from "@mui/material";
import useUsersAPI from "../../hooks/api/useUsersAPI";
import UsersTable from "./UsersTable";
import styles from "./style.module.scss";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { ReactComponent as PeopleIcon } from "../../assets/icons/people.svg";
import { ReactComponent as DeactivateIcon } from "../../assets/icons/deactivate-user.svg";
import { ReactComponent as AssignIcon } from "../../assets/icons/assign-role.svg";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";
import DeleteChatPopup from "../Chat/FileBar/DeleteChatPopup";
import notUser from "../../assets/icons/delete-usr.png";
import toast from "react-hot-toast";

const Users = () => {
  const { data, isLoading, refetch, updateMutation } = useUsersAPI("Active");

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [deletableUser, setDeletableUser] = useState(null);
  const [deletableUsers, setDeletableUsers] = useState(null);

  const toggleSelectedUsers = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? [...prev.filter((user) => user !== userId)]
        : [...prev, userId]
    );
  };

  const toggleDeletableUsers = (users) => {
    setDeletableUsers(users || null);
  };

  const toggleDeleteModal = (user) =>
    setDeletableUser((prev) => (!prev ? user : null));

  const toggleAssignModal = (users) => {
    setAssignableUsers(
      users?.map((user) => ({
        userId: user.adId,
        roleId: user.roles[0]?.id
      })) || null
    );
  };

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
          toast.success("User is successfuly deactivated");
        },
        onError: (err) => {
          toast.error(err.data.title);
        }
      }
    );
  };

  const onDeleteAllSubmit = () => {
    deletableUsers.forEach((user, u) =>
      updateMutation.mutate(
        {
          userId: user,
          roleIds: []
        },

        {
          onSuccess: () => {
            if (u === deletableUsers.length - 1) {
              refetch();
              toggleDeletableUsers();
              setSelectedUsers([]);
              toast.success("Users are successfuly deactivated");
            }
          },
          onError: (err) => {
            toast.error(err.data.title);
          }
        }
      )
    );
  };

  return (
    <>
      <section className={styles.header}>
        <Box display="flex" alignItems="center" gap="35px">
          <button onClick={toggleAddUserModal}>
            <PeopleIcon /> Add Users
          </button>
          <button
            disabled={selectedUsers.length === 0}
            onClick={() => toggleDeletableUsers(selectedUsers)}
          >
            <DeactivateIcon /> Deactivate Users
          </button>
          <button disabled={selectedUsers.length === 0}>
            <AssignIcon /> Assign Roles
          </button>
        </Box>

        <label>
          <Search />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </section>
      <section className={styles.container}>
        <Box display="flex" alignItems="center" gap="20px">
          <h1>Users</h1>
        </Box>

        <UsersTable
          users={data?.lists}
          isLoading={isLoading}
          selectedUsers={selectedUsers}
          toggleEditModal={toggleEditModal}
          toggleDeleteModal={toggleDeleteModal}
          toggleSelectedUsers={toggleSelectedUsers}
        />
      </section>

      <DeleteChatPopup
        title={`Are you sure want to remove users from active list?`}
        description=" "
        newImg={notUser}
        isOpen={!!deletableUsers}
        close={toggleDeletableUsers}
        onSubmit={onDeleteAllSubmit}
        isLoading={updateMutation.isLoading}
      />

      {/* FOR BULK DEACTIVATE */}
      <DeleteChatPopup
        title={`Are you sure want to remove ${deletableUser?.displayName} from active users?`}
        description=" "
        newImg={notUser}
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
