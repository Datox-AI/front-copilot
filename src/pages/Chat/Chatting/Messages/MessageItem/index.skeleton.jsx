import { Avatar, Skeleton } from "@mui/material";
import styles from "./style.module.scss";
import { stringAvatar } from "../../../../../utils";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

function generateRandom(min, max) {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
}

const MessageItemSkeleton = ({ isBot }) => {
  const width = !isBot ? generateRandom(250, 700) : generateRandom(250, 700);
  const height =
    width > 400
      ? !isBot
        ? generateRandom(50, 150)
        : generateRandom(150, 350)
      : generateRandom(30, 70);

  return (
    <div
      className={classNames(styles.container, {
        [styles.isBot]: isBot
      })}
    >
      <div className={styles.author}>
        <Skeleton animation="wave" variant="circular" width={42} height={42} />
      </div>
      <div className={styles.content}>
        <Skeleton
          width={width}
          variant="rectangular"
          height={height}
          style={{
            "border-radius": isBot ? "12px 12px 12px 0px" : "12px 12px 0px 12px"
          }}
        >
          <p className={styles.message}></p>
        </Skeleton>
        <span className={styles.time}>
          <Skeleton width={50} height={24} />
        </span>
      </div>
    </div>
  );
};

export default MessageItemSkeleton;
