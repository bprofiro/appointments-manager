import {
  EntityRepository,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
  Raw,
} from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  public async filterByDate(
    month: number,
    year: number,
  ): Promise<Appointment[] | null> {
    const filterAppointment = await this.find({
      select: ['date_start', 'date_end'],
      where: {
        date_start: Raw(
          () =>
            `datepart(year, "Agendamento"."DataInicio")=${year} AND
          datepart(month, "Agendamento"."DataFim")=${month}`,
        ),
        date_end: Raw(
          () =>
            `datepart(year, "Agendamento"."DataInicio")=${year} AND
        datepart(month, "Agendamento"."DataFim")=${month}`,
        ),
      },
    });

    if (!filterAppointment) {
      throw new Error('Você não tem nenhum agendamento para essas datas.');
    }

    return filterAppointment;
  }

  public async findByDate(date_start: Date, date_end: Date): Promise<boolean> {
    const findAgendamento = await this.find({
      where: [
        {
          initialDate: LessThanOrEqual(date_start),
          finalDate: MoreThanOrEqual(date_start),
        },
        {
          initialDate: LessThanOrEqual(date_end),
          finalDate: MoreThanOrEqual(date_end),
        },
        {
          initialDate: LessThan(date_start),
          finalDate: MoreThan(date_end),
        },
      ],
    });

    if (findAgendamento.length === 0) {
      throw new Error('Você já tem um agendamento marcado para essa data');
    }

    return findAgendamento.length > 0;
  }
}

export default AppointmentRepository;
