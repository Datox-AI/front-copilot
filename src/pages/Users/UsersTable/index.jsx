import styles from "../style.module.scss";
import { ReactComponent as CheckboxIcon } from "../../../assets/icons/checkbox.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";
import { Avatar, Box, Typography } from "@mui/material";
import { stringAvatar } from "../../../utils";

const _data = [
  {
    fullname: "Otabek Nosirov",
    department: "IT",
    title: "Senior Frontend Developer",
    role: "Admin"
  },
  {
    fullname: "Ivan Ivanov",
    department: "Marketing",
    title: "Lead Marketolog",
    role: "User"
  },
  {
    fullname: "Kungfu Panda",
    department: "IT",
    title: "Frontend Developer",
    role: "User"
  },
  {
    fullname: "Jacky Chan",
    department: "Data Science",
    title: "Senior Data Scientist",
    role: "Admin"
  }
];

const UserItem = ({
  fullname,
  email = "someone@datox.ai",
  department,
  title,
  role
}) => {
  return (
    <tr className={styles.userItem}>
      <td>
        <Box display="flex" alignItems="center" gap="10px">
          <CheckboxIcon />
          <Avatar {...stringAvatar(fullname)} />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h3"
              fontSize="16px"
              fontWeight={500}
              color="#616161"
            >
              {fullname}
            </Typography>
            <Typography
              variant="h3"
              fontSize="16px"
              fontWeight={400}
              color="#c4c4c4"
              marginTop="6px"
            >
              {email}
            </Typography>
          </Box>
        </Box>
      </td>
      <td>{department}</td>
      <td>{title}</td>
      <td>{role}</td>
      <td>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="10px"
        >
          <button>
            <EditIcon />
          </button>
          <button>
            <TrashIcon />
          </button>
        </Box>
      </td>
    </tr>
  );
};

const UsersTable = ({ users }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td>Full name</td>
          <td>Department</td>
          <td>Title</td>
          <td>Role</td>
          <td
            style={{
              textAlign: "left"
            }}
          >
            Edit
          </td>
        </tr>
      </thead>
      <tbody>
        {users?.map((user, u) => (
          <UserItem
            fullname={user?.displayName}
            email={user?.status}
            department="-"
            title="-"
            role={user?.roles?.length > 1 ? "Admin" : "User"}
          />
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
