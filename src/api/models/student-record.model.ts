import mongoose, { Document, Schema, Model } from "mongoose";

interface IStudentRecord extends Document {
  studentName: string;
  subject: string;
  score: number;
  totalScore: number;
  feedback: String;
  description?: string;
}

const StudentRecordSchema: Schema = new Schema(
  {
    studentName: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

const StudentRecordModel: Model<IStudentRecord> =
  mongoose.model<IStudentRecord>("StudentRecord", StudentRecordSchema);

export default StudentRecordModel;
