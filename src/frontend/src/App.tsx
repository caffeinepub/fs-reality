import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import MyListingsPage from "./pages/MyListingsPage";
import PaymentCancelledPage from "./pages/PaymentCancelledPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PostPropertyPage from "./pages/PostPropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

// ─── Root Layout ───
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

// ─── Auth Guard ───
function useAuthGuard() {
  const { identity, isInitializing } = useInternetIdentity();
  return { isAuthenticated: !!identity, isInitializing };
}

// ─── Routes ───
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const listingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings",
  component: ListingsPage,
});

const propertyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/property/$id",
  component: PropertyDetailPage,
});

function PostPropertyGuard() {
  const { isAuthenticated, isInitializing } = useAuthGuard();
  if (isInitializing)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Login Required
          </h2>
          <p className="text-muted-foreground">
            Please login to post a property.
          </p>
        </div>
      </div>
    );
  }
  return <PostPropertyPage />;
}

function MyListingsGuard() {
  const { isAuthenticated, isInitializing } = useAuthGuard();
  if (isInitializing)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Login Required
          </h2>
          <p className="text-muted-foreground">
            Please login to view your listings.
          </p>
        </div>
      </div>
    );
  }
  return <MyListingsPage />;
}

const postPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post",
  component: PostPropertyGuard,
});

const myListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-listings",
  component: MyListingsGuard,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentCancelledRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-cancelled",
  component: PaymentCancelledPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  listingsRoute,
  propertyDetailRoute,
  postPropertyRoute,
  myListingsRoute,
  paymentSuccessRoute,
  paymentCancelledRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
