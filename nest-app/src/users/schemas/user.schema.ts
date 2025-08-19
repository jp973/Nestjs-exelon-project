///nest-app\src\users\schemas\user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age?: number;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender?: string;

  @Prop({ required: true })
  ismarried?: boolean;

  @Prop({ unique: true, sparse: true })  
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);