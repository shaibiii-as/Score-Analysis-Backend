import StudentRecord from "../models/student-record.model";
import { Request, Response, NextFunction } from "express";
import { getStdLLMFeedback } from "./assessment-feedback";
import * as fs from "fs";
import {
  createRecordSuccess,
  listRecordSuccess,
  listStudentNameSuccess,
  listReviewSuccess,
} from "../../config/user-messges";

interface RecordPayload {
  studentName: string;
  subject: string;
  score: number;
  totalScore: number;
  feedback: string;
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    const payload: RecordPayload = {
      studentName: body.studentName,
      subject: body.subject,
      score: body.score,
      totalScore: body.totalScore,
      feedback: body.feedback,
    };

    const student = await StudentRecord.create(payload);

    if (student) {
      const { _id, studentName, subject, score, totalScore, feedback } =
        student;
      const data = { _id, studentName, subject, score, totalScore, feedback };

      const feedbackData = `${studentName} in subject ${subject} is ${feedback}\n`;
      fs.appendFile("docs/data.txt", feedbackData, (err) => {
        if (err) {
          console.error("Failed to write to feedback.txt:", err);
        }
      });

      return res
        .status(201)
        .send({ success: true, message: createRecordSuccess, student: data });
    } else {
      return res.status(400).send({
        success: false,
        message: "Failed to create the student record.",
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentRecord = await StudentRecord.find().sort();

    return res.json({
      success: true,
      message: listRecordSuccess,
      studentRecord,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAverageScoreBySubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { subjects },
    } = req;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid subjects provided." });
    }

    const averageScores = await StudentRecord.aggregate([
      {
        $match: {
          subject: { $in: subjects },
        },
      },
      {
        $project: {
          subject: 1,
          percentageScore: {
            $multiply: [{ $divide: ["$score", "$totalScore"] }, 100],
          },
        },
      },
      {
        $group: {
          _id: "$subject",
          averagePercentageScore: { $avg: "$percentageScore" },
        },
      },
      {
        $project: {
          subject: "$_id",
          averagePercentageScore: 1,
          _id: 0, // Exclude the _id from the result
        },
      },
    ]);

    if (averageScores && averageScores.length > 0) {
      return res.json({
        success: true,
        message: "Average scores fetched successfully",
        averageScores,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "No records found for the provided subjects.",
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const getStudentReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { studentName },
    } = req;

    if (!studentName || studentName.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Student name is required." });
    }

    const reviewPrompt = `Writing a review about ${studentName}`;

    await getStdLLMFeedback(reviewPrompt).then((extractedText) => {
      return res.json({
        success: true,
        message: listReviewSuccess,
        extractedText,
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const getStudentNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const distinctStudentNames = await StudentRecord.distinct("studentName");

    if (!distinctStudentNames || distinctStudentNames.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No student names found." });
    }

    return res.json({
      success: true,
      message: listStudentNameSuccess,
      studentNames: distinctStudentNames,
    });
  } catch (error) {
    return next(error);
  }
};
