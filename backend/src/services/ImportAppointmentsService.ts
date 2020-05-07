import { getCustomRepository, Raw, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import TemplateParse from '../util/TemplateParse';
import AppError from '../errors/AppError';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import Person from '../models/Person';

class ImportAppointmentsService {
  public async execute(filePath: string): Promise<Appointment[]> {
    const templateParse = new TemplateParse();
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const personsRepository = getRepository(Person);

    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      ltrim: true,
      rtrim: true,
      relax_column_count: true,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const appointments: Appointment[] = [];

    let ids: string[] = [];
    let dates: Date[] = [];
    let lines = 0;
    parseCSV.on('data', line => {
      switch (lines) {
        case 1:
          ids = line;
          break;
        case 2:
          dates = line;
          break;
        default:
          break;
      }
      lines += 1;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const agendamentos = await appointmentsRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.persons', 'person')
      .where({
        date_start: dates[0],
        date_end: dates[1],
      })
      .andWhere('person.id in (:...personId)', {
        personId: ids,
      })
      .getMany();
    const personIds = agendamentos
      .reduce((acc: number[], appointment): number[] => {
        appointment.persons.forEach(person => {
          acc.push(person.id);
        });

        return acc;
      }, [])
      .filter((value, index, self) => self.indexOf(value) === index);
    if (personIds.length > 0) {
      console.log(ids.filter(id => personIds.includes(id)));
    } else {
      const insertSql = appointmentsRepository
        .createQueryBuilder('agendamento')
        .insert()
        .into(Appointment, ['locale', 'date_start', 'date_end'])
        .output('Inserted.ID')
        .values({
          locale: 'são paulo',
          date_start: dates[0],
          date_end: dates[1],
        })
        .getQueryAndParameters();
      const sql = insertSql[0].replace(/(@(\d))/g, '{{$2}}');
      const result = templateParse
        .format(sql, { array: insertSql[1].map(param => param.value) })
        .replace(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g, "'$1'");
      console.log(result);

      const newAgendamento = await appointmentsRepository.findOne({
        where: { id: Raw(`(select max(ID) from "Agendamento")`) },
        relations: ['persons'],
      });
      const pessoas = personsRepository.find({
        where: {
          id: In(ids),
        },
      });
      const sql_associacao = await appointmentsRepository
        .createQueryBuilder()
        .relation(Appointment, 'persons')
        .of(newAgendamento)
        .getQueryAndParameters();
      const sql_insert = sql_associacao[0].replace(/(@(\d))/g, '{{$2}}');
      const result_insert = templateParse
        .format(sql_insert, { array: sql_associacao[1] })
        .replace(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g, "'$1'");
      console.log(result_insert);
      // fazer um insert usando o último agendamento
    }
    const createAppointment = appointmentsRepository.create(appointments);

    const findAppointmentsInSameDate = appointmentsRepository.findByDate(
      dates[0],
      dates[1],
    );

    if (findAppointmentsInSameDate) {
      throw new AppError(
        'Você já tem um agendamento marcado para esse horário.',
      );
    }

    await appointmentsRepository.save(createAppointment);

    return createAppointment;
  }
}

export default ImportAppointmentsService;
