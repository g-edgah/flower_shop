import mongoose from 'mongoose'

const paypalItemSchema = new mongoose.Schema({
  // PayPal account identifier
  paypalEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  
  // PayPal account ID (provided after authentication)
  paypalAccountId: {
    type: String,
    sparse: true, // Allows null/undefined but enforces uniqueness when present
    index: true,
  },
  
  // Payer ID from PayPal API
  payerId: {
    type: String,
    sparse: true,
  },
  
  // PayPal customer/agreement ID for recurring payments
  agreementId: {
    type: String,
    sparse: true,
  },
  
  // Token/authorization code for future payments
  paymentToken: {
    type: String,
    select: false, // Don't return in queries by default
  },
  
  // Billing agreement ID for reference transactions
  billingAgreementId: {
    type: String,
    sparse: true,
  },
  
  // Account status
  status: {
    type: String,
    enum: ['active', 'inactive', 'verified', 'unverified', 'suspended'],
    default: 'unverified',
  },
  
  // Display name from PayPal
  displayName: {
    type: String,
    trim: true,
  },
  
  // PayPal account type
  accountType: {
    type: String,
    enum: ['personal', 'business'],
    default: 'personal',
  },
  
  // Verification status
  isVerified: {
    type: Boolean,
    default: false,
  },
  
  // Timestamps
  verifiedAt: {
    type: Date,
  },
  lastUsedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true, 
  strict: true
});

// // Pre-save middleware to update timestamps
// paypalItemSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Instance method to set as default and unset others
// paypalItemSchema.methods.setAsDefault = async function(userId) {
//   const User = mongoose.model('User');
  
//   // Set this as default
//   this.isDefault = true;
//   await this.save();
  
//   // Remove default from other PayPal accounts
//   await User.updateOne(
//     { 
//       _id: userId,
//       'paymentMethods.paypal._id': { $ne: this._id }
//     },
//     {
//       $set: { 'paymentMethods.paypal.$[elem].isDefault': false }
//     },
//     {
//       arrayFilters: [{ 'elem.isDefault': true }]
//     }
//   );
  
//   return this;
// };

// // Static method to create from PayPal API response
// paypalItemSchema.statics.createFromPayPalData = function(paypalData) {
//   return new this({
//     paypalEmail: paypalData.email,
//     paypalAccountId: paypalData.accountId || paypalData.payer_id,
//     payerId: paypalData.payer_id,
//     displayName: paypalData.name || paypalData.displayName,
//     accountType: paypalData.accountType || 'personal',
//     isVerified: paypalData.verified || false,
//     verifiedAt: paypalData.verified ? new Date() : null,
//     status: paypalData.verified ? 'verified' : 'unverified',
//   });
// };

// // Method to update from PayPal API data
// paypalSchema.methods.updateFromPayPalData = function(paypalData) {
//   if (paypalData.email) this.paypalEmail = paypalData.email;
//   if (paypalData.accountId) this.paypalAccountId = paypalData.accountId;
//   if (paypalData.payer_id) this.payerId = paypalData.payer_id;
//   if (paypalData.name) this.displayName = paypalData.name;
//   if (paypalData.verified) {
//     this.isVerified = paypalData.verified;
//     this.verifiedAt = new Date();
//     this.status = 'verified';
//   }
//   this.updatedAt = Date.now();
//   return this;
// };

// // Index for faster lookups
// paypalSchema.index({ paypalEmail: 1 });
// paypalSchema.index({ paypalAccountId: 1 });
// paypalSchema.index({ isDefault: 1 });

// const PayPal = mongoose.model('PayPal', paypalSchema);

export default paypalItemSchema;