import { useCallback } from 'react';
import LogoSvg from '/logo.svg';
import { HeaderWrapper, Logo, Title } from './styled';
import { useLoadGame } from '../../../hooks/useLoadGame';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GameApiResponse } from '../../../services/chessortServer';

export const Header = () => {
  const navigate = useNavigate();
  const onLoadGameSuccess = useCallback(
    (game: GameApiResponse) => {
      // Populate browser navigation history
      navigate(`/puzzle/${game.gameId}`);
    },
    [navigate],
  );

  const { loadGame, isLoadingGame } = useLoadGame({
    onSuccess: onLoadGameSuccess,
  });

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
