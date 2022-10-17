import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLoading,
  useIonToast,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { hardwareChip, logoUsd, fileTray, wallet, newspaper, chatbox, home } from 'ionicons/icons';
import Banking from './pages/banking/Banking';
import Feed from './pages/feed/Feed';
import Profile from './pages/profile/Profile';
import Chats from './pages/messages/Chats';
import ViewMessageList from './pages/messages/ViewMessageList';
import { LoginPage } from './pages/auth/LoginPage';
import { useEffect } from 'react';
import { createStore, get, set } from './data/IonicStorage';
import { getMessages } from './data/mail_messages';
import { getOffers } from './data/offers';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Auth
import { useAuth } from "./pages/auth/authContext";
import Home from './pages/home/Home';

const App: React.FC = () => {
  const { authInfo, initialize } = useAuth()!;

  useEffect(() => {

		const setupMessageStore = async () => {
			await createStore("AlansDB");

			const existsMessages = await get("msgs");

			if (!existsMessages) {
				const msgs = getMessages();
				set("msgs", msgs);
			}

      const existsOffers = await get("offrs");

      if (!existsOffers) {
				const offrs = getOffers();
				set("offrs", offrs);
			}
		}

		setupMessageStore();

    !authInfo?.initialized && (async () => await initialize())();
	}, [authInfo, initialize]);

  if (!authInfo || !authInfo.initialized) {
    return (
      <IonApp>
        <IonLoading isOpen={true} />
      </IonApp>
    );
  } else {
    return (
      <IonApp>
        <>
        {authInfo?.loggedIn === true ? (
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect from="/" to="/home" exact />
                <Route exact path="/home" component={Home} />
                <Route exact path="/chats" component={Chats} />
                <Route exact path="/banking" component={Banking} />
                <Route exact path="/feed" component={Feed} />
                <Route path="/profile" component={Profile} />
                <Route path="/profile/:contact_id" component={Profile} />
                {/*<Route path="/message/:id" component={ViewMessage} />*/}
                <Route path="/view-chat/:contact_id" component={ ViewMessageList } />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="Home" href="/home">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Banking" href="/banking">
                  <IonIcon icon={wallet} />
                  <IonLabel>Banking</IonLabel>
                </IonTabButton>
                <IonTabButton tab="chats" href="/chats">
                  <IonIcon icon={chatbox} />
                  <IonLabel>Chats</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Feed" href="/feed">
                  <IonIcon icon={newspaper} />
                  <IonLabel>Feed</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                  <IonIcon icon={hardwareChip} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
          ) : (
            <IonReactRouter>
              <Route exact path="/login" component={LoginPage} />
              <Redirect from="/" to="/login" exact />
            </IonReactRouter>
          )}
        </>
      </IonApp>
    );
  }
}

export default App;

/*
              <Route path="/message/:id">
                <ViewMessage />
              </Route>
*/