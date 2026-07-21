import { fetchApi } from "@/lib";

export async function getAssistanceHistory({ date, store_id, name, area_id, role_id, page = 1, limit = 50 }) {
  const queryParams = new URLSearchParams();
  if (date) queryParams.append("date", date);
  if (store_id) queryParams.append("store_id", store_id);
  if (name) queryParams.append("name", name);
  if (area_id) queryParams.append("area_id", area_id);
  if (role_id) queryParams.append("role_id", role_id);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const res = await fetchApi(`/assistance/history?${queryParams.toString()}`);

  if (!res.ok) {
    throw new Error("No se pudo obtener el historial de asistencia.");
  }

  const json = await res.json();
  return json.body;
}
