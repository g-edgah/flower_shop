import mongoose from 'mongoose'

const cardItemSchema = new mongoose.Schema({
//   // Store the unique ID from the payment processor
//   gatewayId: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
  cardNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{16}$/, 'Please enter a valid 16-digit card number']
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    enum: ['visa', 'masterCard', 'mpesa_global'] 
  },
  holderName: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    }
  },
  expiryDate: {
    type: String, // consider storing as "MM/YY" or a Date object, but "MM/YY" is common for frontend display
    required: true,
    match: [/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Please enter a valid expiry date (MM/YY)']
  },
  cvv: {
    type: String,
    required: true,
    match: [/^\d{3,4}$/, 'Please enter a valid CVV']
  },
  // tokenized version or last 4 digits for display
  lastFour: {
    type: String, 
    required: true
  },
}, { 
    // _id: false // Prevent automatic _id generation for subdocuments
    timestamps: true,
    strict: true
}); 
// Optional: Pre-save middleware to automatically set lastFour from cardNumber
cardItemSchema.pre('save', function(next) {
  if (this.cardNumber && this.cardNumber.length >= 4) {
    this.lastFour = this.cardNumber.slice(-4);
  }
  next();
});

export default cardItemSchema;