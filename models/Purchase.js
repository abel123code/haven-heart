// models/Purchase.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PurchaseSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    workshop: {  // <-- Change from 'course' to 'workshop'
      type: Schema.Types.ObjectId, 
      ref: 'Workshop', 
      required: true 
    },
    purchaseDate: { type: Date, default: Date.now },
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'SGD' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

// Indexes
PurchaseSchema.index({ user: 1 });
PurchaseSchema.index({ workshop: 1 }); // updated index
PurchaseSchema.index({ paymentIntentId: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
