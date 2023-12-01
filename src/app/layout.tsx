import type { Metadata } from 'next';
import './../styling/globals.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';

export const metadata: Metadata = {
  title: 'Teemio',
  description: 'Den varmeste teemio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <html lang="en">
        <head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </head>
        <body>{children}</body>
      </html>
    </>
  );
}
