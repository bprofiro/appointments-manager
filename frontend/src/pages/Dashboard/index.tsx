import React, { useState, useEffect, FormEvent } from 'react';
import { getMonth, getYear } from 'date-fns';

import { number } from 'yup';
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

interface FilterProps {
  month: number;
  year: number;
}

interface Request {
  appointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Appointment[]>([]);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const data: FilterProps = {
    month,
    year,
  };

  const { addToast } = useToast();

  useEffect(() => {
    async function loadAppointments(): Promise<void> {
      const response = await api.get<Appointment[]>('/appointments');

      console.log(data);

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

  async function handleFilter(
    event: FormEvent<HTMLFormElement>,
  ): Promise<Appointment[] | undefined> {
    event.preventDefault();

    try {
      const response = await api.post<Appointment[]>(
        'appointments/filter',
        data,
      );

      const filterAppointment = await response.data.filter(
        appointment =>
          getMonth(appointment.date_start) === data.month &&
          getYear(appointment.date_start) === data.year,
      );

      console.log(filterAppointment);

      addToast({
        type: 'success',
        title: 'Agendamento adicionado com sucesso.',
        description: 'Você já pode consuta-lo na lista',
      });

      setAppointments(filterAppointment);

      return filterAppointment;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao filtrar agendamentos',
        description: 'Você não tem um agendamento para essa data.',
      });
    }
  }

  async function handleAppointments(): Promise<void> {
    const data = new FormData();

    try {
      const completedFiles = uploadedFiles.map(async ({ file }) => {
        data.append('appointment', file);

        await api.post('/appointments', data);
      });

      await Promise.all(completedFiles);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar agendamento',
        description: 'Você já tem um agendamento para esse horário.',
      });
    }
  }

  function submitFile(files: Appointment[]): void {
    const importedFiles = files.map(file => {
      return {
        file,
        quantity: file.quantity,
        persons: file.persons,
        dateStart: file.date_start,
        dateEnd: file.date_end,
      };
    });
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
              <form onSubmit={handleFilter}>
                <button type="submit">Consultar Agendamentos</button>
                <div>
                  <input
                    placeholder="Mês"
                    name="mes"
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                  />
                  <input
                    placeholder="Ano"
                    name="ano"
                    type="number"
                    min="2020"
                    max="2099"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                  />
                </div>
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
                  <tr style={{ justifyContent: 'center' }}>
                    <h1>Agendamento:</h1>
                  </tr>

                  <tr>
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
