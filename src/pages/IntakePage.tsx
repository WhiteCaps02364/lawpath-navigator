import { useEffect, useRef, useState } from 'react';
import IntakeWizard from '@/components/intake/IntakeWizard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function IntakePage() {
  return (
    <ProtectedRoute>
      <IntakeWizard />
    </ProtectedRoute>
  );
}