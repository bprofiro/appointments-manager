import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 51px;
  height: 35px;
  border: 2px solid #fff;
  color: #232129;
  display: flex;
  flex-direction: row;
  align-items: center;
  & + div {
    margin-top: 8px;
  }

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #232129;
    &::placeholder {
      color: #666360;
    }
  }
`;
