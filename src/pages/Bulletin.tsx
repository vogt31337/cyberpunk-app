import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonViewWillEnter
} from '@ionic/react';
import BulletPointLeft from '../components/BulletPointLeft';
import { useState } from 'react';
import { get, set } from '../data/IonicStorage';
import { getOffers } from '../data/offers';

import styles from './Bulletin.module.scss';

type OfferParams = {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  date?: string;
}

const Bulletin: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [offers, setMessages] = useState<OfferParams[]>([]);

  useIonViewWillEnter(async() => {
		const exists = await get("offrs");

		if (!exists) {
			const offrs = getOffers();
			set("offrs", offrs);
			setMessages(offrs);
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
		const offrs = getOffers();
		set("offrs", offrs);
		setMessages(offrs);
	}

  return (
    <IonPage className={ styles.home }>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bulletin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <div className={ styles.topHeader }></div>

        <IonList className={ styles.list }>
          {
            offers && offers.map(offer => <BulletPointLeft key={offer.id} offer={offer} />)
          }
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={loadData}
          threshold="100px"
          position="bottom"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Bulletin;
