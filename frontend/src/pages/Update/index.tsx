import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import filesize from 'filesize';

import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
  Header,
} from './styles';

import api from '../../service/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    try {
      const completedFiles = uploadedFiles.map(async ({ file }) => {
        data.append('file', file);

        await api.put('/appointments/update', data);
      });

      await Promise.all(completedFiles);

      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const importedFiles = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: filesize(file.size),
      };
    });

    setUploadedFiles(importedFiles);
  }

  return (
    <>
      <Header size="small">
        <header>
          <nav>
            <Link to="/">Listagem</Link>
            <div />
          </nav>
        </header>
      </Header>
      <Container>
        <Title>Atualizar um agendamento</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>Permitido apenas arquivos CSV</p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
