import { 
	IonContent, 
	IonHeader, 
	IonPage, 
	IonTitle, 
	IonToolbar,
	IonButtons, 
	IonButton, 
	IonIcon, 
	IonModal } from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import './Chats.css';

import { useEffect, useState } from 'react';
import ChatItem from './ChatItem';
import { useRef } from 'react';
import ContactModal from './ContactModal';
import { useAuth } from "../auth/authContext";
import apiClient from "../../http-common";
import { useQuery } from "react-query";

export type MessageItemParams = {
	id: number;
	preview: string;
	received: boolean;
	sent: boolean;
	date: string;
	read: boolean;
	starred: boolean;
}

export type ChatParams = {
	id: number;
	contact_id: number;
	chats: Array<MessageItemParams>;
	notificationCount: number;
}

export type ChatListParams = Array<ChatParams>

const Chats: React.FC = () => {
	const { authInfo } = useAuth()!;
	const pageRef = useRef();

	//const [ results, setResults ] = useState(latestChats);
	const [ showContactModal, setShowContactModal ] = useState(false);

	/*
	// can be used for searching.
	useEffect(() => {
		setResults(latestChats);
	}, [ latestChats ]);

	const search = (e: any) => {
		const searchTerm = e.target.value;
		if (searchTerm !== "") {
			const searchTermLower = searchTerm.toLowerCase();
			const newResults = latestChats.filter((chat: any) => contacts.filter((c: any) => c.id === chat.contact_id)[0].name.toLowerCase().includes(searchTermLower));
			setResults(newResults);
		} else {
			setResults(latestChats);
		}
	}*/

	// react-query to synchronize with server state
	const { isLoading, isError, data, error, refetch: getAllChats } = useQuery("query-chats", async () => {
		const data: ChatListParams = (await apiClient.get("/chats")).data;
		return data
	}, {
		enabled: !!authInfo.id, // only fetch if authenticated
		retry: 3,               // retry at max 3 times, not infinte
		onSuccess: (res) => {
		const data: ChatListParams = res
			return data;
		},
	});

	return (
		<IonPage ref={ pageRef }>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton fill="clear">Edit</IonButton>
					</IonButtons>
					<IonButtons slot="end">
						<IonButton fill="clear" onClick={ () => {setShowContactModal(true)} }>
							<IonIcon icon={ createOutline } />
						</IonButton>
					</IonButtons>
					<IonTitle>Chats</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Chats</IonTitle>
					</IonToolbar>
					{/*<IonSearchbar onIonChange={ e => search(e) } />*/}
				</IonHeader>


				{ data && data.map((chat: any, index: number) => {
                    const { chats, contact_id } = chat;
					return <ChatItem chats={ chats } contact_id={ contact_id } key={ index } />;
				})}

				<IonModal isOpen={ showContactModal } swipeToClose={ true } presentingElement={ pageRef.current } onDidDismiss={ () => setShowContactModal(false) }>
      				<ContactModal close={ () => setShowContactModal(false) } />
                </IonModal>
			</IonContent>
		</IonPage>
	);
};

export default Chats;