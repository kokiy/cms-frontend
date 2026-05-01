import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/login/LoginPage'
import { RegisterPage } from '../pages/register/RegisterPage'
import { PostsPage } from '../pages/posts/PostsPage'
import { TagsPage } from '../pages/tags/TagsPage'
import { CategoriesPage } from '../pages/categories/CategoriesPage'
import { MainLayout } from '../components/layout'
import { ProtectedRoute } from './ProtectedRoute'
import { storeSelector } from '../stores'

export function useAppRouter() {
  const token = storeSelector.use.token()
  const isAuthenticated = !!token

  return createBrowserRouter([
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/posts" replace /> : <LoginPage />,
    },
    {
      path: '/register',
      element: isAuthenticated ? <Navigate to="/posts" replace /> : <RegisterPage />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/posts" replace />,
        },
        {
          path: 'posts',
          element: <PostsPage />,
        },
        {
          path: 'tags',
          element: <TagsPage />,
        },
        {
          path: 'categories',
          element: <CategoriesPage />,
        },
      ],
    },
  ])
}
