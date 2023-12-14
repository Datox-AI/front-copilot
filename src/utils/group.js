import moment from "moment";

const differenceInDays = (date1, date2) => {
  return moment(date2).diff(moment(date1), "days");
};

export const groupItemsByDate = (data) => {
  if (!data || data.length === 0) return [];

  const today = moment(new Date()).format("DD MMM yyyy");
  const yesterday = moment(new Date()).add(-1, "day").format("DD MMM yyyy");

  // Group data by date
  const groups = data.reduce((groups, message) => {
    const date = message.created.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const groupArrays = Object.keys(groups).map((date) => {
    const _date = moment(date).format("DD MMM yyyy");
    const diff = differenceInDays(_date, today);

    const lastMutatedDate =
      _date === today
        ? "Today"
        : _date === yesterday
        ? "Yesterday"
        : diff < 7
        ? moment(date).format("dddd")
        : _date;

    return {
      date: lastMutatedDate,
      items: groups[date]
    };
  });

  return groupArrays;
};
