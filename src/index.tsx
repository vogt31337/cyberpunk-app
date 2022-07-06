//import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
//import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./pages/auth/authContext";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // globally default to 20 seconds
      staleTime: 1000 * 20,
      // since v4 turned on by default:
      notifyOnChangeProps: 'tracked',
    },

  },
});

ReactDOM.render(
//  <React.StrictMode>
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <AuthProvider>
      <App />
    </AuthProvider>,
  </QueryClientProvider>,
//  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
