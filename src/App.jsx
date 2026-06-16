import './index.css';
import { useSession } from './hooks/useSession';
import { useHistory } from './hooks/useHistory';
import SetupBar from './components/SetupBar';
import ModeSelector from './components/ModeSelector';
import TargetInput from './components/TargetInput';
import ProgressBar from './components/ProgressBar';
import TargetAlert from './components/TargetAlert';
import StatsCards from './components/StatsCards';
import TallyBoard from './components/TallyBoard';
import ActionButton from './components/ActionButton';
import ControlButtons from './components/ControlButtons';
import ReferenceTable from './components/ReferenceTable';
import HistoryLog from './components/HistoryLog';

export default function App() {
  const { history, addSession } = useHistory();
  const session = useSession(addSession);

  return (
    <div id="app-root">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <span className="app-logo">RodTally</span>
          <span className="app-subtitle">Iron Rod Counter</span>
        </header>

        {/* Setup Zone */}
        <SetupBar
          selectedMaterial={session.selectedMaterial}
          onMaterialChange={session.setSelectedMaterial}
          saleType={session.saleType}
          onSaleTypeChange={session.setSaleType}
        />

        {/* Mode Zone */}
        <ModeSelector
          mode={session.countMode}
          onModeChange={session.setCountMode}
        />

        {/* Target Zone */}
        {session.countMode === 'target' && (
          <TargetInput
            value={session.targetValue}
            type={session.targetType}
            onValueChange={session.setTargetValue}
            onTypeChange={session.setTargetType}
          />
        )}

        {/* Stats Zone */}
        <StatsCards
          bundleCount={session.bundleCount}
          pieces={session.pieces}
          tons={session.tons}
        />

        {/* Progress Zone (Target Mode only) */}
        {session.countMode === 'target' && (
          <ProgressBar
            current={session.targetType === 'pieces' ? session.pieces : parseFloat(session.tons)}
            target={session.targetValue}
            type={session.targetType}
          />
        )}

        {/* Alert Zone (Target Mode reached) */}
        <TargetAlert
          reached={session.targetReached}
          current={session.targetType === 'pieces' ? session.pieces : session.tons}
          target={session.targetValue}
          type={session.targetType}
        />

        {/* Tally Zone */}
        <TallyBoard bundleCount={session.bundleCount} />

        {/* Action Zone */}
        <ActionButton 
          onCount={session.countBundle} 
          reached={session.targetReached}
        />

        {/* Control Zone */}
        <ControlButtons
          bundleCount={session.bundleCount}
          tons={session.tons}
          onUndo={session.undo}
          onReset={session.reset}
        />

        <hr className="section-divider" />

        {/* Reference Zone */}
        <ReferenceTable
          selectedMaterial={session.selectedMaterial}
          saleType={session.saleType}
        />

        <hr className="section-divider" style={{ marginTop: '20px' }} />

        {/* History Zone */}
        <HistoryLog history={history} />
      </div>
    </div>
  );
}
