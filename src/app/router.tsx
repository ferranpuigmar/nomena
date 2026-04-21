import { createBrowserRouter, Navigate } from 'react-router-dom';
import { BaseLayout } from './shared/layouts/base-layout';
import { HomePage } from './pages/public/home-page';
import { SearchPage } from '../features/names/pages/search-page';
import { NotFoundPage } from './pages/public/not-found-page';
import { LoginPage } from './pages/public/login-page';
import { RegisterPage } from './pages/public/register-page';
import { FavoritesPage } from '../features/favorites/pages/favorites-page';
import AccountPage from '../features/account/pages/account-page';
import { AccountProfilePage } from '../features/account/pages/account-profile-page';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'search', element: <SearchPage /> },
            {
                path: 'account',
                element: <AccountPage />,
                children: [
                    { index: true, element: <Navigate to="profile" replace /> },
                    { path: 'profile', element: <AccountProfilePage /> },
                    { path: 'favorites', element: <FavoritesPage /> },
                ],
            },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
