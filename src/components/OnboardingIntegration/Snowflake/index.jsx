import { useState } from "react";
import OnboardingStepContainer from "..";

const steps = [0, 1, 2, 3, 4, 5];

export default function OnboardingSnowflake() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <OnboardingStepContainer
      title="Entering Snowflake Account Identifier"
      description={`You can navigate to the bottom left of your screen, clock on the drop-down, hover over to your account name and select the copy option`}
      steps={steps}
      activeStep={activeStep}
      onNext={() => setActiveStep((prev) => (prev !== 5 ? prev + 1 : prev))}
      onPrevious={() => setActiveStep((prev) => (prev !== 0 ? prev - 1 : prev))}
    >
      <h1>hey</h1>
    </OnboardingStepContainer>
  );
}
