import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import '@/lib/models'; // Ensure all models are registered
import Project from '@/models/projects'; 
import Developer from '@/models/Developers'; 
import mongoose from 'mongoose';
import Inventory from '@/models/inventory';

export async function GET() {
  try {
    await connectDB();

    const allProjects = await Project.find().populate([
      {
        path: 'inventories',
        model: 'Inventory'
      },
      {
        path: 'developerId',
        model: 'Developer'
      }
    ]); 

    return NextResponse.json(allProjects, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المشاريع' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, image, zone, developerId, latitude, longitude } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'اسم المشروع مطلوب' },
        { status: 400 }
      );
    }

    // تحقق من وجود المطور إذا تم توفيره
    if (developerId) {
      if (!mongoose.Types.ObjectId.isValid(developerId)) {
        return NextResponse.json(
          { success: false, error: 'معرف المطور غير صالح' },
          { status: 400 }
        );
      }

      const developer = await Developer.findById(developerId);
      if (!developer) {
        return NextResponse.json(
          { success: false, error: 'المطور غير موجود' },
          { status: 404 }
        );
      }
    }

    const newProject = await Project.create({
      name,
      image,
      zone,
      developerId,
      latitude,
      longitude
    });

    // تحديث المطور إذا تم توفيره
    if (developerId) {
      await Developer.findByIdAndUpdate(developerId, {
        $push: { projects: newProject._id }
      });
    }

    return NextResponse.json(
      { success: true, data: newProject },
      { status: 201 }
    );
  } catch (err) {
    console.error('❌ Error creating project:', err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
