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
import UserAssignModal from "./UserAssignModal";

const Users = () => {
  const { data, isLoading, refetch, updateMutation } = useUsersAPI("Active");

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState(null);
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
      data?.lists?.filter((_user) => users?.includes(_user.adId)) || null
    );
  };

  const toggleEditModal = (selectedUser) =>
    setSelectedUser((prev) => (!prev ? selectedUser : null));

  const toggleAddUserModal = () => setIsAddOpen((prev) => !prev);

  const onDeleteSubmit = (data) => {
    updateMutation.mutate(
      {
        userId: data.adId,
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

  const onClear = () => {
    setSelectedUsers([]);
    setSelectedUser(null);
    setAssignableUsers([]);
    setDeletableUser([]);
    setDeletableUser(null);
    refetch();
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
          <button
            disabled={selectedUsers.length === 0}
            onClick={() => toggleAssignModal(selectedUsers)}
          >
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
          users={data?.filter((_user) =>
            [_user.first_name, _user.last_name]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          )}
          isLoading={isLoading}
          selectedUsers={selectedUsers}
          toggleEditModal={toggleEditModal}
          toggleSelectedUsers={toggleSelectedUsers}
          onDeleteSubmit={onDeleteSubmit}
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
        title={`Are you sure want to remove ${deletableUser?.first_name} from active users?`}
        description=" "
        newImg={notUser}
        isOpen={!!deletableUser}
        close={toggleDeleteModal}
        onSubmit={onDeleteSubmit}
        isLoading={updateMutation.isLoading}
      />

      {!!assignableUsers && assignableUsers.length !== 0 && (
        <UserAssignModal
          refetch={refetch}
          isOpen={!!assignableUsers}
          close={toggleAssignModal}
          _users={assignableUsers}
          onClear={onClear}
        />
      )}

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
