import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { EstimateProvider } from "./context/EstimateContext";
import AppRoutes from "./routes";
import Loading from "./components/Loading";
import "bootstrap/dist/css/bootstrap.min.css";

function PageExperience() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const publicFeedback =
    pathname.startsWith("/services/") ||
    pathname.startsWith("/cards/") ||
    pathname === "/" ||
    pathname === "/services" ||
    pathname === "/deals";
  return publicFeedback ? (
    <ToastContainer position="bottom-right" autoClose={4500} hideProgressBar />
  ) : null;
}

function App() {
  return (
    <AuthProvider>
      <EstimateProvider>
        <Suspense fallback={<Loading />}>
          <PageExperience />
          <AppRoutes />
        </Suspense>
      </EstimateProvider>
    </AuthProvider>
  );
}

export default App;
