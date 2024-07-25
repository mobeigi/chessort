import { useContext } from 'react';
import { UserPreferencesContext } from '../../context/userPreferencesContext';

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('Error during useUserPreferences init'); // TODO: When can this happen?
  }
  return context;
};
