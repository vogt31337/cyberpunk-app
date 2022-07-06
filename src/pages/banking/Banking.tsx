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
  IonButton,
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
import { useState } from 'react';
import { add, share, addOutline, arrowDown, logoUsd, download } from 'ionicons/icons';
import { useQuery } from "react-query";
import apiClient from "../http-common";

const Banking: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [searchText, setSearchText] = useState('');

  const formatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  const { isLoading: isLoadingPosts, refetch: getAllBanking } = useQuery("query-bank", async () =>{
		return await apiClient.get("/banking");
	}, {
		enabled: !!authInfo.id,
		retry: 3,
		onSuccess: (res) => {
			const result = {
				status: res.status + "-" + res.statusText,
				headers: res.headers,
				data: res.data,
			};
			setData(res.data);
		},
		onError: (err) => {
			present({
				buttons: [{ text: 'hide', handler: () => dismiss() }],
				message: "Error during updating feed.",
				duration: 3000,
			});
		}
	});


  const pushData = () => {
    const max = data.length + 20;
    const min = max - 20;
    const newData = [];
    for (let i = min; i < max; i++) {
      newData.push('Item' + i);
    }

    setData([
      ...data,
      ...newData
    ]);
  }
  
  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData();
      console.log('Loaded data');
      ev.target.complete();
      if (data.length == 1000) {
        setInfiniteDisabled(true);
      }
    }, 500);
  }  

  const formatBalance = (balance: any) => {
    var formatter = new Intl.NumberFormat('en-GB', {
      // style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  
    return formatter.format(balance);
  }

  useIonViewWillEnter(() => {
    pushData();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Banking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/*<IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Banking</IonTitle>
          </IonToolbar>
        </IonHeader>
  <ExploreContainer name="Banking page" />*/}
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol size="12">
              <IonCardSubtitle  id={ `slide__balance` } color="medium">
                <h3>Guthaben:&nbsp;{ formatBalance(-100.0) }&nbsp;<span>$</span></h3>
              </IonCardSubtitle>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-text-center">
            <IonCol size="10">
              <QRCode value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"/>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <h5>Transaktionen</h5>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonList>
          {data.map((item, index) => {
            return (
              <IonItem key={index}>
                <IonIcon icon={logoUsd} slot="start"/>
                <IonLabel>
                  <h2>Johnny Silverhand</h2>
                  <p>{item}</p>
                </IonLabel>
                <IonLabel slot="end">-1.000.000 $</IonLabel>
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
              <IonIcon icon={download}/>
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
