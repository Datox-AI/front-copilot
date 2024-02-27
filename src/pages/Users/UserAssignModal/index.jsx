import { Search } from "@mui/icons-material";
import Popup from "../../../components/Popup";
import useUsersAPI from "../../../hooks/api/useUsersAPI";
import styles from "../style.module.scss";
import { ReactComponent as CheckboxIcon } from "../../../assets/icons/checkbox.svg";
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

const UserAssignModal = ({ isOpen, close, _users, onClear }) => {
  const { updateMutation } = useUsersAPI("Inactive");
  const { data: roles } = useRolesAPI();

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setSelectedUsers(
      _users.map((_user) => ({
        userId: _user.azure_object_id,
        roleId: _user.roles[0].azure_role_id
      }))
    );
  }, [_users]);

  const handleSave = useCallback(async () => {
    selectedUsers.map((selectedUser, idx) => {
      updateMutation.mutate(
        {
          role_ids: [selectedUser.roleId],
          user_id: selectedUser.userId
        },
        {
          onSuccess: () => {
            if (idx === selectedUsers.length - 1) {
              toast.success(
                `${
                  selectedUsers.length === 1 ? "User is" : "Users are"
                } successful assigned`
              );
              onClear();
            }
          },
          onError: (err) => {
            toast.error(err.data?.detail);
          }
        }
      );
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
    <Popup isOpen={isOpen} title="Assign Roles" close={close}>
      <div className={styles.addModal}>
        <ul>
          {_users.map((user, u) => {
            const foundUser =
              selectedUsers?.length > 0 &&
              selectedUsers?.find((sel) => sel.userId === user.azure_object_id);

            return (
              <li key={u} className={!!foundUser && styles.selected}>
                <Box display="flex" alignItems="center" width="100%" gap="10px">
                  <Avatar
                    {...stringAvatar(
                      [user.first_name, user.last_name].join(" ")
                    )}
                    sx={{
                      ...stringAvatar(
                        [user.first_name, user.last_name].join(" ")
                      ).sx,
                      height: 32,
                      width: 32,
                      fontSize: 14
                    }}
                  />{" "}
                  {[user.first_name, user.last_name].join(" ")}
                </Box>

                <Select
                  key={user.azure_object_id}
                  labelId="role-select-label"
                  id="role-select"
                  value={foundUser?.roleId || user.roles[0].azure_role_id}
                  placeholder="Select a role"
                  onChange={(e) =>
                    onChangeRole(user.azure_object_id, e.target.value)
                  }
                  style={{
                    width: 200
                  }}
                >
                  <MenuItem value={null} className="menu-item-select">
                    None
                  </MenuItem>
                  {roles?.map((role) => (
                    <MenuItem
                      value={role.azure_role_id}
                      key={role.azure_role_id}
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

export default UserAssignModal;
