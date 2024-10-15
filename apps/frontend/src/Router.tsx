import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Messages from './pages/messages';
import Profile from './pages/profile';
import Login from './pages/login';
import Signup from './pages/signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import UserPage from './pages/userPage';
import Explore from './pages/Explore';

const Router: FC = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path='/' element={<Login />} ></Route>
                <Route path='/signup' element={<Signup />} ></Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/home' element={<Home />} ></Route>
                <Route path='/messages' element={<Messages />} ></Route>
                <Route path='/profile' element={<Profile />} ></Route>
                <Route path='/user/:userId' element={<UserPage />}></Route>
                <Route path='/explore' element={<Explore />}></Route>
                </Route>
            </Routes>
        </AuthProvider>
    )
}

export default Router