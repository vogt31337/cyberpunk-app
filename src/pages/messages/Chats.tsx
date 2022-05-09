import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, IonItem, IonModal } from '@ionic/react';
import { checkmarkDone, createOutline } from 'ionicons/icons';
import './Chats.css';

import ChatStore from './store/ChatStore';
import ContactStore from './store/ContactStore';
import { getContacts, getChats } from './store/Selectors';
import { useEffect, useState } from 'react';
import ChatItem from './ChatItem';
import { useRef } from 'react';
import ContactModal from './ContactModal';

export type MessageItemParams = {
	id: number;
	preview: string;
	received: boolean;
	sent: boolean;
	date: string;
	read: boolean;
	starred: boolean;
}

const Chats: React.FC = () => {

	const pageRef = useRef();
	const contacts = ContactStore.useState(getContacts);
	const latestChats = ChatStore.useState(getChats);

	const [ results, setResults ] = useState(latestChats);
	const [ showContactModal, setShowContactModal ] = useState(false);

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
	}

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
					<IonSearchbar onIonChange={ e => search(e) } />
				</IonHeader>


				{ results.map((chat: any, index: number) => {
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