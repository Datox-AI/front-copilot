import { Search } from "@mui/icons-material";
import Popup from "../../../components/Popup";
import useUsersAPI from "../../../hooks/api/useUsersAPI";
import styles from "../style.module.scss";
import { ReactComponent as CheckboxIcon } from "../../../assets/icons/checkbox.svg";
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

const UserAddModal = ({ isOpen, close, refetch }) => {
  const {
    data,
    updateMutation,
    refetch: refetchInactiveUsers
  } = useUsersAPI("Inactive");
  const { data: roles } = useRolesAPI();

  const [selectedRole, setSelectedRole] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!roles || !!selectedRole) return;

    setSelectedRole(roles?.lists?.find((role) => role.name === "User")?.id);
  }, [roles]);

  const toggleSelectedUsers = (user) => {
    const foundUser = selectedUsers.find((_user) => _user.adId === user.adId);

    if (foundUser)
      setSelectedUsers((prev) =>
        prev.filter((_user) => _user.adId !== user.adId)
      );
    else setSelectedUsers((prev) => [...prev, user]);
  };

  const handleSave = useCallback(async () => {
    selectedUsers.map(async (selectedUser) => {
      await updateMutation.mutateAsync({
        roleIds: [selectedRole],
        userId: selectedUser.adId
      });

      refetch();
      refetchInactiveUsers();
    });
  }, [selectedRole, selectedUsers]);

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
              user.displayName.toLowerCase().includes(search.toLowerCase())
            )
            ?.map((user, u) => (
              <li
                key={u}
                onClick={() => toggleSelectedUsers(user)}
                className={
                  selectedUsers.find((_user) => _user.adId === user.adId) &&
                  styles.selected
                }
              >
                <CheckboxIcon />{" "}
                <Avatar
                  {...stringAvatar(user.displayName)}
                  sx={{
                    ...stringAvatar(user.displayName).sx,
                    height: 32,
                    width: 32,
                    fontSize: 14
                  }}
                />{" "}
                {user.displayName}
              </li>
            ))}
        </ul>

        <Box width="100%" mt={2}>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={selectedRole}
            placeholder="Select a role"
            label="Role"
            onChange={(e) => setSelectedRole(e.target.value)}
            fullWidth
          >
            {roles?.lists?.map((role) => (
              <MenuItem value={role.id} key={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

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
