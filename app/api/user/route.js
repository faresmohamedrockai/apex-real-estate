import { NextResponse } from "next/server";
const connectDB = require('@/lib/DBConection');
const User = require('@/models/user');

// ✅ helper للتحقق من صلاحية الأدمن
async function isAdmin(adminId) {
  const user = await User.findById(adminId);
  return user && user.role === 'admin';
}


export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users, { status: 200 });
}


export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { adminId, userData } = body;

  if (!await isAdmin(adminId)) {
    return NextResponse.json({ message: "Unauthorized - Admins only" }, { status: 403 });
  }

  if (!userData) {
    return NextResponse.json({ message: "No user data provided" }, { status: 400 });
  }

  const newUser = await User.create(userData);
  return NextResponse.json({
    message: "User created successfully",
    user: newUser,
    status: 201,
  });
}


export async function PATCH(req) {
  await connectDB();
  const body = await req.json();

  const { adminId, userData } = body;

  if (!await isAdmin(adminId)) {
    return NextResponse.json({ message: "Unauthorized - Admins only" }, { status: 403 });
  }

  const { id, ...updateData } = userData;

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "User updated successfully",
    user: updatedUser,
  });
}

// ✅ DELETE: حذف مستخدم (Admins only)
export async function DELETE(req) {
  await connectDB();
  const body = await req.json();

  const { adminId, userId } = body;

  if (!await isAdmin(adminId)) {
    return NextResponse.json({ message: "Unauthorized - Admins only" }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "User deleted successfully",
    user: deletedUser,
  });
}
