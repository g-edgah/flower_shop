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
    enum: ['visa', 'masterCard', 'mpesa'] 
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
    month: {
      type: String,
      enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    year: {
      type: String,
      enum: ['2026', '2027', '2028', '2029', '2030']
    }
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