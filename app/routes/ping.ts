import express from 'express'
import { createJob, updateJob } from '../controllers/jobController';
import { pingJob } from '../controllers/pingController';

const pingRouter = express.Router()

pingRouter.post('/:id', pingJob)

export default pingRouter;