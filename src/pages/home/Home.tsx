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
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonGrid
  } from '@ionic/react';
  import  './Home.scss';

import { IonButton, IonButtons, IonItem, IonLabel, IonList } from "@ionic/react";
import { useAuth } from "../auth/authContext";
import React, { useRef } from 'react';
import {  IonCard, IonCardHeader,  IonCardTitle, IonCardContent, IonIcon} from '@ionic/react';
import { pin, wifi, wine, warning, walk, hardwareChip, newspaper, wallet, chatbox, contract, people } from 'ionicons/icons';
import ContactModal from '../messages/ContactModal';
 
 
const Home: React.FC<any> = ({ close: any }) => {
    const { authInfo } = useAuth()!;
	const pageRef = useRef();
    
    return (

        <IonPage ref={ pageRef }>
            <IonHeader>
            <IonToolbar>
                <IonTitle>Home</IonTitle>
            </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen>
        
                <IonGrid>
                    <IonRow className="ion-text-center">
                        <IonCol size="6">
                            <IonCard href="/profile" className="ion-activated">
                                <IonCardHeader>   
                                    <IonButton expand="full" size='large'>
                                        <IonIcon icon={hardwareChip} slot="icon-only"/>
                                    </IonButton>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonCardTitle>Profile</IonCardTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="6">
                            <IonCard href="/chats" className="ion-activated">
                                <IonCardHeader>   
                                    <IonButton expand="full" size='large'>
                                        <IonIcon icon={chatbox} slot="icon-only"/>
                                    </IonButton>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonCardTitle>Chat</IonCardTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="6">
                            <IonCard href="/feed" className="ion-activated">
                                <IonCardHeader>   
                                    <IonButton expand="full" size='large'>
                                        <IonIcon icon={newspaper} slot="icon-only"/>
                                    </IonButton>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonCardTitle>Feed</IonCardTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="6">
                            <IonCard href="/banking" className="ion-activated">
                                <IonCardHeader>   
                                    <IonButton expand="full" size='large'>
                                        <IonIcon icon={wallet} slot="icon-only"/>
                                    </IonButton>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonCardTitle>Banking</IonCardTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        <IonCol size="6">
                            <IonCard href="/contacts" className="ion-activated">
                                <IonCardHeader>   
                                    <IonButton expand="full" size='large'>
                                        <IonIcon icon={people} slot="icon-only"/>
                                    </IonButton>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonCardTitle>Address Book</IonCardTitle>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
  };
  
  export default Home;
  