import { Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import ProtectedRoute from "../shared/protectedRouter/protectedRouter";
import SignInPage from "../pages/SignInPage";
import MainPage from "../pages/MainPage";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute redirectTo="/sign-in">
            <MainPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
