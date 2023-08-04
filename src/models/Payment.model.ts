import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User.model';

export interface IPaymentDocument extends Document {
  user: IUserDocument;
  amount: number;
  date: Date;
  service: string;
  subscriptionType: string;
  transactionId: string;
  status: string;
}

const paymentSchema = new Schema<IPaymentDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  service: { type: String, required: true },
  subscriptionType: { type: String, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, required: true },
});

const PaymentModel = mongoose.model<IPaymentDocument>('Payment', paymentSchema);

export default PaymentModel;