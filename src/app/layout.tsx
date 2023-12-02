import type { Metadata } from 'next';
import './../styling/globals.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { teemioTheme } from '@/styling/theme';
import Navbar from '@/components/navbar.component';

export const metadata: Metadata = {
  title: 'Teemio',
  description: 'Den varmeste teemio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={teemioTheme}>
        <html lang="en">
          <head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </head>
          <body>
            <div className="navbar">
              <Navbar />
            </div>
            <div className="bodycontent">{children}</div>
          </body>
        </html>
      </ThemeProvider>
    </>
  );
}
