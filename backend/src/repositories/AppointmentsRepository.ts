import {
  EntityRepository,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
} from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  public async filterByDate(
    month: number,
    year: number,
  ): Promise<Appointment[] | null> {
    const filterAppointment = await this.find({
      where: { initialDate: month, finalDate: year },
    });

    if (!filterAppointment) {
      throw new Error('Você não tem nenhum agendamento para essas datas.');
    }

    return filterAppointment;
  }

  public async findByDate(
    initialDate: Date,
    finalDate: Date,
  ): Promise<boolean> {
    const findAgendamento = await this.find({
      where: [
        {
          initialDate: LessThanOrEqual(initialDate),
          finalDate: MoreThanOrEqual(initialDate),
        },
        {
          initialDate: LessThanOrEqual(finalDate),
          finalDate: MoreThanOrEqual(finalDate),
        },
        {
          initialDate: LessThan(initialDate),
          finalDate: MoreThan(finalDate),
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
