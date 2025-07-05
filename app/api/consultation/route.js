import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Consultation from '@/models/consultation';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, project, unitType, priceRange, notes } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }

    // Phone number validation (basic)
    const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير صحيح' },
        { status: 400 }
      );
    }

    // Create consultation
    const consultation = new Consultation({
      name: name.trim(),
      phone: phone.trim(),
      project: project?.trim() || '',
      unitType: unitType || 'سكني',
      priceRange: {
        min: priceRange?.min || 0,
        max: priceRange?.max || 0
      },
      notes: notes?.trim() || '',
      status: 'pending'
    });

    await consultation.save();

    return NextResponse.json(
      { 
        message: 'تم إرسال طلب الاستشارة بنجاح',
        consultation: {
          id: consultation._id,
          name: consultation.name,
          status: consultation.status,
          createdAt: consultation.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Consultation API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال طلب الاستشارة' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let query = {};
    if (status) {
      query.status = status;
    }

    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Consultation.countDocuments(query);

    return NextResponse.json({
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Consultation GET API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
} 