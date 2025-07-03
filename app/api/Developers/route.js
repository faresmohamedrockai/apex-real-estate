// app/api/developers/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Developer from '@/models/Developers';

export async function GET() {
  try {
    await connectDB();
    const developers = await Developer.find({}).populate('projects');
    return NextResponse.json(developers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch developers', error }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, logo, projects } = body;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const newDeveloper = await Developer.create({ name, logo, projects });

    return NextResponse.json(newDeveloper, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create developer', error }, { status: 500 });
  }
}
