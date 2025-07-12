import { NextResponse } from "next/server";
import connectDB from '@/lib/DBConection';
import User from '@/models/user';
import bcrypt from "bcrypt";






async function isAdmin(adminId) {
  const user = await User.findById(adminId);
  return user && user.role === 'admin';
}

// 📥 Get All Users
export async function GET() {
  await connectDB();
  const users = await User.find();

  return NextResponse.json(users, { status: 200 });
}












// ✅ POST: إنشاء مستخدم جديد
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, username_en, email, password, role } = body;

    // ✅ التحقق من الحقول المطلوبة
    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة." }, { status: 400 });
    }

    // ✅ التأكد إن الإيميل غير مستخدم من قبل
    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: username.trim() },
        ...(username_en ? [{ username_en: username_en.trim() }] : [])
      ]
    });
    if (existingUser) {
      let message = "";
      if (existingUser.email === email.trim().toLowerCase()) message = "هذا البريد الإلكتروني مستخدم بالفعل.";
      else if (existingUser.username === username.trim()) message = "اسم المستخدم مستخدم بالفعل.";
      else if (username_en && existingUser.username_en === username_en.trim()) message = "اسم المستخدم الإنجليزي مستخدم بالفعل.";
      else message = "هناك بيانات مستخدمة بالفعل.";
      return NextResponse.json({ message }, { status: 409 });
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ إنشاء المستخدم
    const newUser = await User.create({
      username: username.trim(),
      username_en: username_en?.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      {
        message: "تم إنشاء المستخدم بنجاح",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("خطأ أثناء إضافة المستخدم:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}












