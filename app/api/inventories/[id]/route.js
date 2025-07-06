import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/DBConection';
import Inventory from '@/models/inventory';
import Project from '@/models/projects';

// 🟢 GET - جلب وحدة واحدة حسب ID
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'رقم ID غير صالح' }, { status: 400 });
  }

  const item = await Inventory.findById(id).populate('projectId');

  if (!item) {
    return NextResponse.json({ success: false, error: 'الوحدة غير موجودة' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: item }, { status: 200 });
}

// 🟡 PATCH - تعديل بيانات وحدة
export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'رقم ID غير صالح' }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = await Inventory.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'الوحدة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

//  DELETE - حذف وحدة
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'رقم ID غير صالح' }, { status: 400 });
  }

  try {
    const deleted = await Inventory.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'الوحدة غير موجودة' }, { status: 404 });
    }

    // إزالة الوحدة من المشروع المرتبط
    await Project.findByIdAndUpdate(deleted.projectId, {
      $pull: { inventories: deleted._id },
    });

    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
