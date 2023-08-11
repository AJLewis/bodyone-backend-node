import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  uri: string;
  name: string;
  progress: string;
  inUse?: boolean;
  isPending?: boolean;
  model?: string;
}

export interface IProductImageDocument extends Document, IProductImage {}

const ProductImageSchema = new Schema<IProductImage>({
    uri: { type: String, required: true },
    name: { type: String, required: true },
    progress: { type: String, required: false },
    inUse: { type: Boolean, required: false },
    isPending: { type: Boolean, required: false },
    model: { type: String, required: false },
  });
  
  export const ProductImageModel = mongoose.model<IProductImage & Document>('ProductImage', ProductImageSchema);