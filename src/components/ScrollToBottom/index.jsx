import React, { useState, useEffect } from "react";

import styles from "./style.module.scss"; // CSS file for styling the button

import SouthRoundedIcon from "@mui/icons-material/SouthRounded";

export default function ScrollToBottom({ itemRef }) {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 400px
  const toggleVisibility = () => {
    const messagesList = document.getElementById("messages-list");
    if (messagesList) {
      const { scrollTop, scrollHeight, clientHeight } = messagesList;

      if (scrollHeight - scrollTop - clientHeight > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    const point = document.getElementById("messages-list-ref");
    point.scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const messagesList = document.getElementById("messages-list");
    messagesList.addEventListener("scroll", toggleVisibility);
    return () => {
      messagesList.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.scrollToTop}>
      {isVisible && (
        <button onClick={scrollToTop} title="Scroll to top">
          <SouthRoundedIcon size={24} />
        </button>
      )}
    </div>
  );
}
