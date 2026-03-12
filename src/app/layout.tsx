import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Providers } from '../components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turn Card Battle V2',
  description: 'Simultaneous Turn-based Card Game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body>
        {/* Providers로 감싸야 useSession()을 앱 어디서든 사용 가능 */}
        <Providers>
          <MantineProvider defaultColorScheme="dark">
            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}