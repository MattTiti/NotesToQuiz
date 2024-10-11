import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findById(session.user.id);
    const userHasAccess = user?.hasAccess || false;

    return NextResponse.json({ userHasAccess }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
