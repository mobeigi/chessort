import { Link } from 'react-router-dom';
import { NotFoundContainer } from './styled';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, CHESSORT_APP_BASE_URL } from '../../../constants/app';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME}: 404 Not Found</title>
        <link rel="canonical" href={`${CHESSORT_APP_BASE_URL}/404/`} />
      </Helmet>
      <NotFoundContainer>
        <h1>404 Not Found</h1>
        <p>The page you are looking for could not be found.</p>
        <p>
          <Link to="/">Visit homepage</Link>
        </p>
      </NotFoundContainer>
    </>
  );
};
