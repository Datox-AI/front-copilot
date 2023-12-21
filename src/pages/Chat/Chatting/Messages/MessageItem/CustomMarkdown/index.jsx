import styles from "../style.module.scss";
import Markdown from "react-markdown";
import CopyAllRoundedIcon from "@mui/icons-material/CopyAllRounded";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CustomMarkdown = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const interval = setInterval(() => setIsCopied(false), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isCopied]);

  const handleCopyCode = async (txt) => {
    await navigator.clipboard.writeText(txt);
    setIsCopied(true);
  };

  return (
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
  );
};

export default CustomMarkdown;
