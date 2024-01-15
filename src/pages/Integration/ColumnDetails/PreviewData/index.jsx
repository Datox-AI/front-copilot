import ColumnDetails from "..";
import Table from "../../../../components/Table";

const _columns = [
  {
    name: "Investment Type",
    key: "investment_type"
  },
  {
    name: "Macro Asset Type Code",
    key: "macro_asset_type_code"
  },
  {
    name: "Macro Asset Type",
    key: "macro_asset_type"
  },
  {
    name: "Asset Type Code",
    key: "asset_type_code"
  },
  {
    name: "Asset Type",
    key: "asset_type"
  }
];

const _data = [
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  },
  {
    investment_type: "Corporate Bonds",
    macro_asset_type_code: "Sec",
    macro_asset_type: "Securities",
    asset_type_code: "SEC_CPI",
    asset_type: "Corporate bonds issued by financial institutions"
  }
];

const PreviewData = () => {
  return (
    <ColumnDetails>
      <Table columns={_columns} data={_data} />
    </ColumnDetails>
  );
};

export default PreviewData;
