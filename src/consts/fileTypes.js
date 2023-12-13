import word from "../assets/icons/word.png";
import pdf from "../assets/icons/pdf.png";
import excel from "../assets/icons/excel.png";

export const fileTypes = {
  word: word,
  pdf: pdf,
  excel: excel,
  "application/pdf": pdf,
  "application/docx": word,
  "application/doc": word,
  "application/word": word,
  "application/xlsx": excel,
  "application/excel": excel
};
