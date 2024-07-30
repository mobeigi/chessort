import { Color } from '../../../types/color';
import { getPieceSvg } from '../../../utils/chessUtils';
import { FooterWrapper, SocialContainer, CreatedByWrapper, IconWrapper } from './styled';
import { useTheme } from 'styled-components';
import { ThemeMode } from '../../../types/theme';
import { SvgIcon } from '../../../styles/icon';

export const Footer = () => {
  const theme = useTheme();

  const authorName = 'Mo Beigi';
  const authorUrl = 'https://mobeigi.com';

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
      <SocialContainer>
        <IconWrapper data-tooltip-id={`base-tooltip`} data-tooltip-content={'Visit our Discord'}>
          <i className="bx bxl-discord"></i>
        </IconWrapper>
        <IconWrapper data-tooltip-id={`base-tooltip`} data-tooltip-content={'Checkout source on Github'}>
          <i className="bx bxl-github"></i>
        </IconWrapper>
        <IconWrapper data-tooltip-id={`base-tooltip`} data-tooltip-content={'Contact Us'}>
          <i className="bx bx-envelope"></i>
        </IconWrapper>
      </SocialContainer>
    </FooterWrapper>
  );
};
