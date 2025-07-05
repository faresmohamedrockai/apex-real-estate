import { NextResponse } from 'next/server';
const connectDB = require('@/lib/DBConection');
const Project = require('@/models/projects'); 
const Inventory = require('@/models/inventory'); 
const mongoose = require('mongoose');

export async function GET(request, { params }) {
  await connectDB();

  try {
    const { id } = params;

    // التحقق من صحة الـ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    // البحث عن المشروع مع المطور
    const project = await Project.findById(id).populate('developerId');
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // البحث عن جميع العقارات المرتبطة بالمشروع
    const units = await Inventory.find({ projectId: id });

    // تجميع البيانات
    const projectData = {
      _id: project._id,
      name: project.name,
      zone: project.zone,
      developer: project.developerId?.name || 'غير محدد',
      image: project.image || [],
      isUnique: project.isUnique || false,
      units: units.map(unit => ({
        _id: unit._id,
        title: unit.title,
        price: unit.price,
        unitType: unit.unitType,
        images: unit.images || [],
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        area: unit.area,
        isUnique: unit.isUnique || false
      }))
    };

    return NextResponse.json(
      { success: true, data: projectData },
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Error fetching project:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
} 