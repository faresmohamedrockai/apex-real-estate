import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Consultation from '@/models/consultation';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      name_en,
      phone,
      project,
      project_en,
      unitType,
      unitType_en,
      priceRange,
      notes,
      notes_en
    } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }

    // Phone number validation
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
      name_en: name_en?.trim() || '',
      phone: phone.trim(),
      project: project?.trim() || '',
      project_en: project_en?.trim() || '',
      unitType: unitType || 'سكني',
      unitType_en: unitType_en || 'Residential',
      priceRange: {
        min: priceRange?.min || 0,
        max: priceRange?.max || 0
      },
      notes: notes?.trim() || '',
      notes_en: notes_en?.trim() || '',
      status: 'pending'
    });

    await consultation.save();

    return NextResponse.json(
      {
        message: 'تم إرسال طلب الاستشارة بنجاح',
        consultation: {
          id: consultation._id,
          name: consultation.name,
          name_en: consultation.name_en,
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
