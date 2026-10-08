const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },

    assignedTo: {
        type: String,
        required: true
    },

    deadline: {
        type: Date
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    }
});

const meetingSchema = new mongoose.Schema(
    {
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
        title: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        transcript: {
            type: String,
            required: true
        },

        summary: {
            type: String,
            default: ""
        },

        keyPoints: {
            type: [String],
            default: []
        },

        actionItems: [actionItemSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Meeting", meetingSchema);