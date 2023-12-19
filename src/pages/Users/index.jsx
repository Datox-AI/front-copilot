import { Box, Button, IconButton } from "@mui/material";
import useUsersAPI from "../../hooks/api/useUsersAPI";
import UsersTable from "./UsersTable";
import styles from "./style.module.scss";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import UserAddModal from "./UserAddModal";

const Users = () => {
  const { data, isLoading, refetch } = useUsersAPI("Active");

  const [isAddOpen, setIsAddOpen] = useState(false);

  const toggleAddUserModal = () => setIsAddOpen((prev) => !prev);

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
        <UsersTable users={data?.lists} isLoading={isLoading} />
      </section>
      <UserAddModal
        refetch={refetch}
        isOpen={isAddOpen}
        close={toggleAddUserModal}
      />
    </>
  );
};

export default Users;
