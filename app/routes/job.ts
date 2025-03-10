import express from 'express'
import { createJob, updateJob } from '../controllers/jobController';

const jobRouter = express.Router()

jobRouter.post('/create', createJob)
jobRouter.post('/update', updateJob)

export default jobRouter;