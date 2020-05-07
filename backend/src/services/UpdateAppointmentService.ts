import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import TemplateParse from '../util/TemplateParse';

interface RequestProps {
  id: number;
  initialDate: Date;
  finalDate: Date;
}

class UpdateAppointmentService {
  public async execute(filePath: string): Promise<Appointment[]> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      ltrim: true,
      rtrim: true,
      relax_column_count: true,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const appointments: Appointment[] = [];

    let id = 0;
    const dates: Date[] = [];
    let lines = 0;

    parseCSV.on('data', line => {
      switch (lines) {
        case 0:
          id = line;
          break;
        case 1:
          dates = line;
          break;
        default:
          break;
      }
      lines += 1;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const findAppointmentInSameDate = appointmentsRepository.findByDate(
      dates[0],
      dates[1],
    );

    if (findAppointmentInSameDate) {
      console.log('Você já tem um agendamento com esse horário');
      throw new AppError('Você já tem um agendamento com esse horário');
    }

    const insertSql = appointmentsRepository
      .createQueryBuilder('agendamento')
      .update()
      .set({ date_start: dates[0], date_end: dates[1] })
      .where('id = :id', { id })
      .getQueryAndParameters();
    const sql = insertSql[0].replace(/(@(\d))/g, '{{$2}}');
    const templateParse = new TemplateParse();

    const result = templateParse
      .format(sql, {
        array: insertSql[1].map(param =>
          param.type !== 'datetime' ? param : param.value.toISOString(),
        ),
      })
      .replace(/(\d{4}-\d{2}-\d{2}( |T)\d{2}:\d{2}:\d{2}(\.000Z)?)/g, "'$1'");

    console.log(result);

    const createAppointment = appointmentsRepository.create(appointments);

    await appointmentsRepository.save(createAppointment);

    return createAppointment;
  }
}

export default UpdateAppointmentService;
