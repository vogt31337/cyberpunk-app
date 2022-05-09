import { 
  IonApp,
  IonButtons,
  IonContent, 
  IonFab, 
  IonFabButton, 
  IonMenu, 
  IonHeader,
  IonIcon,
  IonInfiniteScroll, 
  IonInfiniteScrollContent, 
  IonItem,
  IonLabel,
  IonList,  
  IonMenuButton,  
  IonPage, 
  IonSearchbar, 
  IonTitle, 
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import MessageListItem from '../components/MessageListItem';
import { add, mailUnread, mail, paperPlane, heart, archive, trash, warning } from 'ionicons/icons';
import { useState } from 'react';
import { get, set } from '../data/IonicStorage';
import { getMessages } from '../data/mail_messages';

import styles from './Mail.module.scss';

type MessageParams = {
  id?: string;
  toId?: string;
  fromId?: string;
  date?: string;
  subject?: string;
  body?: string;
}

const Mail: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState<MessageParams[]>([]);

	useIonViewWillEnter(async() => {
		const exists = await get("mail_msgs");

		if (!exists) {
			const msgs = getMessages();
      console.log(msgs);
			set("mail_msgs", msgs);
			setMessages(msgs);
		} else {
			setMessages(exists);
		}
	});

  const loadData = (e: any) => {
		resetStore();
		setTimeout(() => {
			e.target.complete();
      if (data.length == 1000) {
        setInfiniteDisabled(true);
      }
		}, 500);
	};

	const resetStore = async () => {
		const msgs = getMessages();
    console.log(msgs);
		set("mail_msgs", msgs);
		setMessages(msgs);
	}

  return (
    <IonApp>
      <IonMenu side="start" content-id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <IonList>
          <IonItem>
            <IonIcon icon={mail} slot="start"></IonIcon>
            <IonLabel>Inbox</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={paperPlane} slot="start"></IonIcon>
            <IonLabel>Outbox</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={heart} slot="start"></IonIcon>
            <IonLabel>Favorites</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={archive} slot="start"></IonIcon>
            <IonLabel>Archived</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={trash} slot="start"></IonIcon>
            <IonLabel>Trash</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={warning} slot="start"></IonIcon>
            <IonLabel>Spam</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>

    <IonPage className={ styles.home }id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
              {/*<IonButton slot="primary" onClick={() => setInfiniteDisabled(!isInfiniteDisabled)} expand="block">
                Toggle Infinite Scroll
                </IonButton>*/}
            </IonButtons>
            <IonTitle size="large">Inbox</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
          </IonToolbar>
        </IonHeader>

      <IonContent fullscreen>

        <IonList>
          {
            messages && messages.map(m => <MessageListItem key={m.id} message={m} />)
          }
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={loadData}
          threshold="100px"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
    </IonApp>
  );
};

export default Mail;