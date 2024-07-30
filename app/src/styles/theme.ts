const theme = {
  breakpoints: {
    mobile: { maxWidth: 800, maxHeight: 600 },
    tablet: { maxWidth: 1000, maxHeight: 800 },
  },
  colors: {
    dark: {
      background: '#242424',
      backgroundBlend: '#36454f',
      text: {
        base: '#e3e3e3',
        baseHighlight: '#f5f5f5',
        link: '#4e95c7',
        linkHighlight: '#5aa7cc',
      },
      status: {
        primary: {
          base: '#2b76a3',
          baseHighlight: '#5aa7cc',
          accent: '#104a63',
          complement: '#ffffff',
        },
        success: {
          base: '#4caf50',
          baseHighlight: '#60d065',
          accent: '#2e7d32',
          complement: '#ffffff',
        },
        disabled: {
          base: '#cccccc',
          baseHighlight: '#666666',
          accent: '#999999',
          complement: '#333333',
        },
      },
      container: {
        background: '#302e2b',
        accent: '#ffffff',
      },
      chessBoardDarkSquare: '#b88762',
      chessBoardLightSquare: '#edd6b0',
    },
    light: {
      background: '#e7e7e7',
      backgroundBlend: '#bccbd5',
      text: {
        base: '#404040',
        baseHighlight: '#525252',
        link: '#4e95c7',
        linkHighlight: '#5aa7cc',
      },
      status: {
        primary: {
          base: '#2b76a3',
          baseHighlight: '#5aa7cc',
          accent: '#104a63',
          complement: '#ffffff',
        },
        success: {
          base: '#4caf50',
          baseHighlight: '#60d065',
          accent: '#2e7d32',
          complement: '#ffffff',
        },
        disabled: {
          base: '#cccccc',
          baseHighlight: '#666666',
          accent: '#999999',
          complement: '#333333',
        },
      },
      container: {
        background: '#e8e8e8',
        accent: '#a1a1a1',
      },
      chessBoardDarkSquare: '#b88762',
      chessBoardLightSquare: '#edd6b0',
    },
  },
};

export default theme;
