import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import { Review } from '@/models/review';

export async function POST(request) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not defined');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, phone, rating, review, project, unitType } = body;

    // Validation
    if (!name || !phone || !review) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف والمراجعة مطلوبة' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'التقييم يجب أن يكون بين 1 و 5' },
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

    // Create review (initially hidden)
    const newReview = new Review({
      name: name.trim(),
      phone: phone.trim(),
      rating,
      review: review.trim(),
      project: project?.trim() || '',
      unitType: unitType || 'سكني',
      canShow: false, // لا تظهر تلقائياً
      isApproved: false // تحتاج موافقة إدارية
    });

    await newReview.save();

    return NextResponse.json(
      { 
        message: 'تم إرسال المراجعة بنجاح وستتم مراجعتها قريباً',
        review: {
          id: newReview._id,
          name: newReview.name,
          rating: newReview.rating,
          canShow: newReview.canShow,
          createdAt: newReview.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Review API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال المراجعة' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const canShow = searchParams.get('canShow');
    const isApproved = searchParams.get('isApproved');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let query = {};

    // For public reviews (frontend)
    if (canShow === 'true') {
      query.canShow = true;
    }

    // For admin panel
    if (isApproved !== null) {
      query.isApproved = isApproved === 'true';
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Review GET API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
} 