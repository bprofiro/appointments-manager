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

interface Request {
  appointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function loadAppointments(): Promise<void> {
      const { data } = await api.get<Appointment[]>('/appointments');

      console.log(data);

      const parsedAppointments = data.map(appointment => ({
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

  async function handleAppointments(): Promise<void> {
    try {
      const { data } = await api.get<Appointment[]>('/appointments');

      const parsedAppointments = data.map(appointment => ({
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
                <AnimationContainer>
                  <tr className="AppointmentInfo">
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
                      <h1>Local: </h1>
                      <p>{appointment.locale}</p>
                    </td>
                  </tr>

                  <tr style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <h1>Pessoas agendadas:</h1>
                  </tr>

                  {appointment.persons.map(person => (
                    <tr className="PersonInfo" style={{ marginTop: '20px' }}>
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
