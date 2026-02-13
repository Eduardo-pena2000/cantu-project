export function formatDate({ date, locale = "es", options = { dateStyle: "full" } }) {
  const formater = new Intl.DateTimeFormat(locale, options);

  return formater.format(date);
}

export function getDateFromDateInput(strDate) {
  const [year, month, day] = strDate.split("-").map(Number);

  const date = new Date(year, month - 1, day); // Month is indexed from 0

  return date;
}

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}
