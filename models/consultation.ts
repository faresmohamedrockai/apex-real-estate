import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConsultation extends Document {
  name: string;
  name_en?: string;
  phone: string;
  project?: string;
  project_en?: string;
  unitType?: string;
  unitType_en?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  notes?: string;
  notes_en?: string;
  read:boolean
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    name_en: { type: String, default: '' },
    phone: { type: String, required: true },
    project: { type: String, default: '' },
    project_en: { type: String, default: '' },
    unitType: { type: String, default: 'سكني' },
    unitType_en: { type: String, default: 'Residential' },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    notes: { type: String, default: '' },
    notes_en: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Consultation: Model<IConsultation> =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>('Consultation', ConsultationSchema);
