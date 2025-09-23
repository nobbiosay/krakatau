import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputKerenceng from "./pages/InputKerenceng";
import InputCidanau from "./pages/InputCidanau";
import DataKerenceng from "./pages/DataKerenceng";
import DataCidanau from "./pages/DataCidanau";
import RekapData from "./pages/RekapData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/input/kerenceng"
              element={
                <ProtectedRoute>
                  <InputKerenceng />
                </ProtectedRoute>
              }
            />
            <Route
              path="/input/cidanau"
              element={
                <ProtectedRoute>
                  <InputCidanau />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data/kerenceng"
              element={
                <ProtectedRoute>
                  <DataKerenceng />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data/cidanau"
              element={
                <ProtectedRoute>
                  <DataCidanau />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rekap-data"
              element={
                <ProtectedRoute>
                  <RekapData />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
