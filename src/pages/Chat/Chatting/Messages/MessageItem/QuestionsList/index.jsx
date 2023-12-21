import styles from "../style.module.scss";

const QuestionsList = ({ questions, onSelectQuestion }) => {
  return (
    <ul className={styles.questions}>
      {questions.map((question, q) => (
        <li key={q} onClick={() => onSelectQuestion(question)}>
          {question}
        </li>
      ))}
    </ul>
  );
};

export default QuestionsList;
