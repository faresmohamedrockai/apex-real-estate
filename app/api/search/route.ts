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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: Record<string, unknown> = {};

    // Enhanced search: match multiple fields (case-insensitive, partial)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { unitType: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
        { project: { $regex: search, $options: 'i' } },
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
    if (priceMin || priceMax) {
      query.price = {} as { $gte?: number; $lte?: number };
      if (priceMin) (query.price as { $gte?: number }).$gte = Number(priceMin);
      if (priceMax) (query.price as { $lte?: number }).$lte = Number(priceMax);
    }

    // Add sorting options
    const sortBy = searchParams.get('sortBy') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Add pagination
    const skip = (page - 1) * limit;





    // Execute query with pagination and sorting
    const inventories = await Inventory.find(query)
      .populate('projectId')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Inventory.countDocuments(query);

    return NextResponse.json({
      data: inventories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 