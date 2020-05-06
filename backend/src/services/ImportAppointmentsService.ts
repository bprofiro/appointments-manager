import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import AppError from '../errors/AppError';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

class ImportAppointmentsService {
  public async execute(filePath: string): Promise<Appointment[]> {
    const appointmensRepository = getCustomRepository(AppointmentsRepository);

    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      ltrim: true,
      rtrim: true,
      relax_column_count: true,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const appointments: Appointment[] = [];

    let nIds = 0;
    const ids: string[] = [];
    const dates: Date[] = [];
    let lines = 0;

    parseCSV.on('data', line => {
      switch (lines) {
        case 0:
          [nIds] = line;
          break;
        case 1:
          for (let i = 0; i < nIds; i += 1) {
            ids.push(line[i]);
          }
          break;
        default:
          for (let i = 0; i < nIds; i += 1) {
            dates.push(line[i]);
          }
          break;
      }
      lines += 1;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // procura os appointments e cada pessoa cadastrada nele
    const agendamentos = await appointmensRepository.find({
      join: {
        alias: 'agendamento',
        innerJoinAndSelect: { person: 'agendamento.persons' },
      },
      where: qb => {
        qb.where({
          date_start: dates[0],
          date_end: dates[1],
        }).andWhere('person.id in (:...personId)', {
          personId: ids,
        });
      },
    });

    const personIds = agendamentos
      .reduce((acc: number[], appointment): number[] => {
        appointment.persons.forEach(person => {
          acc.push(person.id);
        });

        return acc;
      }, [])
      .filter((value, index, self) => self.indexOf(value) === index);

    const createAppointment = appointmensRepository.create(appointments);

    const findAppointmentsInSameDate = appointmensRepository.findByDate(
      dates[0],
      dates[1],
    );

    if (findAppointmentsInSameDate) {
      throw new AppError(
        'Você já tem um agendamento marcado para esse horário.',
      );
    }

    await appointmensRepository.save(createAppointment);

    return createAppointment;
  }
}

export default ImportAppointmentsService;
