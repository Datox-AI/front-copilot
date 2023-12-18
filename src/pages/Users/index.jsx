import useUsersAPI from "../../hooks/api/useUsersAPI";
import UsersTable from "./UsersTable";
import styles from "./style.module.scss";

const Users = () => {
  const { data } = useUsersAPI();

  return (
    <section className={styles.container}>
      <h1>Users</h1>
      <UsersTable users={data?.lists} />
    </section>
  );
};

export default Users;
