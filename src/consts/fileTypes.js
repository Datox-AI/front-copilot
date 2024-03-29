import word from "../assets/icons/word.png";
import pdf from "../assets/icons/pdf.png";
import excel from "../assets/icons/excel.png";
import file from "../assets/icons/file.png";

export const fileTypes = {
  word: word,
  WORD: word,
  pdf: pdf,
  PDF: pdf,
  excel: excel,
  EXCEL: excel,
  xlsx: excel,
  xlsx: excel,
  "application/pdf": pdf,
  "application/docx": word,
  "application/doc": word,
  "application/word": word,
  "application/xlsx": excel,
  "application/excel": excel,
  "text/csv": excel,
  other: file,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": excel
};
