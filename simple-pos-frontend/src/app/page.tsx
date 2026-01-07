'use client';

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import './index.css';

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}
