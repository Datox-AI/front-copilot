import styles from "../style.module.scss";
import { ReactComponent as CheckboxIcon } from "../../../assets/icons/checkbox.svg";
import { ReactComponent as CheckedIcon } from "../../../assets/icons/checked.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { stringAvatar } from "../../../utils";
import classNames from "classnames";

const UserItemSkeleton = () => {
  return (
    <tr className={styles.userItem}>
      <td>
        <Box display="flex" alignItems="center" gap="10px">
          <CheckboxIcon />
          <Skeleton variant="circular" width={42} height={42} />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h3"
              fontSize="16px"
              fontWeight={500}
              color="#616161"
            >
              <Skeleton width={250} height={16} variant="rectangular" />
            </Typography>
            <Typography
              variant="h3"
              fontSize="16px"
              fontWeight={400}
              color="#c4c4c4"
              marginTop="6px"
            >
              <Skeleton width={200} height={16} variant="rectangular" />
            </Typography>
          </Box>
        </Box>
      </td>
      <td>
        <Skeleton width={250} height={16} variant="rectangular" />
      </td>
      <td>
        <Skeleton width={100} height={16} variant="rectangular" />
      </td>
      <td>
        <Skeleton width={100} height={16} variant="rectangular" />
      </td>
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

const UserItem = ({
  fullname,
  email = "someone@datox.ai",
  department,
  title,
  role,
  onSelect,
  onDelete,
  toggleUser,
  data,
  isSelected
}) => {
  return (
    <tr
      className={classNames(styles.userItem, {
        [styles.isSelected]: isSelected
      })}
    >
      <td>
        <Box display="flex" alignItems="center" gap="10px">
          {isSelected ? (
            <CheckedIcon onClick={toggleUser} />
          ) : (
            <CheckboxIcon onClick={toggleUser} />
          )}
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
          <button onClick={() => onSelect(data)}>
            <EditIcon />
          </button>
          <button onClick={() => onDelete(data)}>
            <TrashIcon />
          </button>
        </Box>
      </td>
    </tr>
  );
};

const UsersTable = ({
  users,
  isLoading,
  selectedUsers,
  toggleEditModal,
  toggleDeleteModal,
  toggleSelectedUsers
}) => {
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
        {isLoading
          ? Array(10)
              .fill(1)
              .map(() => <UserItemSkeleton />)
          : users?.map((user, u) => (
              <UserItem
                fullname={user?.displayName}
                email={user?.status}
                department="Engineering"
                title="-"
                onSelect={toggleEditModal}
                onDelete={toggleDeleteModal}
                data={user}
                isSelected={selectedUsers.includes(user.adId)}
                toggleUser={() => toggleSelectedUsers(user?.adId)}
                role={
                  user?.roles?.length > 1 || user?.roles?.[0]?.name === "Admin"
                    ? "Admin"
                    : user?.roles?.length === 0
                    ? "Imposter"
                    : "User"
                }
              />
            ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
