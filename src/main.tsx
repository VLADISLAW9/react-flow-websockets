import { createTheme, MantineProvider } from '@mantine/core';
import { ReactFlowProvider } from '@xyflow/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

import '@mantine/core/styles.css';
import './index.css';

const init = () => {
  const root = createRoot(document.getElementById('root')!);

  const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'cyan'
  });

  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </MantineProvider>
    </StrictMode>
  );
};

init();
