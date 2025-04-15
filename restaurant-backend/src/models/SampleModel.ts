import mongoose from 'mongoose';

const SampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

const Sample = mongoose.model('Sample', SampleSchema);
export default Sample;
