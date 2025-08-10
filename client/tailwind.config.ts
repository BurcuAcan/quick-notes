import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './**/*.{js,ts,jsx,tsx,mdx,html}',
  ],
  
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        'auto-fill-minmax-250px': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [],
};
export default config;
