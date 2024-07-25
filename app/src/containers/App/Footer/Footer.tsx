import { Color } from '../../../types/color';
import { getPieceSvg } from '../../../utils/chessUtils';
import { FooterWrapper, CopyrightDisclaimer, CreatedByWrapper } from './styled';
import { useTheme } from 'styled-components';
import { ThemeMode } from '../../../types/theme';
import { SvgIcon } from '../../../styles/icon';

export const Footer = () => {
  const theme = useTheme();

  const authorName = 'Mo Beigi';
  const authorUrl = 'https://mobeigi.com';
  const currentYear = new Date().getFullYear();

  const TheROOOOOK = getPieceSvg('R', theme.mode === ThemeMode.Dark ? Color.White : Color.Black);

  return (
    <FooterWrapper>
      <CreatedByWrapper>
        Created by&nbsp;
        <a href={authorUrl} rel="external">
          {authorName}
        </a>
        ,&nbsp;by sacrificing the&nbsp;
        <SvgIcon>
          <TheROOOOOK />
        </SvgIcon>
        !!
      </CreatedByWrapper>
      <CopyrightDisclaimer>Copyright &copy; {currentYear}</CopyrightDisclaimer>
    </FooterWrapper>
  );
};
