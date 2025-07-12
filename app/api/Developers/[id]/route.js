// app/api/developers/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import '@/lib/models'; // Ensure all models are registered
import Developer from '@/models/Developers';

export async function GET(req, { params }) {
  const id = await params.id
  try {
    await connectDB();
    const developer = await Developer.findById(id);

    if (!developer) {
      return NextResponse.json({ message: 'Developer not found' }, { status: 404 });
    }

    // Fetch projects that belong to this developer
    const Project = (await import('@/models/projects')).default;
    const projects = await Project.find({ developerId: id }).populate([
      {
        path: 'inventories',
        model: 'Inventory'
      },
      {
        path: 'developerId',
        model: 'Developer'
      }
    ]);

    // Convert to plain object and add projects
    const developerData = developer.toObject();
    developerData.projects = projects;

    return NextResponse.json(developerData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch developer', error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deletedDeveloper = await Developer.findByIdAndDelete(params.id);

    if (!deletedDeveloper) {
      return NextResponse.json({ success: false, message: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Developer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete developer', error }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const {id} = params;
    const body = await req.json();
    const updateData = {};
    if (body.name) updateData.name = body.name;
    if (body.logo) updateData.logo = body.logo;
    if (body.description) updateData.description = body.description;
    if (body.description_en) updateData.description_en = body.description_en;
    const updatedDeveloper = await Developer.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDeveloper) {
      return NextResponse.json({ message: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json(updatedDeveloper, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update developer', error }, { status: 500 });
  }
}
