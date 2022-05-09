import { CreateAnimation, IonButton, IonCol, IonIcon, IonLabel, IonRow } from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import { useEffect } from "react";
import { useState } from "react";
import { ActionMessageType } from "../pages/messages/ViewMessageList";

export interface ReplyToProps {
    Contact: {name: string},
    ReplyMessage: ActionMessageType,
    replyToAnimationRef: any,
    setReplyToMessage: any,
    messageSent: any,
}


const ReplyTo: React.FC<ReplyToProps> = ({ Contact: contact, ReplyMessage: replyToMessage, 
    replyToAnimationRef, setReplyToMessage, messageSent }) => {

    const [ cancellingReplyTo, setCancellingReplyTo ] = useState(false);

    useEffect(() => {

        messageSent && cancelReplyTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ messageSent ]);

    const slideAnimation = {

        property: "transform",
        fromValue: "translateY(100px)",
        toValue: "translateY(0px)"
    }

    //  Cancel the reply-to
    const cancelReplyTo = async () => {

        setCancellingReplyTo(true);
        await replyToAnimationRef.current.animation.play();
        setCancellingReplyTo(false);
        setReplyToMessage(false);
    }

    return (
        <CreateAnimation ref={ replyToAnimationRef }
         duration={300}
         iterations={1}
         fromTo={[slideAnimation]}
         easing={"ease-in-out"}
         direction={!cancellingReplyTo ? "normal" : "reverse"}>

            <IonRow className="ion-align-items-center chat-reply-to-row" id="replyTo">
                <IonCol size="10" className="chat-reply-to-container">
                    <IonLabel className="chat-reply-to-name">{ contact }</IonLabel>
                    <IonLabel className="chat-reply-to-message">{ replyToMessage.preview }</IonLabel>
                </IonCol>

                <IonCol size="1">

                    <IonButton fill="clear" onClick={ cancelReplyTo }>
                        <IonIcon size="large" icon={ closeCircleOutline } color="primary" />
                    </IonButton>
                </IonCol>
            </IonRow>
        </CreateAnimation>
    );
}

export default ReplyTo;