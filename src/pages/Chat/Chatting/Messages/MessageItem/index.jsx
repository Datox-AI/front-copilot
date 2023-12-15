import styles from "./style.module.scss";
import classNames from "classnames";
import Markdown from "react-markdown";
import CopyAllRoundedIcon from "@mui/icons-material/CopyAllRounded";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import {
  dark,
  darcula,
  duotoneDark
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../../../utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useState } from "react";

const MessageItem = ({
  author_fullname,
  message,
  time,
  isBot,
  questions,
  onSelectQuestion
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = async (txt) => {
    await navigator.clipboard.writeText(txt);
    setIsCopied(true);
  };

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
          <Markdown
            children={message}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div className={styles.codeContainer}>
                    <Tooltip title={isCopied ? "Copied!" : "Copy"}>
                      <IconButton
                        className={styles.copyBtn}
                        onClick={() =>
                          handleCopyCode(String(children).replace(/\n$/, ""))
                        }
                      >
                        <CopyAllRoundedIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </Tooltip>

                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      style={darcula}
                    />
                  </div>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              }
            }}
          />
          {questions && questions.length > 0 && (
            <ul className={styles.questions}>
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
