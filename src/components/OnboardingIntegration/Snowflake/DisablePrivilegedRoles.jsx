import CodeGenerator from "../../CodeGenerator";

export default function DisablePriviligedRoles({
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
