import { Color } from '../../../types/color';
import { getPieceSvg } from '../../../utils/chessUtils';
import { FooterWrapper, CopyrightDisclaimer, CreatedByWrapper, PieceWrapper } from './styled';

export const Footer = () => {
  const authorName = 'Mo Beigi';
  const authorUrl = 'https://mobeigi.com';
  const currentYear = new Date().getFullYear();

  const theROOOOOK = getPieceSvg('R', Color.White);

  return (
    <FooterWrapper>
      <CreatedByWrapper>
        Created by&nbsp;
        <a href={authorUrl} rel="external">
          {authorName}
        </a>
        ,&nbsp;by sacrificing the&nbsp;
        <PieceWrapper src={theROOOOOK} />
        !!
      </CreatedByWrapper>
      <CopyrightDisclaimer>Copyright &copy; {currentYear}</CopyrightDisclaimer>
    </FooterWrapper>
  );
};
