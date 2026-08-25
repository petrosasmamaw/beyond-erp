export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companySectorId: string;
  role: string;
  permissions: string[];
  effectivePermissions: string[];
  status: string;
  lastLoginAt: string;
  createdAt: string;
}

export const registeredUsersMap = new Map<string, { user: RegisteredUser; password: string }>();

// Default client user for instant MVP access / guest login
const defaultClientUser: RegisteredUser = {
  id: "user-client-1",
  fullName: "Enterprise Client",
  email: "client@enterprise.com",
  phone: "+14155552671",
  companyName: "Global Trading & Operations Inc.",
  companySectorId: "retail-trading",
  role: "OWNER",
  permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
  effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
  status: "ACTIVE",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

registeredUsersMap.set(defaultClientUser.email, {
  user: defaultClientUser,
  password: "password123"
});

let currentAuthUser: RegisteredUser = defaultClientUser;

export function getCurrentUser(): RegisteredUser {
  return currentAuthUser;
}

export function setCurrentUser(user: RegisteredUser) {
  currentAuthUser = user;
}
