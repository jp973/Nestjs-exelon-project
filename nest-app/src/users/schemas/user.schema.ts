// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    required: function() { 
      return this.role === 'user'; // Only required for regular users
    } 
  })
  ismarried?: boolean;

  @Prop({ 
    required: function() { 
      return this.role === 'user'; // Only required for regular users
    },
    enum: ['male', 'female', 'other']
  })
  gender?: string;

  @Prop({ 
    required: function() { 
      return this.role === 'user'; // Only required for regular users
    },
    min: 18,
    max: 100
  })
  age?: number;

  @Prop({ 
    required: true,
    enum: ['user', 'admin'],
    default: 'user' 
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);