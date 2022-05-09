import { IonBadge, IonLabel, IonImg, IonAvatar, IonItem } from "@ionic/react";

import "./MessageItem.css";

type MessageItemParams = {
    id: number;
    avatar?: string;
    name?: string;
    message?: string;
    last_message_sent?: number;
    new_message_count: number;
}

const MessageItem = (props: {message: MessageItemParams}) => {

    return (
        <IonItem routerLink={`/message/${props.message.id}`} lines="none" className="message-item">
            <IonItem lines="none" className="message-item">
                <IonAvatar className="avatar">
                    <IonImg src={ props.message.avatar } />
                </IonAvatar>

                <IonLabel className="contact-details">
                    <h2>{ props.message.name }</h2>
                    <p>{ props.message.message }</p>
                </IonLabel>

                <div className="stats">
                    <p className="last-online">
                        { props.message.last_message_sent } min
                    </p>
                    { props.message.new_message_count > 0 && 
                        <IonBadge color="primary">
                            { props.message.new_message_count }
                        </IonBadge> 
                    }
                </div>

            </IonItem>
        </IonItem>
    );
}

export default MessageItem;