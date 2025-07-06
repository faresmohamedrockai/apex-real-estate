// app/api/developers/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Developer from '@/models/Developers';
import Project from "@/models/projects" ;
export async function GET() {
  try {
    await connectDB();
    const developers = await Developer.find({}).populate('projects');
    return NextResponse.json(developers, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching developers:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المطورين' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, logo, description, projects } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'اسم المطور مطلوب' },
        { status: 400 }
      );
    }

    const newDeveloper = await Developer.create({
      name: name.trim(),
      logo,
      description,
      projects: projects || []
    });

    return NextResponse.json(
      { success: true, data: newDeveloper },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating developer:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المطور' },
      { status: 500 }
    );
  }
}
