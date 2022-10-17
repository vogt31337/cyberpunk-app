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
    IonToolbar
  } from '@ionic/react';
  import  './Contacts.scss';

import { useAuth } from "../auth/authContext";
import React, { useRef } from 'react';
 

const Contacts: React.FC<any> = ({ close: any }) => {
    const { authInfo } = useAuth()!;
	const pageRef = useRef();
    
    return (

        <IonPage ref={ pageRef }>
            <IonHeader>
            <IonToolbar>
                <IonTitle>Contacts</IonTitle>
            </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen>
            Johanna
            </IonContent>
        </IonPage>
    );
  };
  
  export default Contacts;
  