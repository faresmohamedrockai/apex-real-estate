// app/api/developers/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Developer from '@/models/Developers';
import Project from '@/models/projects';

export async function GET(req, { params }) {
  const id = await params.id
  try {
    await connectDB();
    const developer = await Developer.findById(id).populate('projects');

    if (!developer) {
      return NextResponse.json({ message: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json(developer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch developer', error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deletedDeveloper = await Developer.findByIdAndDelete(params.id);

    if (!deletedDeveloper) {
      return NextResponse.json({ message: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Developer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete developer', error }, { status: 500 });
  }
}
