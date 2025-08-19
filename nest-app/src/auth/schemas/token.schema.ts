// src/auth/schemas/token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Add index for better performance
TokenSchema.index({ token: 1 });
TokenSchema.index({ userId: 1 });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });