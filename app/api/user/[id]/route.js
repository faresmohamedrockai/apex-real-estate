import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const updateData = await req.json();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // إذا كان هناك كلمة مرور جديدة، شفرها قبل الحفظ
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // تنظيف الحقول
    if (updateData.username) updateData.username = updateData.username.trim();
    if (updateData.username_en) updateData.username_en = updateData.username_en.trim();
    if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();

    // تحقق من تكرار الإيميل أو اسم المستخدم أو الاسم الإنجليزي (مع استثناء المستخدم الحالي)
    if (updateData.email || updateData.username || updateData.username_en) {
      const orConditions = [];
      if (updateData.email) orConditions.push({ email: updateData.email });
      if (updateData.username) orConditions.push({ username: updateData.username });
      if (updateData.username_en) orConditions.push({ username_en: updateData.username_en });
      if (orConditions.length > 0) {
        const existingUser = await User.findOne({
          $or: orConditions,
          _id: { $ne: id }
        });
        if (existingUser) {
          let message = "هناك بيانات مستخدمة بالفعل.";
          if (updateData.email && existingUser.email === updateData.email) message = "هذا البريد الإلكتروني مستخدم بالفعل.";
          else if (updateData.username && existingUser.username === updateData.username) message = "اسم المستخدم مستخدم بالفعل.";
          else if (updateData.username_en && existingUser.username_en === updateData.username_en) message = "اسم المستخدم الإنجليزي مستخدم بالفعل.";
          return NextResponse.json({ message }, { status: 409 });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      message: "تم تعديل المستخدم بنجاح",
      user: updatedUser,
    });
  } catch (error) {
    console.error("حدث خطأ أثناء التعديل:", error);
    return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
  }
}






export async function DELETE(req, { params }) {
    try {
      await connectDB();
      const { id } = params;
  
      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "تم حذف المستخدم بنجاح" });
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error);
      return NextResponse.json({ message: "فشل حذف المستخدم" }, { status: 500 });
    }
  }