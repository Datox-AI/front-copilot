import { Button, Step, StepLabel, Stepper } from "@mui/material";
import styles from "./style.module.scss";

export default function OnboardingStepContainer({
  children,
  title,
  description,
  isPreviousBtnDisabled,
  isNextBtnDisabled,
  steps,
  activeStep,
  onNext,
  onPrevious
}) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.steps}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className={styles.body}>{children}</div>
          <div className={styles.footer}>
            <Button
              variant="outlined"
              disabled={isPreviousBtnDisabled}
              onClick={onPrevious}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={isNextBtnDisabled}
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
