import mongoose from 'mongoose'

const mobilemoneyItemSchema = new mongoose.Schema({
//   // Store the unique ID from the payment processor
//   gatewayId: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
  number: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile money number']
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    enum: ['mpesa', 'airtel_money', 'tkash'] 
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastFour: {
    type: String, 
    required: true
  },
  // to handle multiple cards or marking a default
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { 
    // _id: false // Prevent automatic _id generation for subdocuments
    timestamps: true,
    strict: true
}); 
// Optional: Pre-save middleware to automatically set lastFour from number
mobilemoneyItemSchema.pre('save', function(next) {
  if (this.number && this.number.length >= 4) {
    this.lastFour = this.number.slice(-4);
  }
  next();
});

export default mobilemoneyItemSchema;