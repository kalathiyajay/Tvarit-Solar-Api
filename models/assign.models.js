const mongoose = require('mongoose');

const assignInstallerSchema = mongoose.Schema({
    liasoningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liasoning',
    },
    FabricatorDate: {
        type: String,
    },
    Fabricator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    ElectricianDate: {
        type: String,
    },
    Electrician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    TechnicianDate: {
        type: String,
    },
    Technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('assigninstallers', assignInstallerSchema);