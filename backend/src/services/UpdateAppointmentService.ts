import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestProps {
  id: number;
  initialDate: Date;
  finalDate: Date;
}

class UpdateAppointmentService {
  public async execute(filePath: string): Promise<RequestProps> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      ltrim: true,
      rtrim: true,
      relax_column_count: true,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const appointments: Appointment[] = [];

    let id: number = 0;
    const dates: Date[] =[];
    let lines = 0;

    parseCSV.on('data', line => {
      switch(lines) {
        case 0:
          id = line;
          break;
        default:
          for (let i = 0; i < ; i += 1) {
            dates.push(line[i])
          }
          break;
      }
      lines += 1;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    appointments.push({
      id: id,
      initialDate: dates[0],
      finalDate: dates[1],
    });

    const appointment = appointmentsRepository.findOne(id);

    if (!appointment) {
      throw new Error('Você não tem um agendamento com esse id');
    }



  }
}

export default UpdateAppointmentService;
