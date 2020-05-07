import styled from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div`
  width: 100%;
  max-width: 736px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 36px;
  line-height: 54px;
  color: #363f5f;
  text-align: center;
`;

export const ImportFileContainer = styled.section`
  background: #fff;
  margin-top: 40px;
  border-radius: 5px;
  padding: 64px;
`;

export const Footer = styled.section`
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
    color: #969cb3;
    img {
      margin-right: 5px;
    }
  }
  button {
    background: #256aae;
    color: #fff;
    border-radius: 5px;
    padding: 15px 80px;
    border: 0;
    transition: background-color 0.2s;
    &:hover {
      background: ${shade(0.2, '#256aae')};
    }
  }
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
    }

    a {
      width: 178px;
      text-decoration: none;
      color: #fff;
      font-size: 16px;
      transition: opacity 0.2s;
      border: none;
      background: transparent;

      &:hover {
        color: ${shade(0.2, '#fff')};
      }
    }
  }
`;
