import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Project from '@/models/projects'; 
import Inventory from '@/models/inventory'; 
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'معرف المشروع غير صحيح' }, { status: 400 });
  }

  try {
    const project = await Project.findById(id).populate('developerId');
    if (!project) return NextResponse.json({ success: false, error: 'المشروع غير موجود' }, { status: 404 });

    const units = await Inventory.find({ projectId: id });
    



    const projectData = {
      _id: project._id,
      name: project.name,
      name_en: project.name_en,
      zone: project.zone,
      zone_en: project.zone_en,
      developer: project.developerId
        ? { _id: project.developerId._id, name: project.developerId.name }
        : null,
      image: project.image || [],
      isUnique: project.isUnique || false,
      minPrice:project.minPrice,
      units: units.map(unit => ({
        _id: unit._id,
        title: unit.title,
        title_en: unit.title_en,
        price: unit.price,
        unitType: unit.unitType,
        unitType_en: unit.unitType_en,
        images: unit.images || [],
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        isUnique: unit.isUnique || false
      }))
    };

    return NextResponse.json({ success: true, data: projectData }, { status: 200 });

  } catch (err) {
    console.error('❌ Error fetching project:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ دعم التعديل (PATCH)
export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'معرف المشروع غير صالح' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await Project.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('❌ PATCH error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ دعم الحذف (DELETE)
export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'معرف المشروع غير صالح' }, { status: 400 });
  }

  try {
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
