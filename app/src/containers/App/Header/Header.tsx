import LogoSvg from '/logo.svg';
import { HeaderWrapper, Logo, Title } from './styled';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../constants/app';

export const Header = () => {
  return (
    <header>
      <Link to="/">
        <HeaderWrapper>
          <Logo src={LogoSvg} alt="Chessort Logo" />
          <Title>{APP_NAME}</Title>
        </HeaderWrapper>
      </Link>
    </header>
  );
};
