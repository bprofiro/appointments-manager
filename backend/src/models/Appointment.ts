import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import Person from './Person';

@Entity('Agendamento')
class Agendamento {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'bigint' })
  id: string;

  @Column({ name: 'Local', type: 'varchar', length: 200 })
  locale: string;

  @Column('datetime', { name: 'DataInicio' })
  date_start: Date;

  @Column('datetime', { name: 'DataFim' })
  date_end: Date;

  @ManyToMany(_type => Person, person => person.appointments)
  persons: Person[];
}

export default Agendamento;
