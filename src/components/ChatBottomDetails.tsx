import { IonIcon } from "@ionic/react";
import { checkmarkDone, star } from "ionicons/icons";
import { MessageItemParams } from "../pages/messages/Chats";

interface ChatBottomDetailsProps {
    message: MessageItemParams,
}

const ChatBottomDetails: React.FC<ChatBottomDetailsProps> = ({ message: message }) => (

    <span className="chat-bottom-details" id={ `chatTime_${ message.id }`}>
        <span>{ message.date }</span>
        { message.sent && <IonIcon icon={ checkmarkDone } color="primary" style={{ fontSize: "0.8rem" }} /> }
        { message.starred && <IonIcon icon={ star } /> }
    </span>
);

export default ChatBottomDetails;