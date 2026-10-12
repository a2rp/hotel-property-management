import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import ScrollToTop from "./components/scrollToTop";

const Overview = lazy(() => import("./pages/overview"));
const Reservations = lazy(() => import("./pages/reservations"));
const Rooms = lazy(() => import("./pages/rooms"));
const NotFound = lazy(() => import("./pages/notFound"));

const AppRoutes = (props) => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Suspense key={location.pathname} fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview {...props} />} />
          <Route path="/reservations" element={<Reservations {...props} />} />
          <Route path="/rooms" element={<Rooms {...props} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
