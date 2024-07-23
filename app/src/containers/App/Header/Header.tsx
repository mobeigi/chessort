import LogoSvg from '/logo.svg';
import { HeaderWrapper, Logo, Title } from './styled';
import { useLoadGame } from '../../../hooks/useLoadGame';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { loadGame, isLoadingGame } = useLoadGame();

  const headerOnClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Only load a new game if we're not already loading one
    if (!isLoadingGame) {
      loadGame();
    }
  };

  return (
    <Link to="/" onClick={headerOnClick}>
      <HeaderWrapper>
        <Logo src={LogoSvg} alt="Chessort Logo" />
        <Title>Chessort</Title>
      </HeaderWrapper>
    </Link>
  );
};
