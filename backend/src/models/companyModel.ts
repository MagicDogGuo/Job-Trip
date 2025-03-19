import mongoose, { Document, Schema } from 'mongoose';

// 公司接口
export interface ICompany extends Document {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 公司规模枚举
export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

// 公司模式
const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, '公司名称必填'],
      unique: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: Object.values(CompanySize),
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
companySchema.index({ name: 1 }, { unique: true });
companySchema.index({ industry: 1 });

// 创建模型
const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company; 