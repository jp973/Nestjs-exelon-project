// src/auth/schemas/token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);