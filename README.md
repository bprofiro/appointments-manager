<center>
  <img alt="GoStack" src="https://www.tripletech.com.br/wp-content/uploads/2014/08/logo-triple-160.png" />
</center>

<h3 align="center">
  Desafio Tripletech: Appointment Manager
</h3>


<div>
  <h2> :rocket: Sobre o desafio: </h2>
  
  - O projeto foi desenvolvido como um desafio para a empresa Tripletech e consiste em uma aplicação capaz de ler dados de um banco de dados
  SQL Server já existente hospedado na AWS. Ele lê os dados das tabelas de Agendamentos e de Pessoas Cadastradas no sistema e as relaciona,
  retornando o agendamento e cada pessoa pessoa cadastrada nesse agendamento ou, se o usuário desejar, ele pode filtrar os agendamentos pelo
  mês e ano.
  
    Outra funcionalidade dessa aplicação é a atualização e inserção de novos agendamentos por meio da importação de arquivos com a extensão csv.
  Com a inserção ou atualização de agendamentos, o sistema verifica se haverá conflito entre agendamentos já cadastrados pelos usuários. 
  
</div>

<div>
  <h2> 🖥 Utilizando a aplicação: </h2>

  - Para utlizar essa aplicação, você precisará do [Git](https://git-scm.com), [Node.js v10.16][nodejs] ou maior + [Yarn v1.13][yarn] ou maior
  instalado no seu computador. E então, na sua linha de comando:
  ```bash
# Clonar esse repositório
$ git clone https://github.com/bprofiro/appointments-callendar

# Entrar na pasta do repositório
$ cd appointments-callendar

# Instalar todas as dependênias
$ yarn install

# Entrar na pasta do servidor
$ cd backend

# Iniciar o servidor:
yarn dev:server;

#Sair da pasta do servidor e entrar na pasta do frontend
cd ..
cd frontend

# Iniciar o projeto:
yarn start
```
  
</div>

<div>
  <h2> :computer: Tecnologias: </h2>
   <p> Esse projeto foi desenvolvido em apenas uma linguagem: Typescript, utilizando as seguintes tecnologias:

   - [yarn](https://yarnpkg.com/)
   - [Node.js](https://nodejs.org/en/)
   - [React](https://reactjs.org/)
   - [TypeORM](https://typeorm.io/#/)
   - [SQL Server](https://docs.microsoft.com/pt-br/sql/sql-server/?view=sql-server-ver15)
   - [Axios](https://github.com/axios/axios)
   - [Polished](https://polished.js.org/)
   - [styled-components](https://www.styled-components.com/)
   - [React-Icons](https://react-icons.netlify.com/)
   
  </p>
</div>

[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
