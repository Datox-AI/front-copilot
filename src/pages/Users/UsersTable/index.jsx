import styles from "../style.module.scss";
import { ReactComponent as CheckboxIcon } from "../../../assets/icons/checkbox.svg";
import { ReactComponent as CheckedIcon } from "../../../assets/icons/checked.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { stringAvatar } from "../../../utils";
import classNames from "classnames";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import DeletePopover from "../../../components/DeletePopover";

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

  toggleUser,
  data,
  isSelected,
  onDeleteSubmit
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom", "right"]}
        content={
          <DeletePopover
            onCancel={() => setIsPopoverOpen(false)}
            onSubmit={() => {
              onDeleteSubmit();
              setIsPopoverOpen(false);
            }}
          />
        }
      >
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
            <button onClick={() => setIsPopoverOpen((prev) => !prev)}>
              <TrashIcon />
            </button>
          </Box>
        </td>
      </Popover>
    </tr>
  );
};

const UsersTable = ({
  users,
  isLoading,
  selectedUsers,
  toggleEditModal,
  toggleDeleteModal,
  toggleSelectedUsers,
  onDeleteSubmit
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
                fullname={[user.first_name, user.last_name].join(" ")}
                email={user?.status}
                department="Engineering"
                title="-"
                onSelect={toggleEditModal}
                data={user}
                isSelected={selectedUsers.includes(user.adId)}
                toggleUser={() => toggleSelectedUsers(user?.adId)}
                onDeleteSubmit={() => onDeleteSubmit(user)}
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
