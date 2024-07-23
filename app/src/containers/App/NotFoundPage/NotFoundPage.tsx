import { Link } from 'react-router-dom';
import { NotFoundContainer } from './styled';

export const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for could not be found.</p>
      <p>
        <Link to="/">Visit homepage</Link>
      </p>
    </NotFoundContainer>
  );
};
