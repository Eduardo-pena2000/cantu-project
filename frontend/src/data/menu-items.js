import {
    Boxes,
    CalendarClock,
    ClipboardList,
    Handshake,
    Store,
    UserCheck,
    UsersRound,
} from "lucide-react";

export const MENU_ITEMS = {
    primary: [
        { id: 1, label: "Usuarios", url: "/users", icon: UsersRound, description: "Gestión de usuarios del sistema" },
        { id: 2, label: "Tiendas", url: "/stores", icon: Store, description: "Administración de tiendas" },
        { id: 9, label: "Supervisión", url: "/supervisor", icon: UsersRound, description: "Panel de supervisión de encargados" },
    ],
    secondary: [
        { id: 3, label: "Empleados", url: "/store/employees", icon: UsersRound, description: "Gestión de personal de tienda" },
        { id: 4, label: "Áreas", url: "/store/areas", icon: Boxes, description: "Configuración de áreas de trabajo" },
        { id: 5, label: "Turnos", url: "/store/shifts", icon: CalendarClock, description: "Planificación de turnos" },
        { id: 6, label: "Equipos de trabajo", url: "/store/work-teams", icon: Handshake, description: "Organización de equipos" },
        { id: 7, label: "Actividades", url: "/store/activities", icon: ClipboardList, description: "Registro y seguimiento de actividades" },
        { id: 8, label: "Asistencia", url: "/store/attendance", icon: UserCheck, description: "Control de asistencia" },
    ],
    general: [
        { id: 1, label: "Actividades", url: "/store/activities", icon: ClipboardList, description: "Registro y seguimiento de actividades" },
        { id: 2, label: "Asistencia", url: "/store/attendance", icon: UserCheck, description: "Control de asistencia" },
    ],
};
