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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset tokens if it's a new day
    const today = new Date().setHours(0, 0, 0, 0);
    const lastUsed = new Date(user.lastUsed).setHours(0, 0, 0, 0);

    if (today > lastUsed) {
      user.tokens = 3;
      user.lastUsed = new Date();
      await user.save();
    }

    return NextResponse.json({ tokens: user.tokens }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.hasAccess) {
      // Paid users have unlimited tokens
      return NextResponse.json({ tokens: "unlimited" }, { status: 200 });
    }

    if (user.tokens > 0) {
      user.tokens -= 1;
      user.lastUsed = new Date();
      await user.save();
      return NextResponse.json({ tokens: user.tokens }, { status: 200 });
    } else {
      return NextResponse.json({ error: "No tokens left" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error updating user tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
