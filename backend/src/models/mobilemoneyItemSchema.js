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
    match: [/^\d{12}$/, 'Please enter a valid 10-digit mobile money number']
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    enum: ['mpesa', 'airtel_money', 'tkash'] 
  },
  name: {
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
  lastFour: {
    type: String, 
    required: true
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