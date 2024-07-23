import { FooterWrapper, CopyrightDisclaimer, CreatedByWrapper, PieceWrapper } from './styled';

export const Footer = () => {
  const authorName = 'Mo Beigi';
  const authorUrl = 'https://mobeigi.com';
  const currentYear = new Date().getFullYear();
  return (
    <FooterWrapper>
      <CreatedByWrapper>
        Created by&nbsp;
        <a href={authorUrl} rel="external">
          {authorName}
        </a>
        ,&nbsp;by sacrificing the&nbsp;<PieceWrapper>♖</PieceWrapper>!!
      </CreatedByWrapper>
      <CopyrightDisclaimer>Copyright &copy; {currentYear}</CopyrightDisclaimer>
    </FooterWrapper>
  );
};
