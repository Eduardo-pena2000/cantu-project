export enum Roles {
  admin = 1,
  general_manager = 2,
  store_manager = 3,
  shift_manager = 4,
  employee = 5,
  temporary_shift_manager = 6,
  supervisor = 7,
}

export const rolesWithAccessToApp: Roles[] = [
  Roles.admin,
  Roles.general_manager,
  Roles.store_manager,
  Roles.shift_manager,
  Roles.temporary_shift_manager,
  Roles.supervisor,
];
