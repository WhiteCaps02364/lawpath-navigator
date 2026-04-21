import IntakeWizard from '@/components/intake/IntakeWizard';

export default function IntakePage() {
  // Dummy bypass: no auth gate — anyone routed here from auth screens lands directly on Step 1.
  return <IntakeWizard />;
}