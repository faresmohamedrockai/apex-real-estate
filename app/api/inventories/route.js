import { NextResponse } from 'next/server';
const connectDB = require('@/lib/DBConection');
const Inventory = require('@/models/inventory');
const Project = require('@/models/projects');
const mongoose = require('mongoose'); 

export async function GET() {
  await connectDB();

  const inventories = await Inventory.find().populate('projectId');

  if (!inventories || inventories.length === 0) {
    return NextResponse.json({ message: "لا يوجد وحدات متاحة", status: 404 });
  }

  return NextResponse.json(inventories, { status: 200 });
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, price, unitType, images, bedrooms, bathrooms, area, projectId, isUnique,latitude,longitude } = body;

    // تأكد من أن projectId موجود وصالح
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ success: false, error: 'رقم المشروع غير صالح' }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'المشروع غير موجود' }, { status: 404 });
    }

    // إنشاء الوحدة
    const newInventory = await Inventory.create({
      title,
      price,
      unitType,
      images,
      bedrooms,
      bathrooms,
      area,
      projectId,
      isUnique,
      longitude,
      latitude
    });

    // تحديث المشروع لربط الوحدة به
    await Project.findByIdAndUpdate(projectId, {
      $push: { inventories: newInventory._id },
    });

    return NextResponse.json({ success: true, data: newInventory }, { status: 201 });
  } catch (err) {
    console.error("❌ خطأ أثناء إضافة الوحدة:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
