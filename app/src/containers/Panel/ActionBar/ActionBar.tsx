import useThemeMode from '../../../hooks/useThemeMode';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ThemeMode } from '../../../types/theme';
import { DarkModeSwitchWrapper } from './styled';

export const ActionBar = () => {
  const { mode, toggleThemeMode } = useThemeMode();
  return (
    <div>
      <DarkModeSwitchWrapper $mode={mode}>
        <DarkModeSwitch
          checked={mode == ThemeMode.Dark}
          onChange={() => toggleThemeMode()}
          size={'1.5em'}
          sunColor={'#f8de26'}
          moonColor={'#f5f5f5'}
        />
      </DarkModeSwitchWrapper>
    </div>
  );
};
