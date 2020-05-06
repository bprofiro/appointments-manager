import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Header = styled.div<ContainerProps>`
  background: #4864e6;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: flex-end;

    nav {
      display: flex;
      justify-content: center;
      align-items: flex-start;

      form {
        display: flex;
        flex-direction: column;
        align-items: center;

        input {
          width: 175px;
          height: 35px;
          border-radius: 5px;
        }

        button {
          margin-bottom: 8px;
        }
      }
    }
  }

  button {
    width: 178px;
    color: #fff;
    font-size: 16px;
    transition: opacity 0.2s;
    border: none;
    background: transparent;

    &:hover {
      color: ${shade(0.2, '#fff')};
    }
  }
`;

export const Card = styled.div`
  width: 354px;
  height: 156px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -130px;
  background: #fff;
  padding: 22px 32px;
  border-radius: 5px;
  color: #363f5f;

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 16px;
    font-weight: 500;
  }

  h1 {
    margin-top: 14px;
    font-size: 36px;
    font-weight: 400;
    line-height: 54px;
  }
`;

export const TableContainer = styled.div`
  width: 1120px;
  margin-top: 64px;

  table {
    width: 1120px;
    height: 66px;
    border-spacing: 0 8px;
  }
`;

export const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.tr`
  width: 1120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  padding: 20px 32px;
  border-radius: 5px;
  margin-bottom: 22px;

  animation: ${appearFromLeft} 1s;

  tr {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & + tr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }
  }

  h1 {
    font-size: 18px;
    font-weight: 500;
    color: #363f5f;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    color: #969cb3;
  }

  button {
    color: #4865e6;
    font-size: 16px;
    transition: opacity 0.2s;
    border: none;
    background: transparent;
    &:hover {
      color: ${shade(0.2, '#4865E6')};
    }
  }
`;
