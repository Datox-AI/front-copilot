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

const UserEditModal = ({ isOpen, close, refetch, selectedUser }) => {
  const { updateMutation, refetch: refetchInactiveUsers } = useUsersAPI("none");
  const { data: roles } = useRolesAPI();

  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (!roles || !selectedUser) return;

    setSelectedRole(selectedUser?.roles?.[0].id);
  }, [roles, selectedUser]);

  const handleSave = useCallback(async () => {
    updateMutation.mutate(
      {
        roleIds: !!selectedRole ? [selectedRole] : [],
        userId: selectedUser?.adId
      },
      {
        onSuccess: () => {
          refetch();
          refetchInactiveUsers();
          close();
          toast.success("User is successfuly updated");
        },
        onError: (err) => {
          toast.error(err.data.title);
        }
      }
    );
  }, [selectedRole, selectedUser]);

  return (
    <Popup isOpen={isOpen} title="Edit User" close={close}>
      <div className={styles.addModal}>
        <ul>
          {!!selectedUser && (
            <li className={!!selectedUser && styles.selected}>
              <Box display="flex" alignItems="center" width="100%" gap="10px">
                <Avatar
                  {...stringAvatar(selectedUser.displayName)}
                  sx={{
                    ...stringAvatar(selectedUser.displayName).sx,
                    height: 32,
                    width: 32,
                    fontSize: 14
                  }}
                />{" "}
                {selectedUser.displayName}
              </Box>

              <Select
                key={selectedUser.adId}
                labelId="role-select-label"
                id="role-select"
                value={selectedRole}
                placeholder="Select a role"
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: 200
                }}
              >
                <MenuItem value={null} className="menu-item-select">
                  None
                </MenuItem>
                {roles?.lists?.map((role) => (
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
          )}
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

export default UserEditModal;
