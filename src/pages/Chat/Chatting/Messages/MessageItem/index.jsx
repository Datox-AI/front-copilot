import { Avatar } from "@mui/material";
import styles from "./style.module.scss";
import { stringAvatar } from "../../../../../utils";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

const MessageItem = ({
  author_fullname,
  message,
  time,
  isBot,
  questions,
  onSelectQuestion,
  isTyping
}) => {
  return (
    <div
      className={classNames(styles.container, {
        [styles.isBot]: isBot
      })}
    >
      <div className={styles.author}>
        {<Avatar {...stringAvatar(isBot ? "Datox GPT" : author_fullname)} />}
      </div>
      <div className={styles.content}>
        <p className={styles.message}>
          {message}
          {questions && questions.length > 0 && (
            <ul>
              {questions.map((question, q) => (
                <li key={q} onClick={() => onSelectQuestion(question)}>
                  {question}
                </li>
              ))}
            </ul>
          )}
        </p>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
};

export default MessageItem;
