import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Appointment from './Appointment';

@Entity('Pessoa')
class Person {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @Column('varchar', { length: 100, name: 'Nome' })
  name: string;

  @Column('date', { name: 'DataDeNascimento' })
  birth_date: Date;

  @Column('varchar', { length: 100, name: 'Email' })
  email: string;

  @Column({ length: 15, name: 'Telefone', nullable: true })
  phone: string;

  @ManyToMany(_type => Appointment, appointment => appointment.persons)
  @JoinTable({
    name: 'PessoaAgendamento',
    joinColumn: { name: 'PessoaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'AgendamentoId', referencedColumnName: 'id' },
  })
  appointments: Appointment[];
}

export default Person;
