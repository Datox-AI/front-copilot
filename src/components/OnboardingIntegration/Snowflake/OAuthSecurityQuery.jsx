import CodeGenerator from "../../CodeGenerator";

export default function OAuthSecurityQuery({
  keywords,
  toggleInput,
  onChangeInput
}) {
  return (
    <CodeGenerator
      keywords={keywords || []}
      toggleInput={toggleInput}
      onChangeInput={onChangeInput}
    />
  );
}
