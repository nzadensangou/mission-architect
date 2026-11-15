import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { useMissionStore } from './store/missionStore'
import HomePage from './pages/HomePage'
import ActiveMissionPage from './pages/ActiveMissionPage'
import NewMissionPage from './pages/NewMissionPage'
import BriefingPage from './pages/BriefingPage'
import LauncherPage from './pages/LauncherPage'
import BuilderPage from './pages/BuilderPage'
import SimulationPage from './pages/SimulationPage'
import ResultPage from './pages/ResultPage'
import OptionsPage from './pages/OptionsPage'
import QuitPage from './pages/QuitPage'
import SessionEndedPage from './pages/SessionEndedPage'

function RequireMission({ children }: { children: JSX.Element }) {
  const mission = useMissionStore((state) => state.mission)
  return mission ? children : <Navigate to="/mission-en-cours" replace />
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mission-en-cours" element={<ActiveMissionPage />} />
        <Route path="/nouvelle-mission" element={<NewMissionPage />} />
        <Route path="/briefing/:missionId" element={<BriefingPage />} />
        <Route path="/lanceur/:missionId" element={<LauncherPage />} />
        <Route
          path="/construction/:missionId"
          element={
            <RequireMission>
              <BuilderPage />
            </RequireMission>
          }
        />
        <Route
          path="/simulation/:missionId"
          element={
            <RequireMission>
              <SimulationPage />
            </RequireMission>
          }
        />
        <Route
          path="/resultat/:missionId"
          element={
            <RequireMission>
              <ResultPage />
            </RequireMission>
          }
        />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/quitter" element={<QuitPage />} />
        <Route path="/session-terminee" element={<SessionEndedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}
