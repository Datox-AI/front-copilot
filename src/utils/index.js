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
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
  };
}

export function copyNavigator(val, justValue = false) {
  if ("clipboard" in navigator) {
    if (justValue) navigator.clipboard.writeText(val);
    // else navigator.clipboard.writeText("https://form.tripoasia.com/" + val);

    toast.success("Copied!");
  } else {
    const textArea = document.createElement("textarea");

    if (justValue) textArea.value = val;
    // else textArea.value = "https://form.tripoasia.com/" + val;

    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const success = document.execCommand("copy");
      if (success) toast.success("Copied!");
    } catch (err) {
      console.error(err.name, err.message);
    }
    document.body.removeChild(textArea);
  }
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
  document.querySelector("#input-message").focus();
};
