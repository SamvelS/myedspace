import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthGuard } from './components/AuthGuard';

function AuthControls() {
  const { isLoggedIn, login, logout } = useAuth()
  return (
    <div className='Auth-bar'>
        <button onClick={!isLoggedIn ? login : logout}>{!isLoggedIn ? 'Log in' : 'Log out'}</button>
    </div>
  )
}

function AppContent() {
  return (
    <div className='App'>
      <AuthControls/>
      <div className='App-content'>
        <AuthGuard notAuthenticatedMessage='Please log in'>
          <div>content</div>
        </AuthGuard>
      </div>
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
