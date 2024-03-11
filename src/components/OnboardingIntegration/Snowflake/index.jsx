import OnboardingStepContainer from "..";
import styles from "../style.module.scss";
import PopoverMenu from "../../PopoverMenu";

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { _content, steps } from "./data";
import { useDispatch } from "react-redux";
import { toggleSkipOnboarding } from "../../../redux/integrations/integrationsSlice";
import { ReactComponent as SurveyI } from "../../../assets/icons/survey.svg";
import { ReactComponent as WarningI } from "../../../assets/icons/warning.svg";
import { Close } from "@mui/icons-material";
import { useClickAway } from "@uidotdev/usehooks";

export default function OnboardingSnowflake() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [content, setContent] = useState([..._content]);
  const [activeStep, setActiveStep] = useState(0);
  const [accountIdentifier, setAccountIdentifier] = useState();
  const [oauthTokenEndpoint, setOauthTokenEndpoint] = useState();
  const [clientSecret, setClientSecret] = useState();
  const [clientId, setClienId] = useState();
  const [showDocumentation, setShowDocumentation] = useState(false);

  const ref = useClickAway(() => {
    setShowDocumentation(false);
  });

  const activeContent = useMemo(
    () => content[activeStep],
    [activeStep, content]
  );

  const setKeywords = (val) => {
    setContent((prev) =>
      prev.map((con, c) => (c === activeStep ? { ...con, ...val } : con))
    );
  };

  const isPrevBtnDisabled = useMemo(() => {
    switch (activeStep) {
      case 0:
        return true;

      default:
        return false;
    }
  }, [activeStep]);

  const isNextBtnDisabled = useMemo(() => {
    switch (activeStep) {
      // case 0:
      //   const findVals = activeContent.keywords.filter((key) => key.value);
      //   return findVals.length === 2;
      case 0:
        return !!accountIdentifier;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return !!oauthTokenEndpoint;
      case 4:
        return !!clientId && !!clientSecret;
      default:
        return false;
    }
  }, [
    activeStep,
    activeContent,
    accountIdentifier,
    oauthTokenEndpoint,
    clientId,
    clientSecret
  ]);

  const toggleInput = useCallback(
    (index) => {
      setKeywords({
        keywords: activeContent.keywords?.map((keyw, idx) =>
          idx === index ? { ...keyw, isEdit: !keyw.isEdit } : keyw
        )
      });
    },
    [activeContent]
  );

  const onChangeInput = useCallback(
    (index, val) => {
      setKeywords({
        keywords: activeContent.keywords?.map((keyw, idx) =>
          idx === index ? { ...keyw, value: val } : keyw
        )
      });
    },
    [activeContent]
  );

  const onClickNext = useCallback(() => {
    if (activeStep !== 4)
      return setActiveStep((prev) => (prev !== 5 ? prev + 1 : prev));

    dispatch(toggleSkipOnboarding());

    navigate("/configs/snowflake/create", {
      state: {
        clientId,
        clientSecret,
        oauthTokenEndpoint,
        accountIdentifier
      }
    });
  }, [
    activeStep,
    clientId,
    clientSecret,
    oauthTokenEndpoint,
    accountIdentifier
  ]);

  const onClickPrev = useCallback(
    () => setActiveStep((prev) => (prev !== 0 ? prev - 1 : prev)),
    []
  );

  return (
    <>
      <OnboardingStepContainer
        title={activeContent.title}
        description={activeContent.description}
        steps={steps}
        activeStep={activeStep}
        isNextBtnDisabled={!isNextBtnDisabled}
        isPreviousBtnDisabled={isPrevBtnDisabled}
        onNext={onClickNext}
        onPrevious={onClickPrev}
        extra={activeContent.extra ? <activeContent.extra /> : <></>}
      >
        <activeContent.component
          clientId={clientId}
          clientSecret={clientSecret}
          accountIdentifier={accountIdentifier}
          oauthTokenEndpoint={oauthTokenEndpoint}
          keywords={activeContent?.keywords || []}
          setOauthClientId={setClienId}
          toggleInput={toggleInput}
          onChangeInput={onChangeInput}
          setOauthClientSecret={setClientSecret}
          setAccountIdentifier={setAccountIdentifier}
          setOauthTokenEndpoint={setOauthTokenEndpoint}
        />
      </OnboardingStepContainer>

      <div className={styles.survey}>
        <PopoverMenu
          mainIcon={<SurveyI />}
          position="top"
          data={[
            {
              title: "Documentation",
              icon: WarningI,
              onClick: () => setShowDocumentation(true)
            }
          ]}
        />
      </div>

      {showDocumentation && (
        <div className={styles.documentation} ref={ref}>
          <div className={styles.content}>
            <Close onClick={() => setShowDocumentation(false)} />
            <div
              style={{
                paddingBottom: "16px",
                borderBottom: "1px solid #E2E2E2"
              }}
            >
              <h4>Welcome to Datox – Snowflake Integration</h4>
              <p>
                Datox brings a new dimension to compliance reporting by
                seamlessly integrating with your Snowflake data warehouse. Our
                AI-driven platform is tailored for financial compliance,
                ensuring that your data from Snowflake is transformed into
                precise and comprehensive reports. By leveraging the power of AI
                technology, Datox transforms complex Snowflake data into
                structured, regulatory-compliant reports, ready for submission
                to authorities like the FCA and SEC. Simplify your compliance
                processes and focus on strategic decision-making with Datox
              </p>
            </div>

            <div>
              <h4>Why Integrate Datox with Snowflake?</h4>
              <p>
                Automated Compliance Reporting: Datox automates the reporting
                process, turning Snowflake data into error-free compliance
                reports, thereby reducing manual efforts and enhancing accuracy.
                Adherence to Standards: We keep abreast of the latest FCA and
                SEC regulations, ensuring that your reports are always compliant
                with current financial standards. Advanced Analytics: Utilize
                AI-driven insights for strategic decision-making, offering
                predictive analytics to enhance business foresight and
                competitive advantage.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
