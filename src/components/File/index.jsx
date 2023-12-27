import styles from "./style.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { Box, LinearProgress } from "@mui/material";
import { fileTypes } from "../../consts/fileTypes";
import { NumericFormat } from "react-number-format";

const File = ({ name, type = "excel", uploadedSize, size, onCancel }) => {
  return (
    <div className={styles.file}>
      <Box width="100%" display="flex" gap="4px">
        <img
          src={fileTypes[type] || fileTypes.other}
          alt="file"
          width={24}
          height={24}
        />
        <div className={styles.content}>
          <Box display="flex" width="100%" justifyContent="space-between">
            <p className={styles.name}>{name}</p>

            {onCancel && (
              <CloseRoundedIcon onClick={onCancel} className={styles.close} />
            )}
            <Box display="flex" className={styles.sizes}>
              {uploadedSize !== size && (
                <span className={styles.size}>
                  <NumericFormat
                    value={Math.floor(Number(uploadedSize / 1024))}
                    displayType="text"
                    decimalScale={0}
                  />
                  &nbsp; / &nbsp;
                </span>
              )}
              {size && (
                <span className={styles.size}>
                  <NumericFormat
                    value={Number(size / 1024)}
                    displayType="text"
                    decimalScale={0}
                  />
                  &nbsp;KB
                </span>
              )}
            </Box>
          </Box>
          {uploadedSize > 0 && uploadedSize < size && (
            <Box width="100%" justifyContent="flex-start">
              <LinearProgress
                variant="determinate"
                style={{
                  height: "4px"
                }}
                value={(uploadedSize * 100) / size}
              />
            </Box>
          )}
        </div>
      </Box>
    </div>
  );
};

export default File;
