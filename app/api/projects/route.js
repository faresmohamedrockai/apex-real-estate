import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import '@/lib/models'; // تأكد من تسجيل كل النماذج
import Project from '@/models/projects';
import Developer from '@/models/Developers';
import Inventory from '@/models/inventory';
import mongoose from 'mongoose';

// GET All Projects
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

    // تحديث الأسعار لكل مشروع
    const updatedProjects = await Promise.all(
      allProjects.map(async (project) => {
        const inventories = await Inventory.find({ projectId: project._id });

        const prices = inventories
          .filter((unit) => typeof unit.price === 'number')
          .map((unit) => unit.price);

        const minPrice = prices.length ? Math.min(...prices) : null;
        const maxPrice = prices.length ? Math.max(...prices) : null;

        // تحديث المشروع في قاعدة البيانات
        await Project.findByIdAndUpdate(project._id, {
          avragePrice: { minPrice, maxPrice },
        });

        return {
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
          avragePrice: { minPrice, maxPrice },
          inventories,
        };
      })
    );

    return NextResponse.json(updatedProjects, {
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

// POST Create New Project
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      image,
      zone,
      developerId,
      latitude,
      longitude,
      name_en,
      zone_en,
      minPrice,
    } = body;




    // التحقق من الاسم
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'اسم المشروع مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من المطور
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
      name_en,
      zone_en,
      latitude,
      longitude,
      minPrice
    });


    // ربط المشروع بالمطور
    if (developerId) {
      await Developer.findByIdAndUpdate(developerId, {
        $push: { projects: newProject._id },
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
