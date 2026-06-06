import { auth } from "@/auth";

export async function fetchApi(url, options = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

  const defaultHeaders = {};

  // Try to get session to attach token
  try {
    const session = await auth();
    if (session?.accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${session.accessToken}`;
    }
  } catch (error) {
    // auth() might fail if called from client side in some contexts, 
    // or if no request context is available.
    console.error("Error getting session for fetchApi:", error);
  }

  // Merge headers, prioritizing options.headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  try {
    return await fetch(apiUrl + url, {
      ...options,
      headers,
    });
  } catch (error) {
    // If backend is offline, prevent frontend from crashing by returning mock responses
    if (error.message?.includes("fetch failed") || error.code === "ECONNREFUSED") {
      console.warn("Backend is offline. Mocking response for:", url);
      
      if (url.includes('/shift/active')) {
        return { ok: false, status: 404, json: async () => ({}) };
      }
      
      let mockBody = { data: [] }; // Default body structure
      
      if (url.includes('/user/activities')) {
        mockBody = []; 
      } else if (url.includes('/user')) {
        mockBody = { 
          data: [
            { id: 1, names: "Juan", last_names: "Pérez", email: "juan@cantu.com", username: "juanp", is_active: true, roles: [{id: 1, name: "Empleado"}], store: { id: 1, name: "El Ofertón (Matriz)" } },
            { id: 2, names: "Ana", last_names: "Gómez", email: "ana@cantu.com", username: "anag", is_active: true, roles: [{id: 2, name: "Cajera"}], store: { id: 1, name: "El Ofertón (Matriz)" } },
            { id: 3, names: "Carlos", last_names: "López", email: "carlos@cantu.com", username: "carlosl", is_active: true, roles: [{id: 3, name: "Vendedor"}], store: { id: 2, name: "El Ofertón (Norte)" } },
            { id: 4, names: "María", last_names: "Torres", email: "maria@cantu.com", username: "mariat", is_active: true, roles: [{id: 2, name: "Cajera"}], store: { id: 2, name: "El Ofertón (Norte)" } },
            { id: 5, names: "José", last_names: "Martínez", email: "jose@cantu.com", username: "josem", is_active: true, roles: [{id: 4, name: "Bodeguero"}], store: { id: 3, name: "El Ofertón (Sur)" } },
          ], 
          last_page: 1, total_records: 5, current_page: 1, has_more_pages: false 
        };
      } else if (url.includes('/store')) {
        mockBody = { 
          data: [
            { id: 1, name: "El Ofertón (Matriz)", code: "MAT01", address: "Av. Benito Juárez 123", municipality: "Monterrey", is_active: true },
            { id: 2, name: "El Ofertón (Norte)", code: "NOR02", address: "Av. Universidad 456", municipality: "San Nicolás", is_active: true },
            { id: 3, name: "El Ofertón (Sur)", code: "SUR03", address: "Av. Eugenio Garza Sada 789", municipality: "Monterrey", is_active: true },
          ], 
          last_page: 1, total_records: 3, current_page: 1, has_more_pages: false 
        };
      }
      
      return {
        ok: true,
        status: 200,
        json: async () => ({ body: mockBody })
      };
    }
    throw error;
  }
}
