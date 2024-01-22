import styles from "./style.module.scss";

import { Button, Typography } from "@mui/material";
import { ReactComponent as EditI } from "../../assets/icons/edit.svg";
import { ReactComponent as CloseI } from "../../assets/icons/close.svg";
import toast from "react-hot-toast";

const CodeTypes = ({
  type,
  value,
  label,
  color,
  isEdit,
  toggleInput,
  onChangeInput
}) => {
  if (type === "key")
    return (
      <>
        <Typography fontWeight={500} fontSize="18px" color="#0177FB">
          {label}&nbsp;
        </Typography>
      </>
    );

  if (type === "input")
    return !isEdit ? (
      <>
        <Typography
          fontSize="18px"
          fontWeight={500}
          color="#FF3232"
          onClick={toggleInput}
        >
          <i>
            [{value || label} <EditI className={styles.editIcon} />] &nbsp;
          </i>
        </Typography>
      </>
    ) : (
      <div className={styles.input}>
        <input
          value={value}
          onChange={({ target: { value } }) =>
            onChangeInput(value.toUpperCase())
          }
        />
        <CloseI onClick={toggleInput} />
      </div>
    );

  return (
    <>
      <Typography fontSize="18px" fontWeight={500} color={color || "#242424"}>
        {label}&nbsp;
      </Typography>
    </>
  );
};

export default function CodeGenerator({
  keywords,
  toggleInput,
  onChangeInput
}) {
  const onCopy = async () => {
    const copyLabels = keywords
      .map((keyw) => keyw.value || keyw.label)
      .join(" ");
    await window.navigator.clipboard.writeText(copyLabels);
    toast.success("Copied!");
  };

  return (
    <div className={styles.codeGenerator}>
      <div className={styles.content}>
        {keywords.map((keyword, k) => (
          <>
            <CodeTypes
              {...keyword}
              toggleInput={() => toggleInput(k)}
              onChangeInput={(val) => onChangeInput(k, val)}
              key={k}
            />
            {keyword.br && (
              <div
                style={{
                  display: "block",
                  width: "100%"
                }}
              />
            )}
          </>
        ))}
      </div>
      <div className={styles.action}>
        <Button variant="contained" onClick={onCopy}>
          Copy
        </Button>
      </div>
    </div>
  );
}
