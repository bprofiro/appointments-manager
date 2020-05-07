import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import ImportAppointmentsService from '../services/ImportAppointmentsService';
import UpdateAppointmentService from '../services/UpdateAppointmentService';

const appointmentsRouter = Router();
const upload = multer(uploadConfig);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find({
    relations: ['persons'],
  });

  return response.json(appointments);
});

appointmentsRouter.post(
  '/',
  upload.single('file'),
  async (request, response) => {
    try {
      const importAppointment = new ImportAppointmentsService();

      const appointments = await importAppointment.execute(request.file.path);

      return response.json(appointments);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

appointmentsRouter.post('/filter', async (request, response) => {
  try {
    const { month, year } = request.body;

    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const filterAppointmentsInSameDate = await appointmentsRepository.filterByDate(
      month,
      year,
    );

    return response.json(filterAppointmentsInSameDate);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

appointmentsRouter.put(
  '/update',
  upload.single('file'),
  async (request, response) => {
    try {
      const updateAppointment = new UpdateAppointmentService();

      const appointment = await updateAppointment.execute(request.file.path);

      return response.json(appointment);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default appointmentsRouter;
