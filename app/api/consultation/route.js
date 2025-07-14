import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBConection';
import { Consultation } from '@/models/consultation';
import nodemailer from 'nodemailer';

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
    console.log('Received consultation data:', body);

    const {
      name,
      name_en,
      phone,
      phone_type,
      email,
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

    const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير صحيح' },
        { status: 400 }
      );
    }

    const consultationData = {
      name: name.trim(),
      name_en: name_en?.trim() || '',
      phone: phone.trim(),
      phone_type: phone_type || 'phone',
      email: email?.trim() || '',
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
    };

    console.log('Saving consultation data:', consultationData);

    const consultation = new Consultation(consultationData);
    await consultation.save();

    // Send Emails
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.COMPANY_RECEIVER) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Email to company
      await transporter.sendMail({
        from: `"Consultation Request" <${process.env.EMAIL_USER}>`,
        to: process.env.COMPANY_RECEIVER,
        subject: '📩 استشارة عقارية جديدة من العميل',
        html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px; border-radius: 50px;">
          <img src="https://res.cloudinary.com/dxkau0eb3/image/upload/v1752400892/red.logo_qy7dfq.jpg" alt="Company Logo" style="max-width: 120px; margin-bottom: 10px; border-radius: 50px;" />
          <h2 style="color: #b70501;">طلب استشارة عقارية</h2>
          <p style="color: #444;">تم تقديم استشارة جديدة من العميل، التفاصيل الكاملة بالأسفل:</p>
        </div>

        <div style="line-height: 1.8; font-size: 16px; color: #333;">
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>رقم الهاتف:</strong> ${phone} (${phone_type === 'phone' ? 'هاتف' : phone_type === 'whatsapp' ? 'واتساب' : 'هاتف'})</p>
          <p><strong>البريد الإلكتروني:</strong> ${email || '-'}</p>
          <p><strong>المشروع:</strong> ${project || '-'}</p>
          <p><strong>نوع الوحدة:</strong> ${unitType || '-'}</p>
       <p><strong>الميزانية:</strong> من ${(priceRange?.min || 0).toLocaleString()} إلى ${(priceRange?.max || 0).toLocaleString()} جنيه</p>
          <p><strong>ملاحظات:</strong> ${notes || '-'}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #888;">تم الإرسال عبر نظام الاستشارات الخاص بموقعكم</p>
        </div>
      </div>
    </div>
  `
      });


      if (email) {
        await transporter.sendMail({
          from: `"Real Estate Team" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: '📩 تم استلام استشارتك بنجاح',
          html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 25px; border-radius: 50px;">
            <img src="https://res.cloudinary.com/dxkau0eb3/image/upload/v1752400892/red.logo_qy7dfq.jpg" alt="Company Logo" style="max-width: 120px; margin-bottom: 10px;" />
            <h2 style="color: #b70501;">شكرًا لتواصلك معنا</h2>
          </div>

          <div style="font-size: 16px; line-height: 1.7; color: #333;">
            <p>مرحبًا <strong>${name}</strong>،</p>
            <p>لقد تم استلام طلب الاستشارة الخاص بك بنجاح، وسيتواصل معك أحد مستشارينا قريبًا لتقديم الدعم المناسب.</p>
            <p>نحن نقدر ثقتك فينا، وسنعمل على تلبية احتياجاتك العقارية بأفضل شكل ممكن.</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #888;">فريق العمل | شركتك العقارية</p>
          </div>
        </div>
      </div>
    `
        });
      }

    }

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

export async function GET() {
  try {
    await connectDB();
    const consultations = await Consultation.find({}).sort({ createdAt: -1 });

    const result = consultations.map(c => ({
      _id: c._id,
      name: c.name,
      name_en: c.name_en,
      email: c.email,
      phone: c.phone,
      project: c.project,
      project_en: c.project_en,
      unitType: c.unitType,
      unitType_en: c.unitType_en,
      priceRange: c.priceRange,
      notes: c.notes,
      notes_en: c.notes_en,
      status: c.status,
      message: c.notes,
      read: typeof c.read === 'boolean' ? c.read : false,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الاستشارات' }, { status: 500 });
  }
}
