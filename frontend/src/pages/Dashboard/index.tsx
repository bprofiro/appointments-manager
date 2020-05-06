import React, { useState, useEffect } from 'react';

import { useToast } from '../../hooks/toast';
import formatDate from '../../utils/formatDate';

import api from '../../service/api';

import {
  Container,
  Card,
  TableContainer,
  AnimationContainer,
  Header,
} from './styles';

interface ContainerProps {
  size?: 'small' | 'large';
}

interface Persons {
  id: string;
  name: string;
  birth_date: Date;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  quantity: string;
  locale: string;
  date_start: Date;
  date_end: Date;
  persons: Persons[];
}

interface Request {
  appointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function loadAppointments(): Promise<void> {
      const { data } = await api.get<Request>('/appointments');

      console.log(data.appointments);

      const parsedAppointments = data.appointments;

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

  async function handleAppointments(): Promise<void> {
    try {
      const { data } = await api.get<Request>('/appointments');

      const parsedAppointments = data.appointments.map(appointment => ({
        ...appointment,
        formattedInitialDate: formatDate(new Date(appointment.date_start)),
        formattedFinalDate: formatDate(new Date(appointment.date_end)),
      }));

      await setAppointments(parsedAppointments);

      addToast({
        type: 'success',
        title: 'Agendamento adicionado com sucesso.',
        description: 'Você já pode consuta-lo na lista',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar agendamento',
        description: 'Você já tem um agendamento para esse horário.',
      });
    }
  }

  return (
    <>
      <Header size="large">
        <header>
          <nav>
            <button onClick={handleAppointments} type="submit">
              Adicionar Agendamentos
            </button>

            <div>
              <form>
                <button type="submit">Consultar Agendamentos</button>
                <input placeholder="foo" name="foo" type="Month" />
              </form>
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
                  <button type="submit">Atualizar</button>
                  <td>
                    <h1>Inicio:</h1>

                    <p>{appointment.date_start}</p>
                  </td>
                  <td>
                    <h1>Encerramento:</h1>
                    <p>{appointment.date_end}</p>
                  </td>
                  <td>
                    <h1>Quantidade: </h1>
                    <p>{appointment.quantity}</p>
                  </td>
                  <td>
                    <h1>ID: </h1>
                    <p>{appointment.id}</p>
                  </td>
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
