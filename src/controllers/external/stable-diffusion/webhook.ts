import {Request, Response} from 'express';
import { ProductImageModel } from '../../../models/ProductImage.model';
import MealPlan from '../../../models/MealPlan.model';

export const webhook = async (req: Request, res: Response): Promise<void> => {
  const { id, output } = req.body;

  if (output && output[0]) {
    // Find the temporary record using the request ID
    const productImageDoc = await ProductImageModel.findOne({ uri: id.toString() });

    if (productImageDoc) {
      // Update the URI with the actual image URL
      productImageDoc.uri = output[0];
      productImageDoc.isPending = false;
      await productImageDoc.save();

      console.log('Image updated:', output[0]);
    } else {
      console.error('Temporary record not found for ID:', id);
    }
  }

  res.status(200).send('Webhook handled');
};