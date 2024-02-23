import { Outlet, useNavigate, useParams } from "react-router-dom";
import styles from "./style.module.scss";
import { Avatar, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useMemo, useState } from "react";
import useUsersAPI from "../../hooks/api/useUsersAPI";
import { stringAvatar } from "../../utils";
import classNames from "classnames";

const getFullname = (firstName, lastName) => [firstName, lastName].join(" ");

const Audit = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data } = useUsersAPI("Active");

  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    return data?.filter((_user) =>
      [_user.first_name, _user.last_name]
        ?.join(" ")
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className={styles.auditContainer}>
      <div className={styles.user_list}>
        <header>
          <Box display="flex" alignItems="center" gap="10px">
            <h2>Audit</h2>
          </Box>
        </header>

        <section className={styles.searchSection}>
          <label>
            <Search />
            <input
              placeholder="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <TuneRoundedIcon /> */}
          </label>
        </section>
        <ul>
          {users?.map((user) => (
            <li
              key={user.azure_object_id}
              onClick={() => navigate(user.id)}
              className={classNames({
                [styles.active]: userId === user.id
              })}
            >
              <Avatar
                {...stringAvatar(getFullname(user.first_name, user.last_name))}
              />
              <Box display="flex" flexDirection="column">
                <p>{getFullname(user.first_name, user.last_name)}</p>
                <span>{user.roles[0].name}</span>
              </Box>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default Audit;
