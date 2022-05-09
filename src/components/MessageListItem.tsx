import { IonItem, IonLabel, IonNote } from '@ionic/react';
import { getContacts } from '../data/contacts';
import './MessageListItem.css';

type MessageParams = {
    id?: string;
    toId?: string;
    fromId?: string;
    date?: string;
    subject?: string;
    body?: string;
}

const MessageListItem = (props: {message: MessageParams}) => {
	//const message: MessageParams = props.message;
	const contacts = getContacts();

	return (
		<IonItem routerLink={`/message/${props.message.id}`} detail={false}>
			<div slot="start" className="dot dot-unread"></div>
			<IonLabel className="ion-text-wrap">
				<h2>
					{ contacts.filter(c => c.id === parseInt(props.message.fromId!))[0].name }
					<span className="date">
						<IonNote>{props.message.date}</IonNote>
					</span>
				</h2>
				<h3>{props.message.subject}</h3>
				<p>{props.message.body}</p>
			</IonLabel>
		</IonItem>
	);
};

export default MessageListItem;
