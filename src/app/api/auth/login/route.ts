import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    let foundUser = db.users.find((u) => u.email === email);
    if (!foundUser) {
      const namePart = email.split("@")[0];
      const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      foundUser = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        phone: "+14155552671",
        companyName: `${fullName}'s Enterprise`,
        companyTinNumber: "123456789",
        companySectorId: "retail-trading",
        role: "OWNER",
        permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
        effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
        status: "ACTIVE",
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        passwordHash: password
      };
      db.users.push(foundUser);
    }

    db.currentUser = foundUser;
    db.logAudit("USER_LOGIN", "POST", "/api/auth/login", req);

    return NextResponse.json({
      token: `token-${Date.now()}-${Math.random()}`,
      user: foundUser
    });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Login failed" }, { status: 500 });
  }
}
