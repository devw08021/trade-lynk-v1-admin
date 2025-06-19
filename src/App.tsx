// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import MainLayout from './layouts/MainLayout';
// import Dashboard from './pages/Dashboard';
// import './styles/globals.css';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <MainLayout>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             {/* Add more routes as we build them */}
//           </Routes>
//         </MainLayout>
//       </Router>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }
