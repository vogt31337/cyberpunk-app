import { IonIcon } from "@ionic/react";
import { checkmarkDone, star } from "ionicons/icons";
import { ActionMessageType } from "../pages/messages/ViewMessageList";

interface ChatBottomDetailsProps {
    message: ActionMessageType,
}

const ChatBottomDetails: React.FC<ChatBottomDetailsProps> = ({ message: message }) => (

    <span className="chat-bottom-details" id={ `chatTime_${ message.id }`}>
        <span>{ message.date }</span>
        { message.sent && <IonIcon icon={ checkmarkDone } color="primary" style={{ fontSize: "0.8rem" }} /> }
        { message.starred && <IonIcon icon={ star } /> }
    </span>
);

export default ChatBottomDetails;