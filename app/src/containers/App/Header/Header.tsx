import LogoSvg from '/logo.svg';
import { HeaderWrapper, Logo, Title } from './styled';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header>
      <Link to="/">
        <HeaderWrapper>
          <Logo src={LogoSvg} alt="Chessort Logo" />
          <Title>Chessort</Title>
        </HeaderWrapper>
      </Link>
    </header>
  );
};
