import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Inventory from '@/models/inventory';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const area = searchParams.get('area') || '';
    const bedrooms = searchParams.get('bedrooms') || '';
    const bathrooms = searchParams.get('bathrooms') || '';
    const region = searchParams.get('region') || '';
    const project = searchParams.get('project') || '';
    const priceMin = searchParams.get('priceMin') || '';
    const priceMax = searchParams.get('priceMax') || '';

    // Build query
    const query: Record<string, unknown> = {};

    // search: match title or unitType (case-insensitive, partial)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { unitType: { $regex: search, $options: 'i' } },
      ];
    }

    // area: area >= value
    if (area) {
      query.area = { $gte: Number(area) };
    }

    // bedrooms: exact match
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    // bathrooms: exact match
    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    // region: regex match (case-insensitive)
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    // project: regex match (case-insensitive)
    if (project) {
      query.project = { $regex: project, $options: 'i' };
    }

    // projectId: exact match
    const projectId = searchParams.get('projectId');
    if (projectId) {
      query.projectId = projectId;
    }

    // priceMin: price >= value
    if (priceMin) {
      query.price = {};
      query.price.$gte = Number(priceMin);
    }

    // priceMax: price <= value
    if (priceMax) {
      query.price.$lte = Number(priceMax);
    }

    const inventories = await Inventory.find(query).populate('projectId').lean();
    return NextResponse.json(inventories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 