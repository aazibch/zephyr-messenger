import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage, { loader as rootLoader } from './pages/RootPage';
import HomePage, { loader as homeLoader } from './pages/HomePage';
import LoginPage, { action as loginAction } from './pages/Auth/LoginPage';
import SignupPage, { action as signupAction } from './pages/Auth/SignupPage';
import NewConversationPage, {
  loader as newConversationLoader,
  action as newConversationAction
} from './pages/Conversation/NewConversationPage';
import { action as logoutAction } from './pages/Auth/LogoutPage';
import ErrorPage from './pages/ErrorPage';
import { protectLoader } from './utils/auth';
import MessengerPage, {
  loader as messengerLoader,
  action as messengerAction
} from './pages/MessengerPage';
import ConversationPage, {
  loader as conversationLoader,
  action as conversationAction
} from './pages/Conversation/ConversationPage';
import NoConversationPage from './pages/Conversation/NoConversationPage';
import SettingsPage, {
  action as settingsAction
} from './pages/Settings/SettingsPage';
import NoSettingsPage from './pages/Settings/NoSettingsPage';
import ProfileSettingsPage from './pages/Settings/ProfileSettingsPage';
import AccountSettingsPage from './pages/Settings/AccountSettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
    action: loginAction,
    id: 'root',
    children: [
      {
        path: '',
        element: <HomePage />,
        loader: homeLoader,
        children: [
          {
            index: true,
            element: <LoginPage />
          },
          {
            path: 'signup',
            element: <SignupPage />,
            action: signupAction
          }
        ]
      },
      {
        path: 'messenger',
        element: <MessengerPage />,
        loader: messengerLoader,
        action: messengerAction,
        id: 'messenger',
        children: [
          {
            index: true,
            element: <NoConversationPage />
          },
          {
            path: 'new',
            id: 'new-conversation',
            element: <NewConversationPage />,
            loader: newConversationLoader,
            action: newConversationAction
          },
          {
            path: ':id',
            element: <ConversationPage />,
            loader: conversationLoader,
            action: conversationAction
          }
        ]
      },
      {
        path: 'settings',
        loader: protectLoader,
        action: settingsAction,
        element: <SettingsPage />,
        id: 'settings',
        children: [
          { index: true, element: <NoSettingsPage /> },
          { path: 'profile', element: <ProfileSettingsPage /> },
          { path: 'account', element: <AccountSettingsPage /> }
        ]
      },
      { path: 'logout', loader: protectLoader, action: logoutAction }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
