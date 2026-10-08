const express = require("express");
const Meeting = require("../models/Meeting");

const {
    extractActionItems,
    generateMeetingSummary
} = require("../services/aiService");

const authMiddleware = require("../authMiddleware");

const router = express.Router();


// Protect all meeting routes
router.use(authMiddleware);


// ===============================
// Create a new meeting
// ===============================

router.post("/", async (req, res) => {

    try {

        const {
            title,
            transcript,
            actionItems
        } = req.body;


        const meeting = new Meeting({

            userId: req.user.userId,

            title,

            transcript,

            actionItems
        });


        const savedMeeting =
            await meeting.save();


        res.status(201).json({

            message:
                "Meeting created successfully",

            meeting: savedMeeting

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to create meeting",

            error: error.message

        });
    }
});


// ===============================
// Analyze meeting using AI
// ===============================

router.post("/analyze", async (req, res) => {

    try {

        const {
            title,
            transcript
        } = req.body;


        if (!title || !transcript) {

            return res.status(400).json({

                message:
                    "Title and transcript are required"

            });
        }


        // AI action items
        const aiResult =
            await extractActionItems(
                transcript
            );


        // AI summary
        const summaryResult =
            await generateMeetingSummary(
                transcript
            );


        // Create meeting
        const meeting = new Meeting({

            userId: req.user.userId,

            title,

            transcript,

            summary:
                summaryResult.summary,

            keyPoints:
                summaryResult.keyPoints,

            actionItems:
                aiResult.actionItems

        });


        const savedMeeting =
            await meeting.save();


        res.status(201).json({

            message:
                "Meeting analyzed and saved successfully",

            meeting: savedMeeting,

            summary: summaryResult

        });

    } catch (error) {

        console.error(
            "AI analysis error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to analyze meeting",

            error: error.message

        });
    }
});


// ===============================
// Get all meetings
// ===============================

router.get("/", async (req, res) => {

    try {

        const meetings =
            await Meeting.find({

                userId:
                    req.user.userId

            }).sort({
                createdAt: -1
            });


        res.status(200).json(
            meetings
        );

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch meetings",

            error: error.message

        });
    }
});


// ===============================
// Get single meeting
// ===============================

router.get("/:id", async (req, res) => {

    try {

        const meeting =
            await Meeting.findOne({

                _id:
                    req.params.id,

                userId:
                    req.user.userId

            });


        if (!meeting) {

            return res.status(404).json({

                message:
                    "Meeting not found"

            });
        }


        res.status(200).json(
            meeting
        );

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch meeting",

            error: error.message

        });
    }
});


// ===============================
// Update action item status
// ===============================

router.patch(
    "/:meetingId/actions/:actionId",
    async (req, res) => {

        try {

            const {
                meetingId,
                actionId
            } = req.params;


            const {
                status
            } = req.body;


            const allowedStatuses = [

                "Pending",

                "In Progress",

                "Completed"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid status"

                });
            }


            const meeting =
                await Meeting.findOne({

                    _id:
                        meetingId,

                    userId:
                        req.user.userId

                });


            if (!meeting) {

                return res.status(404).json({

                    message:
                        "Meeting not found"

                });
            }


            const actionItem =
                meeting.actionItems.id(
                    actionId
                );


            if (!actionItem) {

                return res.status(404).json({

                    message:
                        "Action item not found"

                });
            }


            actionItem.status =
                status;


            await meeting.save();


            res.status(200).json({

                message:
                    "Action item status updated successfully",

                meeting

            });

        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to update action item",

                error:
                    error.message

            });
        }
    }
);


// ===============================
// Delete meeting
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const meeting =
            await Meeting.findOneAndDelete({

                _id:
                    req.params.id,

                userId:
                    req.user.userId

            });


        if (!meeting) {

            return res.status(404).json({

                message:
                    "Meeting not found"

            });
        }


        res.status(200).json({

            message:
                "Meeting deleted successfully",

            meeting

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to delete meeting",

            error:
                error.message

        });
    }
});


module.exports = router;