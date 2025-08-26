// src/auth/schemas/token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  expiresAt: Date; // logical expiry for access token (no TTL)

  @Prop({ required: true })
  refreshExpiresAt: Date; // refresh token expiry (with TTL)
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Indexes
TokenSchema.index({ accessToken: 1 });
TokenSchema.index({ refreshToken: 1 });
TokenSchema.index({ userId: 1 });
TokenSchema.index({ refreshExpiresAt: 1 }, { expireAfterSeconds: 0 });
