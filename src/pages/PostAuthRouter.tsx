import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function PostAuthRouter() {
  // Dummy bypass: skip all session logic and go straight to intake.
  return <Navigate to="/intake" replace />;
}