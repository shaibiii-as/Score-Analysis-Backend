import * as express from 'express';
import * as controller from '../../controllers/student-record.controller';
import { validateRecord } from '../../utils/api-validator';

const router = express.Router();

router.route('/create').post(validateRecord, controller.create);
router.route('/list').get(controller.list);
router.route('/subject-average').post(controller.getAverageScoreBySubject);
router.route('/student-review').post(controller.getStudentReview);
router.route('/student-name').get(controller.getStudentNames);

export default router;
