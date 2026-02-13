function fixedTwoDigitsNumber(time) {
  return `${time}`.padStart(2, 0);
}

export function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);

  const hour12 = hours % 12 === 0 ? 12 : fixedTwoDigitsNumber(hours % 12);

  return `${hour12}:${fixedTwoDigitsNumber(minutes)} ${hours >= 12 ? "p.m." : "a.m."}`;
}
