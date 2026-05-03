import { createBrowserRouter, Navigate } from 'react-router-dom';
import { BaseLayout } from './shared/layouts/base-layout';
import { SearchPage } from '../features/names/pages/search-page';
import { NotFoundPage } from './pages/public/not-found-page';
import { LoginPage } from './pages/public/login-page';
import { RegisterPage } from './pages/public/register-page';
import { FavoritesPage } from '../features/favorites/pages/favorites-page';
import AccountPage from '../features/account/pages/account-page';
import { AccountProfilePage } from '../features/account/pages/account-profile-page';
import { CouplePage } from '../features/couple/pages/couple-page';

export const ROUTES = {
  search: {
    path: '/search',
    pattern: '/search',
  },

  login: {
    path: '/login',
    pattern: '/login',
  },

  register: {
    path: '/register',
    pattern: '/register',
  },

  account: {
    root: {
      path: '/account',
      pattern: '/account',
    },
    profile: {
      path: '/account/profile',
      pattern: '/account/profile',
    },
    favorites: {
      path: '/account/favorites',
      pattern: '/account/favorites',
    },
    couple: {
      path: '/account/couple',
      pattern: '/account/couple',
    },
  },
  home: {
    path: '/',
    pattern: '/',
  },
} as const;


export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.search.path} replace /> },
      { path: ROUTES.search.path, element: <SearchPage /> },
      {
        path: ROUTES.account.root.path,
        element: <AccountPage />,
        children: [
          { index: true, element: <Navigate to={ROUTES.account.profile.path} replace /> },
          { path: ROUTES.account.profile.path, element: <AccountProfilePage /> },
          { path: ROUTES.account.favorites.path, element: <FavoritesPage /> },
          { path: ROUTES.account.couple.path, element: <CouplePage /> },
        ],
      },
      { path: ROUTES.login.path, element: <LoginPage /> },
      { path: ROUTES.register.path, element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);