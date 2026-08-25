import { NextRequest, NextResponse } from "next/server";
import { registeredUsersMap, setCurrentUser, type RegisteredUser } from "../store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, companyName, sectorId, phone } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const user: RegisteredUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      phone: phone || "+14155552671",
      companyName: companyName || `${fullName.split(" ")[0]}'s Company`,
      companySectorId: sectorId || "retail-trading",
      role: "OWNER",
      permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
      effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings"],
      status: "ACTIVE",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    registeredUsersMap.set(email, { user, password });
    setCurrentUser(user);

    return NextResponse.json({
      token: `token-${Date.now()}-${Math.random()}`,
      user
    });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Registration failed" }, { status: 500 });
  }
}
