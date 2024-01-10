import { toast } from "react-hot-toast";

export const isUserAdmin = (role) =>
  role === "8dcc49a6-4ef4-11ee-be56-0242ac120002";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 42,
      height: 42
    },
    children:
      name.split(" ").length > 1
        ? `${name.split(" ")?.[0]?.[0]}${name.split(" ")[1][0]}`
        : name
  };
}

export async function copyNavigator(val) {
  await navigator.clipboard.writeText(val);
  toast.success("Copied!");
}

const key = "itemUrl";

export const arrayUniqueByKey = (array, _key = key) => [
  ...new Map(array.map((item) => [item[_key], item])).values()
];

export const makeLowerCase = (data) => {
  const lowerCase = (str) => str[0].toLowerCase() + str.slice(1);
  return data.map((obj) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [lowerCase(k), v]))
  );
};

export const focusOnInput = () => {
  document.querySelector("#input-message")?.focus();
};
