import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import { LivestreamViewer } from "./components/LivestreamViewer";
import { YouTubePlayer } from "./components/YouTubePlayer";

function AuthControls() {
  const { isLoggedIn, login, logout } = useAuth();
  return (
    <div className="Auth-bar">
      <button onClick={!isLoggedIn ? login : logout}>
        {!isLoggedIn ? "Log in" : "Log out"}
      </button>
    </div>
  );
}

function AppContent() {
  return (
    <div className="App">
      <AuthControls />
      <div>
        <AuthGuard notAuthenticatedMessage="Please log in">
          <LivestreamViewer VideoPlayer={YouTubePlayer} videoId="Q89Dzox4jAE" />
        </AuthGuard>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
