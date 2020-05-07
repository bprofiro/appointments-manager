/* eslint-disable @typescript-eslint/no-use-before-define */
import { getCustomRepository, getRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import AppError from '../errors/AppError';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import TemplateParse from '../util/TemplateParse';
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
    let newIds = [];
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
      newIds = ids.filter(id => personIds.includes(id));
      if (newIds.length > 0) {
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
        console.log(insertSql);
        const sql = insertSql[0].replace(/(@(\d))/g, '{{$2}}');
        const result = templateParse
          .format(sql, {
            array: insertSql[1].map(param =>
              param.type !== 'datetime'
                ? param.value
                : param.value.toISOString(),
            ),
          })
          .replace(
            /(\d{4}-\d{2}-\d{2}( |T)\d{2}:\d{2}:\d{2}(\.000Z)?)/g,
            "'$1'",
          );
        let {
          max: newAgendamento,
        }: {
          max: number;
        } = await appointmentsRepository
          .createQueryBuilder()
          .select(`max("ID")`, 'max')
          .getRawOne();
        newAgendamento = Number(newAgendamento) + 1;

        const insert_s = `INSERT INTO "PessoaAgendamento"("PessoaId", "AgendamentoId") VALUES `;
        const fragment_insert = `(@1, @2)`;
        const final_insert = ';';
        const result_2 = newIds
          .reduce((values: string, id: number): string => {
            values += templateParse.format(`({{0}}, {{1}}),`, {
              array: [newAgendamento, id],
            });
            console.log([newAgendamento, id]);
            return values;
          }, insert_s)
          .replace(/,$/g, ';');

        console.log(result_2);
        await fs.promises.unlink(filePath);
        const sqls = `${result}; ${result_2}`;
        return sqls;
      }
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
      console.log(insertSql);
      const sql = insertSql[0].replace(/(@(\d))/g, '{{$2}}');
      const result = templateParse
        .format(sql, {
          array: insertSql[1].map(param =>
            param.type !== 'datetime' ? param.value : param.value.toISOString(),
          ),
        })
        .replace(/(\d{4}-\d{2}-\d{2}( |T)\d{2}:\d{2}:\d{2}(\.000Z)?)/g, "'$1'");
      console.log('##############');
      console.log(result);
      console.log('##############');
      let {
        max: newAgendamento,
      }: {
        max: number;
      } = await appointmentsRepository
        .createQueryBuilder()
        .select(`max("ID")`, 'max')
        .getRawOne();
      newAgendamento = Number(newAgendamento) + 1;
      console.log(newAgendamento);
      const insert_s = `INSERT INTO "PessoaAgendamento"("PessoaId", "AgendamentoId") VALUES `;
      const fragment_insert = `(@1, @2)`;
      const final_insert = ';';
      const result_2 = ids
        .reduce((values: string, id: number): string => {
          values += templateParse.format(`({{0}}, {{1}}),`, {
            array: [newAgendamento, id],
          });
          console.log([newAgendamento, id]);
          return values;
        }, insert_s)
        .replace(/,$/g, ';');

      console.log(result_2);
      await fs.promises.unlink(filePath);
      const sqls = `${result}; ${result_2}`;
      return sqls;
    }
  }
}

export default ImportAppointmentsService;
