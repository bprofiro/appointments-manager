import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';

import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toast';
import formatDate from '../../utils/formatDate';

import api from '../../service/api';

import Input from '../../components/Input';

import {
  Container,
  Card,
  TableContainer,
  AnimationContainer,
  Header,
} from './styles';

interface Persons {
  id: string;
  name: string;
  birth_date: Date;
  email: string;
  phone?: string;
}

interface Appointment {
  id: string;
  quantity: string;
  locale: string;
  date_start: Date;
  date_end: Date;
  persons: Persons[];
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  useEffect(() => {
    async function loadAppointments(): Promise<void> {
      const response = await api.get<Appointment[]>('/appointments');

      const parsedAppointments = response.data.map(appointment => ({
        ...appointment,
        formattedInitialDate: formatDate(new Date(appointment.date_start)),
        formattedFinalDate: formatDate(new Date(appointment.date_end)),
      }));

      await setAppointments(parsedAppointments);

      addToast({
        type: 'success',
        title: 'Agendamentos listados com sucesso.',
        description: 'Você já pode consuta-lo na lista',
      });
    }

    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFilter(): Promise<Appointment[] | undefined> {
    const response = await api.post<Appointment[]>(
      'appointments/filter',
      formRef.current?.getData(),
    );

    setAppointments(response.data);

    return response.data;
  }

  return (
    <>
      <Header size="large">
        <header>
          <nav>
            <Link to="/import">Adicionar Agendamento</Link>
            <Link to="/update">Atualizar Agendamento</Link>

            <div>
              <Form ref={formRef} onSubmit={handleFilter}>
                <button type="submit">Consultar Agendamentos</button>
                <div>
                  <Input
                    placeholder="Mês"
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                  />
                  <Input
                    placeholder="Ano"
                    name="year"
                    type="number"
                    min="2020"
                    max="2099"
                  />
                </div>
              </Form>
            </div>
          </nav>
        </header>
      </Header>
      <Container>
        <Card>
          <header>
            <p>Listagem de Agendamentos</p>
          </header>
        </Card>

        <TableContainer>
          <table>
            <tbody>
              {appointments.map(appointment => (
                <AnimationContainer key={appointment.id}>
                  <tr style={{ justifyContent: 'center' }}>
                    <h1>Agendamento:</h1>
                  </tr>

                  <tr>
                    <td>
                      <h1>Inicio:</h1>

                      <p>{appointment.date_start}</p>
                    </td>
                    <td>
                      <h1>Encerramento:</h1>
                      <p>{appointment.date_end}</p>
                    </td>
                    <td>
                      <h1>Local: </h1>
                      <p>{appointment.locale}</p>
                    </td>
                  </tr>

                  <tr style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <h1>Pessoas agendadas:</h1>
                  </tr>

                  {appointment.persons.map(person => (
                    <tr style={{ marginTop: '20px' }}>
                      <td>
                        <h1>Nome:</h1>
                        <p>{person.name}</p>
                      </td>
                      <td>
                        <h1>Data de Nascimento:</h1>
                        <p>{person.birth_date}</p>
                      </td>
                      <td>
                        <h1>E-mail:</h1>
                        <p>{person.email}</p>
                      </td>
                      <td>
                        <h1>Telefone</h1>
                        <p>{person.phone}</p>
                      </td>
                    </tr>
                  ))}
                </AnimationContainer>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
