import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import { Consultation } from '@/models/consultation';

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const body = await request.json();
    const updated = await Consultation.findByIdAndUpdate(id, { $set: { read: !!body.read } }, { new: true });
    if (!updated) return NextResponse.json({ success: false, error: 'الاستشارة غير موجودة' }, { status: 404 });
    return NextResponse.json({ success: true, consultation: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء التحديث' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const deleted = await Consultation.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: 'الاستشارة غير موجودة' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء الحذف' }, { status: 500 });
  }
} 