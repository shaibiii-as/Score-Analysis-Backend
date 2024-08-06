import * as express from "express";
import studentRecordRoutes from "./student-record.route";

const router = express.Router();

// v1/
router.use("/record", studentRecordRoutes);

export default router;
