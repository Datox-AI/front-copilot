import { Search } from "@mui/icons-material";
import Popup from "../../../components/Popup";
import useUsersAPI from "../../../hooks/api/useUsersAPI";
import styles from "../style.module.scss";
import { ReactComponent as AdminIcon } from "../../../assets/icons/admin.svg";
import { ReactComponent as PeopleIcon } from "../../../assets/icons/people.svg";
import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select
} from "@mui/material";
import { stringAvatar } from "../../../utils";
import useRolesAPI from "../../../hooks/api/useRolesAPI";
import toast from "react-hot-toast";

const UserAddModal = ({ isOpen, close, refetch }) => {
  const {
    data,
    updateMutation,
    refetch: refetchInactiveUsers
  } = useUsersAPI("Inactive");
  const { data: roles } = useRolesAPI();

  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setSelectedUsers([]);
  }, [data]);

  const handleSave = useCallback(async () => {
    selectedUsers.map(async (selectedUser, u) => {
      await updateMutation.mutateAsync({
        roleIds: [selectedUser.roleId],
        userId: selectedUser.userId
      });

      refetch();
      refetchInactiveUsers();

      if (u === selectedUsers.length - 1)
        toast.success("User is successfuly updated");
    });
  }, [selectedUsers]);

  const onChangeRole = (userId, roleId) => {
    if (roleId) {
      const found =
        selectedUsers.length > 0 &&
        selectedUsers?.find((_user) => _user.userId === userId);

      if (found)
        setSelectedUsers((prev) =>
          prev?.map((us) => (us.userId === userId ? { userId, roleId } : us))
        );
      else setSelectedUsers((prev) => [...prev, { userId, roleId }]);
    } else {
      setSelectedUsers((prev) => [
        ...prev?.map((us) => us.userId !== userId).filter((us) => us)
      ]);
    }
  };

  return (
    <Popup isOpen={isOpen} title="Add User" close={close}>
      <div className={styles.addModal}>
        <label>
          <Search />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <ul>
          {data?.lists
            ?.filter((user) =>
              user?.displayName?.toLowerCase().includes(search?.toLowerCase())
            )
            ?.map((user, u) => {
              const foundUser =
                selectedUsers.length > 0 &&
                selectedUsers?.find((sel) => sel.userId === user.adId);

              return (
                <li key={u} className={!!foundUser && styles.selected}>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    gap="10px"
                  >
                    <Avatar
                      {...stringAvatar(user?.displayName || "DATOX U")}
                      sx={{
                        ...stringAvatar(user?.displayName || "DATOX U").sx,
                        height: 32,
                        width: 32,
                        fontSize: 14
                      }}
                    />{" "}
                    {user.displayName}
                  </Box>

                  <Select
                    key={user.adId}
                    labelId="role-select-label"
                    id="role-select"
                    value={foundUser?.roleId}
                    placeholder="Select a role"
                    onChange={(e) => onChangeRole(user.adId, e.target.value)}
                    style={{
                      width: 200
                    }}
                  >
                    <MenuItem value={null} className="menu-item-select">
                      None
                    </MenuItem>
                    {roles?.map((role) => (
                      <MenuItem
                        value={role.id}
                        key={role.id}
                        className="menu-item-select"
                      >
                        {role.name === "Admin" ? <AdminIcon /> : <PeopleIcon />}{" "}
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </li>
              );
            })}
        </ul>

        <Box display="flex" alignItems="center" width="100%" mt={2} gap="10px">
          <Button
            variant="outlined"
            fullWidth
            className={styles.button}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            className={styles.button}
            disabled={updateMutation.isLoading}
            onClick={handleSave}
          >
            {updateMutation.isLoading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </Box>
      </div>
    </Popup>
  );
};

export default UserAddModal;
