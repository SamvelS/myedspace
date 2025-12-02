import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';

function AuthControls() {
  const { isLoggedIn, login, logout } = useAuth()
  return (
    <div className="Auth-bar">
        <button onClick={!isLoggedIn ? login : logout}>{!isLoggedIn ? "Log in" : "Log out"}</button>
    </div>
  )
}

function AppContent() {
  return (
    <div className="App">
      <AuthControls/>
      <div className="App-content">content</div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}

export default App;
