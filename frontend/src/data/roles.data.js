import { ROLES } from "./constants";

export const roles = [
  {
    value: String(ROLES.ADMIN.id),
    label: ROLES.ADMIN.name,
  },
  {
    value: String(ROLES.GENERAL_MANAGER.id),
    label: ROLES.GENERAL_MANAGER.name,
  },
  {
    value: String(ROLES.STORE_MANAGER.id),
    label: ROLES.STORE_MANAGER.name,
  },
  {
    value: String(ROLES.SHIFT_MANAGER.id),
    label: ROLES.SHIFT_MANAGER.name,
  },
  {
    value: String(ROLES.TEMPORARY_SHIFT_MANAGER.id),
    label: ROLES.TEMPORARY_SHIFT_MANAGER.name,
  },
  {
    value: String(ROLES.EMPLOYEE.id),
    label: ROLES.EMPLOYEE.name,
  },
];

export const administrativeRoles = [
  {
    value: String(ROLES.ADMIN.id),
    label: ROLES.ADMIN.name,
  },
  {
    value: String(ROLES.GENERAL_MANAGER.id),
    label: ROLES.GENERAL_MANAGER.name,
  },
  {
    value: String(ROLES.STORE_MANAGER.id),
    label: ROLES.STORE_MANAGER.name,
  },
];

export const operationalRoles = [
  {
    value: String(ROLES.SHIFT_MANAGER.id),
    label: ROLES.SHIFT_MANAGER.name,
  },
  {
    value: String(ROLES.TEMPORARY_SHIFT_MANAGER.id),
    label: ROLES.TEMPORARY_SHIFT_MANAGER.name,
  },
  {
    value: String(ROLES.EMPLOYEE.id),
    label: ROLES.EMPLOYEE.name,
  },
];
