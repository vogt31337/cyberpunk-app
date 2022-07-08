import { 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonHeader, 
    IonIcon, 
    IonPage, 
    IonRow, 
    IonText, 
    IonTextarea, 
    IonTitle, 
    IonToolbar, 
    CreateAnimation, 
    createGesture, 
    useIonViewWillEnter, 
    IonActionSheet, 
    IonToast } from "@ionic/react";
import { addOutline, alertOutline, send, shareOutline, starOutline, trashOutline } from "ionicons/icons";
import { SetStateAction, useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../auth/authContext";
import apiClient from "../../http-common";

import { useLongPress } from 'react-use';
import ReplyTo, { ReplyToProps } from "../../components/ReplyTo";
import ChatBottomDetails from "../../components/ChatBottomDetails";
import ChatRepliedQuote from "../../components/ChatRepliedQuote";
import { GestureConfig, GestureDetail, TextareaChangeEventDetail } from "@ionic/core";
import "./ViewMessageList.css"
import { ContactsParams, ContactParams } from "./ChatItem";
import { MessageItemParams, ChatParams } from "./Chats";

export type MessageListParams = {
    contact_id: string;
}

export type ReplyToMessageType = {
    contact_id: number,
    message: string, 
    replyToMessage_id: number | undefined,
    image: string | null
}

type ChatsByContactParams = Array<MessageItemParams>;

const ViewMessageList: React.FC = () => {
    const params = useParams<MessageListParams>();
    const { authInfo } = useAuth()!;
    
    // react-query to synchronize with server state
    const { data: contacts, refetch: getAllContacts } = useQuery("query-contacts", async () => {
        const data: ContactsParams = (await apiClient.get("/contacts")).data;
    return data
    }, {
        enabled: !!authInfo.id, // only fetch if authenticated
        retry: 3,               // retry at max 3 times, not infinte
        onSuccess: (res) => {
        const data: ContactsParams = res
            return data;
        },
    });
    
    var contact: ContactParams = {
        id: -1,
        name: "Johnny Silverhand",
        avatar: "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp"
    }

    if (contacts) {
        contact = contacts.filter((contact: ContactParams) => contact.id.toString() === params.contact_id)[0];
    }

	const { data: chats, refetch: getAllChats } = useQuery("query-chats-" + params.contact_id, async () => {
		const data: ChatParams = (await apiClient.get("/chats/" + params.contact_id)).data;
		return data
	}, {
		enabled: !!authInfo.id, // only fetch if authenticated
		retry: 3,               // retry at max 3 times, not infinte
		onSuccess: (res) => {
		const data: ChatParams = res
            data.chats.map(item => item.read).forEach(read => {
                if (read) {data.notificationCount++;}
            })
			return data;
		},
	});

    //  Local state
    const [ message, setMessage ] = useState("");
    const [ showSendButton, setShowSendButton ] = useState(false);
    //const [ replyToMessage, setReplyToMessage ] = useState<ReplyToMessageType>(null);
    const [ replyToMessage, setReplyToMessage ] = useState<MessageItemParams>();
    const [ messageSent, setMessageSent ] = useState(false);

    const [ showActionSheet, setShowActionSheet ] = useState(false);
    const [ actionMessage, setActionMessage ] = useState<MessageItemParams|undefined>();

    const [ showToast, setShowToast ] = useState(false);
    const [ toastMessage, setToastMessage ] = useState("");

    //  Refs
    const contentRef = useRef<any>();
    const swiperRefs = useRef<any[]>([]);
    const textareaRef = useRef<any>();
    //const sideRef = useRef();
    const sendRef = useRef<any>();
    const replyToAnimationRef = useRef();


    const queryClient = useQueryClient()

    const starChatMessage = useMutation((id: number) => 
        apiClient.put('/chats/star/' + params.contact_id + '/' + id.toString()),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["query-chats-" + params.contact_id])
            }
        }
    )

    const markAllAsRead = useMutation(() => 
        apiClient.put('/chats/mark_read/' + params.contact_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["query-chats-" + params.contact_id])
            }
        }
    )

    // sendChatMessage(params.contact_id, message, replyToMessage, replyToMessage ? replyToMessage.id : -1, image, imagePath);
    const sendChatMessage = useMutation((reply: ReplyToMessageType) => 
        apiClient.put('/chats/reply/' + params.contact_id, JSON.stringify(reply)),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["query-chats-" + params.contact_id])
            }
        }
    )

    const actionSheetButtons = [

        {
            text: (actionMessage && actionMessage.starred) ? "Unstar Message" : "Star Message",
            icon: starOutline,
            handler: () => starChatMessage.mutate((actionMessage) ? actionMessage.id: -1)
        },
        actionMessage && actionMessage.received ? 
        {
            text: "Reply To Message",
            icon: shareOutline,
            handler: () => showReplyToMessage(actionMessage)
        } 
        :
        {
            text: "Unsend Message",
            icon: alertOutline,
            handler: () => toaster("I haven't implemented unsend :) Simple store update though")
        },
        {
            text: "Delete Message",
            icon: trashOutline,
            handler: () => toaster("I haven't implemented delete :) Simple store update though"),
            role: "destructive"
        }
    ];

    useEffect(() => {
        !showActionSheet && setActionMessage(undefined);
    }, [ showActionSheet ]);

    //  Scroll to end of content
    //  Mark all chats as read if we come into a chat
    //  Set up our swipe events for animations and gestures
    useIonViewWillEnter(() => {

        scrollToBottom();
        setupObserver();
        markAllAsRead.mutate();
        //setSwipeEvents();
    });

    //  For displaying toast messages
    const toaster = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    }

    //  Scroll to end of content
    const scrollToBottom = async () => {
        //console.log("scrollToBottom");
        contentRef.current.scrollToBottom();
    }

    //  Watch for DOM changes
    //  Then scroll to bottom
    //  This ensures that the new chat message has *actually* been rendered
    //  Check this:
    //  https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    const setupObserver = () => {

        //  Mutation Observers watch for DOM changes
        //  This will ensure that we scroll to bottom AFTER the new chat has rendered
        const observer = new MutationObserver(() => {

            scrollToBottom();
        });

        //  We observe the ion-content (or containing element of chats)
        observer.observe(contentRef.current!, {
            childList: true
        });
    }

    //  Long press callback
    const onLongPress = (e: any) => {
        const elementID = e.target.id;
        const chatMessageID = elementID.includes("chatText") ? parseInt(elementID.replace("chatText_", "")) : elementID.includes("chatTime") ? parseInt(elementID.replace("chatTime_", "")) : parseInt(elementID.replace("chatBubble_", ""));

        if (chats) {
            const chatMessage = chats.chats.filter((message: MessageItemParams) => message.id === chatMessageID)[0];
            setActionMessage(chatMessage);
        }
        setShowActionSheet(true);
    };

    const longPressEvent = useLongPress(onLongPress, {
        
        isPreventDefault: true,
        delay: 2000,
    });

    const showReplyToMessage = async (message: MessageItemParams) => {

            //  Activate reply-to functionality
            setReplyToMessage(message);
            /*await replyToAnimationRef.current.animation.play();*/
            contentRef.current.scrollToBottom(300);
    }

    const checkBubble = (bubble: any, message: MessageItemParams, event: any) => {

        if (event.deltaX >= 120) {

            //  Activate reply-to functionality
            bubble.style.transform = "none";
            showReplyToMessage(message);
        } else {

            //  Put chat bubble back to original position
            bubble.style.transform = "none";
        }
    }

    //  Function to move a bubble with the deltaX swipe
    const moveBubble = (bubble: any, event: GestureDetail) => {

        if (event.velocityX > 0) {

            bubble.style.transform = `translateX(${ event.deltaX }px)`;
        }
    }

    const setSwipeEvents = () => {

        chats && chats.chats.forEach((message: MessageItemParams, index: number) => {

            if (!message.sent) {
                
                const chatBubble: Node = swiperRefs.current[index];

                const l: GestureConfig = {
                    el: chatBubble,
                    onEnd: (e) => checkBubble(chatBubble, message, e),
                    onMove: (e) => moveBubble(chatBubble, e),
                    gestureName: "swipe",
                }

                const swipeGesture = createGesture(l);

                swipeGesture.enable();
            }
        });
    }

    const widthAnimation = {

        property: "width",
        fromValue: "110%",
        toValue: "100%"
    };

    const fadeAnimation = {

        property: "opacity",
        fromValue: "100%",
        toValue: "0%"
    };

    const sideButtonsAnimation = {

        duration: 200,
        direction: showSendButton ? "normal" : "reverse",
        iterations: "1",
        fromTo: [ fadeAnimation ],
        easing: "ease-in-out"
    };

    /*const sendButtonAnimation = {
        duration: showSendButton ? 300 : 100,
        direction: !showSendButton ? "normal" : "reverse",
        iterations: "1",
        fromTo: [ fadeAnimation ],
        easing: "ease-in-out"
    };*/

    /*const textareaAnimation = {
        duration: 200,
        direction: !showSendButton ? "normal" : "reverse",
        iterations: "1",
        fromTo: [ widthAnimation ],
        easing: "ease-in-out"
    };*/

    //  Set the state value when message val changes
    useEffect(() => {
        
        setShowSendButton(message !== "");
    }, [ message ]);

    //  Play the animations when the state value changes
    /*useEffect(() => {

        textareaRef.current.animation.play();
        //sideRef.current.animation.play();
        sendRef.current.animation.play();
    }, [ showSendButton ]);*/

    const sendMessage = (image = false, imagePath = "") => {

        if (message !== "" || image === true) {
            const reply: ReplyToMessageType = {
                contact_id: parseInt(params.contact_id),
                message: message,
                replyToMessage_id: replyToMessage?.id,
                image: imagePath
            }
            //console.log(reply);
            sendChatMessage.mutate(reply);
            setMessage("");
        
            setMessageSent(true);
            setTimeout(() => setMessageSent(false), 10);
            image && setTimeout(() => scrollToBottom(), 100);
        }
    }

    /*const handlePhoto = async () => {

        const returnedFilePath = await takePhoto();
        sendMessage(true, returnedFilePath);
    }*/

    const handlePrompt = async () => {

        const returnedFilePath = await prompt();
        sendMessage(true, returnedFilePath!);
    }

    const replyToProps: ReplyToProps = {
        replyToAnimationRef,
        ReplyMessage: replyToMessage!,
        setReplyToMessage,
        ContactName: contact.name,
        messageSent
    };

    return (

        <IonPage className="chat-page">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text={ (chats && chats.notificationCount > 0) ? chats.notificationCount.toString() : "" } />
                    </IonButtons>
                    <IonTitle>

                        <div className="chat-contact">
                            <img src={ contact.avatar } alt="avatar" />
                            <div className="chat-contact-details">
                                <p>{ contact.name }</p>
                                <IonText color="medium">last seen today at 22:10</IonText>
                            </div>
                        </div>
                    </IonTitle>

                    {/*<IonButtons slot="end">
                        <IonButton fill="clear" onClick={ () => toaster("As this is a UI only, video calling wouldn't work here.")}>
                            <IonIcon icon={ videocamOutline } />
                        </IonButton>

                        <IonButton fill="clear" onClick={ () => toaster("As this is a UI only, calling wouldn't work here.")}>
                            <IonIcon icon={ callOutline } />
                        </IonButton>
                    </IonButtons>*/}
                </IonToolbar>
            </IonHeader>

            {/*<IonContent id="main-chat-content" ref={ contentRef }>*/}
            <IonContent fullscreen ref={ contentRef }>

                { chats && chats.chats.map((message: MessageItemParams, index: number) => {

                    const repliedMessage = chats.chats.filter((subMessage: MessageItemParams) => subMessage.id === /*message.replyID PROPABLY ERROR HERE! TODO! */message.id)[0];

                    return (
                        <div ref={ ref => swiperRefs.current[index] = ref } 
                             id={ `chatBubble_${ message.id }`} 
                             key={ index } 
                             className={ `chat-bubble ${ message.sent ? "bubble-sent" : "bubble-received" }` } 
                             { ...longPressEvent }>
                            
                            <div id={ `chatText_${ message.id }`}>

                                <ChatRepliedQuote message={ message } contact={ contact } repliedMessage={ repliedMessage } />

                                { message.preview }
                                {/* message.image && message.imagePath && <img src={ message.imagePath } alt="chat message" /> */}
                                <ChatBottomDetails message={ message } />
                            </div>

                            <div className={ `bubble-arrow ${ message.sent && "alt" }` }></div>
                        </div>
                    );
                })}

                <IonActionSheet header="Message Actions" 
                                subHeader={ actionMessage && actionMessage.preview } 
                                isOpen={ showActionSheet } 
                                onDidDismiss={ () => setShowActionSheet(false) } 
                                buttons={ actionSheetButtons } />

                <IonToast color="primary" isOpen={ showToast } onDidDismiss={ () => setShowToast(false) } message={ toastMessage } position="bottom" duration={3000} />
            </IonContent>

            { replyToMessage && <ReplyTo { ...replyToProps } /> }

            <IonFooter className="chat-footer" id="chat-footer">
                <IonGrid>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="1">
                            <IonIcon icon={ addOutline } color="primary" onClick={ handlePrompt } />
                        </IonCol>

                        <div className="chat-input-container">
                            <CreateAnimation ref={ textareaRef } 
                                    duration={200}
                                    direction={!showSendButton ? "normal" : "reverse"}
                                    iterations={1}
                                    fromTo={[ widthAnimation ]}
                                    easing={"ease-in-out"}>
                                <IonTextarea rows={ 1 } 
                                             value={ message } 
                                             onIonChange={ (e: Event) => (setMessage((e.target as any as TextareaChangeEventDetail).value!)) } 
                                             />
                            </CreateAnimation>
                        </div>

                        {/*<CreateAnimation ref={ sideRef } { ...sideButtonsAnimation }>
                            <IonCol size="1">
                                <IonIcon icon={ cameraOutline } color="primary" onClick={ handlePhoto } />
                            </IonCol>

                            <IonCol size="1">
                                <IonIcon icon={ micOutline } color="primary" />
                            </IonCol>
                        </CreateAnimation>*/}

                        <CreateAnimation ref={ sendRef }         
                            duration={showSendButton ? 300 : 100}
                            direction={!showSendButton ? "normal" : "reverse"}
                            iterations={1}
                            fromTo={[ fadeAnimation ]}
                            easing={"ease-in-out"}>
                            <IonCol size="1" 
                                    className="chat-send-button" 
                                    onClick={ e => (sendMessage(false, undefined)) }>
                                <IonIcon icon={ send } />
                            </IonCol>
                        </CreateAnimation>
                    </IonRow>
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
}

export default ViewMessageList;