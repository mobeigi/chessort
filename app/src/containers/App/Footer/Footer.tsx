import { Color } from '../../../types/color';
import { getPieceSvg } from '../../../utils/chessUtils';
import { FooterWrapper, SocialContainer, CreatedByWrapper, IconWrapper } from './styled';
import { useTheme } from 'styled-components';
import { ThemeMode } from '../../../types/theme';
import { SvgIcon } from '../../../styles/icon';
import { DISCORD_INVITE_URL, EMAIL_ADDRESS, GITHUB_REPO_URL } from '../../../constants/socials';

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
        <a href={DISCORD_INVITE_URL} rel="external">
          <IconWrapper>
            <i className="bx bxl-discord"></i>
          </IconWrapper>
        </a>
        <a href={GITHUB_REPO_URL} rel="external">
          <IconWrapper>
            <i className="bx bxl-github"></i>
          </IconWrapper>
        </a>
        <a href={`mailto:${EMAIL_ADDRESS}`}>
          <IconWrapper>
            <i className="bx bx-envelope"></i>
          </IconWrapper>
        </a>
      </SocialContainer>
    </FooterWrapper>
  );
};
