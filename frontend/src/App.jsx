import { Routes, Route } from 'react-router-dom';


import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import TopicPage from './pages/TopicPage';
import IdePage from './pages/IdePage';
import LabPage from './pages/LabPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
    return (
        <Routes>

            <Route path="/" element={<LandingPage />} />


            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />


            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <CoursesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:id"
                element={
                    <ProtectedRoute>
                        <CourseDetailPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:courseId/topics/:topicId"
                element={
                    <ProtectedRoute>
                        <TopicPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/ide"
                element={
                    <ProtectedRoute>
                        <IdePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/lab"
                element={
                    <ProtectedRoute>
                        <LabPage />
                    </ProtectedRoute>
                }
            />


            <Route path="/404" element={<NotFoundPage />} />


            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
