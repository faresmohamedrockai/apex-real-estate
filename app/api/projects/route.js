import { NextResponse } from 'next/server';
const connectDB = require('@/lib/DBConection');
const Project = require('@/models/projects'); 
const Inventory = require('@/models/inventory'); 
const Developer = require('@/models/Developers'); 
const mongoose = require('mongoose'); // 👈 لازم تضيف دي
export async function GET() {
  await connectDB();

  const allProjects = await Project.find().populate(['inventories', 'developerId']); 

  return NextResponse.json(allProjects, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();

    const { name, image, zone, developerId,latitude,longitude } = body;

    // تحقق من وجود المطور
    const developer = await Developer.findById(new mongoose.Types.ObjectId(developerId));
    if (!developer) {
      return NextResponse.json({ success: false, error: 'المطور غير موجود' }, { status: 404 });
    }

  const newProject = await Project.create({
  name,
  image,
  zone,
  developerId,
  latitude,
  longitude
});


await Developer.findByIdAndUpdate(developerId, {
  $push: { projects: newProject._id }
});

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

