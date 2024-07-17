import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root: ReactDOM.Root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <FluentProvider theme={webLightTheme}>
                <App />
            </FluentProvider>
        </QueryClientProvider>
    </React.StrictMode>
);