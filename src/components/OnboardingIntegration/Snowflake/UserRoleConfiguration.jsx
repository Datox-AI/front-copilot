import CodeGenerator from "../../CodeGenerator";

export default function UserRoleConfiguration({
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
