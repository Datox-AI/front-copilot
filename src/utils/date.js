import moment from "moment";

export const calculateAge = (_dob) => {
  const dob = new Date(_dob);
  //calculate month difference from current date in time
  let month_diff = Date.now() - dob.getTime();

  //convert the calculated difference in date format
  let age_dt = new Date(month_diff);

  //extract year from date
  let year = age_dt.getUTCFullYear();

  //now calculate the age of the user
  let age = Math.abs(year - 1970);

  return age;
};

export const getYesterdayDate = {
  day: moment().subtract(1, "days").day() - 3,
  month: moment().subtract(1, "days").month() + 1,
  year: moment().subtract(1, "days").year()
};
