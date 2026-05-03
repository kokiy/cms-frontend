import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/login/LoginPage'
import { RegisterPage } from '../pages/register/RegisterPage'
import { PostsPage } from '../pages/posts/PostsPage'
import { TagsPage } from '../pages/tags/TagsPage'
import { CategoriesPage } from '../pages/categories/CategoriesPage'
import { MainLayout } from '../components/layout'
import { FrontendLayout } from '../components/layout/FrontendLayout'
import { HomePage } from '../pages/home/HomePage'
import { PostDetailPage } from '../pages/post/PostDetailPage'
import { ProtectedRoute } from './ProtectedRoute'
import { storeSelector } from '../stores'

export function useAppRouter() {
  const token = storeSelector.use.token()
  const isAuthenticated = !!token

  return createBrowserRouter([
    {
      path: '/',
      element: <FrontendLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'post/:id',
          element: <PostDetailPage />,
        },
      ],
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />,
    },
    {
      path: '/register',
      element: isAuthenticated ? <Navigate to="/admin" replace /> : <RegisterPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/admin/posts" replace />,
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
