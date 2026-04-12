import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/login/LoginPage'
import { PostsPage } from '../pages/posts/PostsPage'
import { TagsPage } from '../pages/tags/TagsPage'
import { MainLayout } from '../components/layout'
import { ProtectedRoute } from './ProtectedRoute'
import { storeSelector } from '../stores'

export function useAppRouter() {
  const isAuthenticated = storeSelector.use.isAuthenticated()

  return createBrowserRouter([
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/posts" replace /> : <LoginPage />,
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
      ],
    },
  ])
}
