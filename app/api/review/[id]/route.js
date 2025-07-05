import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import Review from '@/models/review';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { canShow, isApproved } = body;

    // Find and update the review
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'المراجعة غير موجودة' },
        { status: 404 }
      );
    }

    // Update fields
    if (canShow !== undefined) {
      review.canShow = canShow;
    }
    
    if (isApproved !== undefined) {
      review.isApproved = isApproved;
    }

    review.updatedAt = new Date();
    await review.save();

    return NextResponse.json({
      message: 'تم تحديث المراجعة بنجاح',
      review: {
        id: review._id,
        name: review.name,
        rating: review.rating,
        canShow: review.canShow,
        isApproved: review.isApproved,
        updatedAt: review.updatedAt
      }
    });

  } catch (error) {
    console.error('Review Update API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المراجعة' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'المراجعة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'تم حذف المراجعة بنجاح'
    });

  } catch (error) {
    console.error('Review Delete API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المراجعة' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'المراجعة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });

  } catch (error) {
    console.error('Review GET API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المراجعة' },
      { status: 500 }
    );
  }
} 