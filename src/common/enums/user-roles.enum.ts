export enum SpecialUserRoles {
  ADMIN = 'admin',
  DELIVERYPERSONNEL = 'delivery-personnel',
}

export enum Roles {
  USER = 'user',
  SUPERADMIN = 'super-admin',
  ADMIN = SpecialUserRoles.ADMIN,
  DELIVERYPERSON = SpecialUserRoles.DELIVERYPERSONNEL,
}

// Optionally, if you need a type that includes all roles:
export type UserRole = Roles | SpecialUserRoles;
