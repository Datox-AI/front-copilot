import classNames from "classnames";
import styles from "./style.module.scss";
import { useMemo } from "react";
import { Box, Skeleton } from "@mui/material";

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

const MessageItemSkeleton = ({ isBot, isAssistantConfig }) => {
  const width = useMemo(() => {
    if (!isBot) return generateRandom(250, 700);

    return generateRandom(250, 700);
  }, [isBot]);

  const height = useMemo(() => {
    if (width > 400) {
      if (!isBot) return generateRandom(50, 100);
      else return generateRandom(70, 200);
    }

    return generateRandom(30, 70);
  }, [isBot, width]);

  return (
    <div
      className={classNames(styles.container, {
        [styles.isBot]: isBot
      })}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        gap="8px"
        flexDirection={isBot ? "row" : "row-reverse"}
        width="95%"
      >
        <div className={styles.author}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={isAssistantConfig ? 26 : 42}
            height={isAssistantConfig ? 26 : 42}
          />
        </div>
        <div className={styles.content}>
          <Skeleton
            width={width}
            variant="rectangular"
            height={height}
            style={{
              "border-radius": isBot
                ? "12px 12px 12px 0px"
                : "12px 12px 0px 12px"
            }}
          >
            <p className={styles.message}></p>
          </Skeleton>
          <span className={styles.time}>
            <Skeleton width={50} height={24} />
          </span>
        </div>
      </Box>
    </div>
  );
};

export default MessageItemSkeleton;
