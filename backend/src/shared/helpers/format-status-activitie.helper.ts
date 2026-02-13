export const normalizeCompletationStatus = (status?: string): { [key: string]: boolean | undefined } => {
  let is_completed = undefined;
  let is_late = undefined;

  switch (status) {
    case "completed":
      is_completed = true;

      break;
    case "pending":
      is_completed = false;

      break;

    case "delayed":
      is_completed = true;
      is_late = true;

      break;

    default:
      is_completed = undefined;
      is_late = undefined;
      break;
  }

  return { is_completed, is_late };
};
