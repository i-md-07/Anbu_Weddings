const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Auth Fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Personal Details
    username: { type: String, required: true }, // Using as Name
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' }, // Implicit requirement generally

    // Family Details
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    familyAnnualIncome: { type: String, required: true },

    // Professional Details
    personAnnualIncome: { type: String, required: true },

    // Location Details
    state: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },

    // Cultural/Religious Details
    religion: { type: String, required: true },
    caste: { type: String, required: true }, // corrected spelling 'cast' -> 'caste'
    subCaste: { type: String }, // Optional (non-muslim per request)
    gothram: { type: String }, // Optional (non-muslim per request)

    // File Paths
    photo: { type: String }, // URL/Path to uploaded photo
    jathagam: { type: String }, // URL/Path to uploaded jathagam

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
