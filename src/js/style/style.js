import { createGlobalStyle } from 'styled-components';
import { transparentize, readableColor } from 'polished';

export const permuteColorOpacities = (theme) =>
  Object.keys(theme).map((color) => {
    return (
      `--${color}: ${theme[color]};` +
      `--${color}---contrast: ${readableColor(theme[color])};` +
      Object.keys(opacities)
        .map((opacity) => {
          return `--${color}---${opacity}: ${transparentize(
            1 - opacities[opacity],
            theme[color]
          )};`;
        })
        .join("")
    );
  });

export const opacityStyles = () => Object.keys(opacities).map(opacity => `--${opacity}: ${opacities[opacity]};`).join("")

const opacities = {
  "opacity-lower": 0.1,
  "opacity-low": 0.25,
  "opacity-med": 0.5,
  "opacity-high": 0.75,
  "opacity-higher": 0.85,
  "opacity-05": 0.05,
  "opacity-10": 0.10,
  "opacity-15": 0.15,
  "opacity-20": 0.20,
  "opacity-25": 0.25,
  "opacity-30": 0.30,
  "opacity-80": 0.80,
  "opacity-90": 0.9,
};

const themeLight = {
  "link-color": "#0071DB",
  "highlight-color": "#F9A132",
  "text-highlight-color": "#ffdb8a",
  "warning-color": "#D20000",
  "confirmation-color": "#009E23",
  "header-text-color": "#322F38",
  "body-text-color": "#433F38",
  "border-color": "hsla(32, 81%, 10%, 0.08)",
  "background-plus-2": "#fff",
  "background-plus-1": "#fbfbfb",
  "background-color": "#F6F6F6",
  "background-minus-1": "#FAF8F6",
  "background-minus-2": "#EFEDEB",
  "graph-control-bg": "#f9f9f9",
  "graph-control-color": "black",
  "graph-node-normal": "#909090",
  "graph-node-hlt": "#0075E1",
  "graph-link-normal": "#cfcfcf",
  "error-color": "#fd5243", // Deprecate. Replace with "danger-color"
  "shadow-color": "#000"
}

const themeDark = {
  "link-color": "#0071DB",
  "highlight-color": "#FBBE63",
  "text-highlight-color": "#FBBE63",
  "warning-color": "#DE3C21",
  "confirmation-color": "#189E36",
  "header-text-color": "#BABABA",
  "body-text-color": "#AAA",
  "border-color": "hsla(32, 81%, 90%, 0.08)",
  "background-minus-1": "#151515",
  "background-minus-2": "#111",
  "background-color": "#1A1A1A",
  "background-plus-1": "#222",
  "background-plus-2": "#333",
  "graph-control-bg": "#272727",
  "graph-control-color": "white",
  "graph-node-normal": "#909090",
  "graph-node-hlt": "#FBBE63",
  "graph-link-normal": "#323232",
  "error-color": "#fd5243", // Deprecate. Replace with "danger-color"
  "shadow-color": "#000"
}

const lightThemeColors = permuteColorOpacities(themeLight);
const darkThemeColors = permuteColorOpacities(themeDark);

export const GlobalStyles = createGlobalStyle`
  :root {
    --zindex-dropdown: 1000;
    --zindex-sticky: 1020;
    --zindex-fixed: 1030;
    --zindex-modal-backdrop: 1040;
    --zindex-modal: 1050;
    --zindex-popover: 1060;
    --zindex-tooltip: 1070;

    --font-family-default: "IBM Plex Sans", BlinkMacSystemFont,"Segoe UI Variable","Segoe UI",system-ui,ui-sans-serif,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    --font-family-code: "IBM Plex Mono", BlinkMacSystemFont,"Segoe UI Variable","Segoe UI",system-ui,ui-sans-serif,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";

    --depth-shadow-4: 0 2px 4px rgba(0, 0, 0, 0.2);
    --depth-shadow-8: 0 4px 8px rgba(0, 0, 0, 0.2);
    --depth-shadow-16: 0 4px 16px rgba(0, 0, 0, 0.2);
    --depth-shadow-64: 0 24px 60px rgba(0, 0, 0, 0.2);

    --font-size--text-xs: 0.75rem;
    --font-size--text-sm: 0.875rem;
    --font-size--text-base: 1rem;
    --font-size--text-lg: 1.125em;
    --font-size--text-xl: 1.25rem;
    --font-size--text-2xl: 1.5rem;

    ${opacityStyles}
    ${lightThemeColors}

    .is-theme-light {
      ${lightThemeColors}
    }

    .is-theme-dark {
      ${darkThemeColors}
    }

    [class*="is-theme-"] {
      background: var(--background-color);
      color: var(--body-text-color);
    }
  }

  body {
    min-height: 100vh;
    background: var(--background-color);
    font-family: var(--font-family-default);
    color: var(--body-text-color);
    font-size: 16px;
    line-height: 1.5;
  }

  html {
    padding: 0;
    margin: 0;
    height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;