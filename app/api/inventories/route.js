import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Inventory from '@/models/inventory';
import Project from '@/models/projects';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    const inventories = await Inventory.find().populate('projectId');

    return NextResponse.json(inventories, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching inventories:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الوحدات' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { title,title_en, price, unitType, images, bedrooms, bathrooms, area, projectId, isUnique, latitude, longitude,description_en,decription,region_en,region } = body;

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'عنوان الوحدة مطلوب' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }

    // تأكد من أن projectId موجود وصالح
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, error: 'رقم المشروع غير صالح' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // إنشاء الوحدة
    const newInventory = await Inventory.create({
      title: title.trim(),
      title_en: title_en.trim(),
      price: price || 0,
      unitType: unitType || 'Apartment',
      images: images || [],
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      area: area || 0,
      projectId,
      description_en,
      decription,
      region,
      region_en,
      isUnique: isUnique || false,
      longitude,
      latitude
    });

    // تحديث المشروع لربط الوحدة به
    await Project.findByIdAndUpdate(projectId, {
      $push: { inventories: newInventory._id },
    });

    return NextResponse.json(
      { success: true, data: newInventory },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ خطأ أثناء إضافة الوحدة:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
