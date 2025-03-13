import express from 'express'
import { createJob, getJob, updateJob } from '../controllers/jobController';
import { errorHandler } from '../../errorHandler';

const jobRouter = express.Router()

jobRouter.post('/create', errorHandler(createJob))
jobRouter.post('/update/:id', errorHandler(updateJob))
jobRouter.get('/:id', errorHandler(getJob))

export default jobRouter;