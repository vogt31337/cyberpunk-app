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
  IonGrid,
  IonModal,
  IonButton,
  IonButtons,
  IonInput,
  IonToast,
} from '@ionic/react';
import './Banking.css';
import QRCode from "react-qr-code";
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner';
import { useState, useRef } from 'react';
import { add, share, logoUsd, download, barcodeOutline } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import { useMutation, useQuery, useQueryClient } from "react-query";

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
  const scannerOptions: BarcodeScannerOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: false,
    showTorchButton: true,
    torchOn: false,
    prompt: 'Bitte QR code in den scan bereich halten.',
    orientation: 'portrait',
    resultDisplayDuration: 500,
    formats: 'QR_CODE'
  }

  //const modal = useRef<HTMLIonModalElement>(null);
  const input_receiver = useRef<HTMLIonInputElement>(null);
  const input_amount = useRef<HTMLIonInputElement>(null);
  const input_message = useRef<HTMLIonInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // useAuth provides context and information about the user, is required.
  const { authInfo } = useAuth()!;

  // state holding is infinite scrolling is enabled
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [ toastMessage, setToastMessage ] = useState("");
  const [ showToast, setShowToast ] = useState(false);

    //  For displaying toast messages
  const toaster = (message: string) => {
      setToastMessage(message);
      setShowToast(true);
  }

  const queryClient = useQueryClient()

  const sendMoney = useMutation((entry: BankingEntry) => 
      apiClient.put('/banking', JSON.stringify(entry)),
      {
          onSuccess: () => {
            toaster("Transaktion erfolgreich!");
            queryClient.invalidateQueries(["query-bank"]);
          },
          onError: (error) => {
            toaster("An Error happened: " + error);
          }
      }
  )

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

  const confirm = () => {
    //modal.current?.dismiss(input.current?.value, 'confirm');
    setIsOpen(false);
    //console.log('confirmed');
    const input = input_amount.current?.value;
    var amount = 0.
    if (input && typeof input === "string") {
      amount = parseFloat(input as string)
    }
    
    var name = ""
    if (input_receiver.current?.value) {
      name = input_receiver.current?.value.toString();
    }

    var reason = ""
    if (input_message.current?.value) {
      reason = input_message.current?.value?.toString();
    }

    const transaction: BankingEntry = {
      id: -1,
      name: name,
      reason: reason,
      amount: amount,
      date: new Date(),
    }
    sendMoney.mutate(transaction);
  }

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    setIsOpen(false);
    if (ev.detail.role === 'confirm') {
      //setMessage(`Hello, ${ev.detail.data}!`);
      
      console.log(`Hello, ${ev.detail.data}!`);
    }
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
              <IonIcon icon={download} onClick={() => {setIsOpen(true)}}/>
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
       
        <IonModal isOpen={isOpen} onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                {/*<IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>*/}
                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Geld Senden</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonButtons>
              <IonButton onClick={() => {const data = BarcodeScanner.scan(scannerOptions); console.log(data)}}>Scan Code</IonButton>
              {/*<IonIcon icon={barcodeOutline} onClick={() => {const data = BarcodeScanner.scan(scannerOptions); console.log(data)}}/>*/}
            </IonButtons>
            <IonItem>
              <IonLabel position="stacked">Name des Empfänger</IonLabel>
              <IonInput ref={input_receiver} type="text" placeholder="Empfänger" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nachricht an den Empfänger?</IonLabel>
              <IonInput ref={input_message} type="text" placeholder="Nachricht" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Wieviel soll Überwiesen werden?</IonLabel>
              <IonInput ref={input_amount} type="text" placeholder="100 $" />
            </IonItem>
          </IonContent>
        </IonModal>

        <IonToast color="primary" isOpen={ showToast } onDidDismiss={ () => setShowToast(false) } message={ toastMessage } position="bottom" duration={3000} />
      </IonContent>
    </IonPage>
  );
};

export default Banking;
