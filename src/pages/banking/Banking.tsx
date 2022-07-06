/* 
 * Component to show banking stuff:
 * Starts with a qrcode of your ID at the top
 * A list of all your transactions
 * A "plus" button to send money somewhere.
 */
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabList,
  IonFabButton,
  useIonViewWillEnter,
  IonGrid
} from '@ionic/react';
import './Banking.css';
import QRCode from "react-qr-code";
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { useState } from 'react';
import { add, share, logoUsd, download } from 'ionicons/icons';
import { useQuery } from "react-query";

import { useAuth } from "../auth/authContext";
import apiClient from "../../http-common";

type BankingEntry = {
  id: number
  name: string
  reason: string
  amount: number
  date: Date
}

type Bankings = ReadonlyArray<BankingEntry>

const Banking: React.FC = () => {
  // useAuth provides context and information about the user, is required.
  const { authInfo } = useAuth()!;

  // state holding is infinite scrolling is enabled
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  // react-query to synchronize with server state
  const { isLoading, isError, data, error, refetch: getAllBanking } = useQuery("query-bank", async () => {
		const data: Bankings = (await apiClient.get("/banking")).data;
    return data
	}, 
  {
		enabled: !!authInfo.id, // only fetch if authenticated
		retry: 3,               // retry at max 3 times, not infinte
		onSuccess: (res) => {
      const data: Bankings = res
			return data;
		},
		/*onError: (err) => {
			present({
				buttons: [{ text: 'hide', handler: () => dismiss() }],
				message: "Error during updating feed.",
				duration: 3000,
			});
		}*/
	});

  const loadData = (ev: any) => {
    setTimeout(() => {
      getAllBanking();
      ev.target.complete();
      if (data && data.length == 1000) {
        setInfiniteDisabled(true);
      }
    }, 500);
  }  

  const formatBalance = (balance: any) => {
    var formatter = new Intl.NumberFormat('en-GB', {
      // style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    return formatter.format(balance);
  }

  useIonViewWillEnter(() => {
    getAllBanking();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Banking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol size="12">
              <IonCardSubtitle  id={ `slide__balance` } color="medium">
                {/* Next line is working with a mapping of all data items to their amount and then reducing it into a number to be outputted */}
                {(data && (<h3>Guthaben:&nbsp;{ formatBalance(data.map(item => item.amount).reduce((acc, cur) => acc + cur)) }&nbsp;<span>$</span></h3>))}
              </IonCardSubtitle>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-text-center">
            <IonCol size="10">
              <QRCode value={authInfo.user + ":" + authInfo.id.toString()}/>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <h5>Transaktionen</h5>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonList>
          {data && data.map((item, index) => {
            return (
              <IonItem key={index}>
                <IonIcon icon={logoUsd} slot="start"/>
                <IonLabel>
                  <h2>{item.name}</h2>
                  <p>{item.date}: {item.reason}</p>
                </IonLabel>
                <IonLabel slot="end">{formatBalance(item.amount)} $</IonLabel>
              </IonItem>
            )
          })}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabList side="start">
            <IonFabButton>
              <IonIcon icon={share}/>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={download} onClick={() => {const data = BarcodeScanner.scan(); console.log(data)}}/>
            </IonFabButton>
          </IonFabList>
        </IonFab>

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
       
      </IonContent>
    </IonPage>
  );
};

export default Banking;
