export function notificationDto({ id, title, description, type, is_read, date, metadata }) {
  return {
    id,
    title,
    description,
    type,
    isRead: is_read,
    date,
    metadata: metadata ? metadata : null,
  };
}
