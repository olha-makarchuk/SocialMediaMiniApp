import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import { useAuth } from "../hooks/useAuth";
import Feed from "../pages/Feed/Feed";
import CreatePost from "../components/Post/CreatePost";
import PostDetail from "../pages/PostDetail/PostDetail";
import Profile from "../pages/Profile/Profile";
import EditPost from "../components/Post/EditPost";
import EditProfile from "../pages/Profile/EditProfile";

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:profileId"
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <EditProfile/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/postdetail/:postId"
            element={
              <ProtectedRoute>
                <PostDetail/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/postedit/:postId"
            element={
              <ProtectedRoute>
                <EditPost/>
              </ProtectedRoute>
            }
          />

          <Route
            index
            element={
              isAuthenticated ? (
                <Navigate to="/feed" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <Login />
          }
        />
        <Route
          path="/registration"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <Register />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
