import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Banners from './pages/banners/Banners.tsx'
import { PageDataProvider } from './context/page-data/PageDataProvider.tsx'
import BannerCreate from './pages/banners/BannerCreate.tsx'


export default function App() {
    return (
        <CssVarsProvider
            disableTransitionOnChange
            defaultMode={'system'}
        >
            <CssBaseline />
            <PageDataProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route
                                path="banners"
                                element={<Banners />}
                            />
                             <Route 
                                 path="/banners/create"
                                 element={<BannerCreate />}
                             /> 
                            {/*<Route path="contact" element={<Contact />} />*/}
                            <Route
                                path="*"
                                element={<Navigate to={'/banners'} />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PageDataProvider>
        </CssVarsProvider>
    )
}
