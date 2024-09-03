const breakpoints = {
  desktop: "1024px",
  mobile: "500px",
};

const media = {
  desktop: (...args) => css`
    @media (min-width: ${breakpoints.desktop}) {
      ${css(...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: ${breakpoints.mobile}) {
      ${css(...args)}
    }
  `,
};

const theme = {
  media,
};

export default theme;
