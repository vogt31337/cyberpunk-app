import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonHeader, IonIcon, IonImg, IonItem, IonPage, IonSearchbar, IonToolbar, useIonViewWillEnter, useIonToast } from '@ionic/react';
import { searchOutline, chatboxOutline, playCircleOutline, bagOutline, homeOutline, menuOutline, flagOutline, notificationsOutline, homeSharp, home, videocam, images, globe, ellipse, ellipsisHorizontal, thumbsUp, heart, thumbsUpOutline, shareOutline, arrowRedoOutline, addCircle  } from "ionicons/icons";
import Post from './Post';
import styles from "./Feed.module.scss";
import { useState } from 'react';

import { useAuth } from "../auth/authContext";
import { useQuery } from "react-query";
import apiClient from "../../http-common";

type PostParams = {
    id: number;
    avatar: string;
    name: string;
    message: string;
    sponsored: boolean;
    time: Date;
    views: string;
    online: boolean;
    image?: string;
}

type Posts = ReadonlyArray<PostParams>

const Feed: React.FC = () => {
	const { authInfo } = useAuth()!;
	const [present, dismiss] = useIonToast();
	const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

	const { isLoading, isError, data, error, refetch: getAllPosts } = useQuery("query-posts", async () =>{
		const data: Posts = (await apiClient.get("/posts")).data;
		return data
	}, {
		enabled: !!authInfo.id,
		retry: 3,
		onSuccess: (res) => {
			const data: Posts = res
			return data
		},
		onError: (err) => {
			present({
				buttons: [{ text: 'hide', handler: () => dismiss() }],
				message: "Error during updating feed.",
				duration: 3000,
			});
		}
	});
	
	useIonViewWillEnter(async() => {
		await getAllPosts();
	});

	const loadData = (ev: any) => {
		setTimeout(() => {
			getAllPosts();
			ev.target.complete();
			if (data && data.length >= 1000) {
				setInfiniteDisabled(true);
			}	
		}, 500);
	};

	return (
		<IonPage className={ styles.home }>
			<IonHeader>
				<IonToolbar>
					<IonCol size="12">
						<IonItem lines="none" >
							<IonAvatar slot="start" style={{ height: "2.5rem", width: "2.5rem" }}>
								<IonImg src={ authInfo.image } />
							</IonAvatar>

							<IonSearchbar placeholder="What's on your mind?" searchIcon={ addCircle }/>
						</IonItem>
					</IonCol>

					<IonButtons slot="end" className={ styles.toolbarIcons }>
						<IonIcon icon={ searchOutline } size="small"/>
						<IonIcon icon={ chatboxOutline } size="small"/>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<div className={ styles.topHeader }></div>

				{ data && data.map((post, index) => {
					return <Post post={ post } key={ index } />;
				})}

				<IonInfiniteScroll
				onIonInfinite={loadData}
				threshold="100px"
				position="bottom"
				disabled={isInfiniteDisabled}
				>
				<IonInfiniteScrollContent
					loadingSpinner="bubbles"
					loadingText="Loading more data..."
				></IonInfiniteScrollContent>
				</IonInfiniteScroll>

			</IonContent>
		</IonPage>
	);
};

export default Feed;

/*

				<IonRow className="ion-no-padding ion-no-margin post">
					<IonCol size="12" className="ion-no-padding ion-no-margin">
						<div className="post-container">
							<IonItem lines="none" className="post-header ion-no-margin ion-no-padding">
								<IonAvatar slot="start" className="ion-no-padding ion-no-margin">
									<IonImg src="https://pbs.twimg.com/profile_images/1148952014036054016/xxv7lLvp_400x400.jpg" />
								</IonAvatar>

								<IonLabel>
									<h3>Ionic Framework</h3>
									<p>
										Sponsored
										&nbsp;&nbsp;
										<IonIcon icon={ globe } />
									</p>
								</IonLabel>

								<IonIcon icon={ ellipsisHorizontal } />
							</IonItem>

							<IonItem lines="none" className="post-content ion-no-margin ion-no-padding">
								<p>Build cross-platform web native mobile apps with one codebase! 🎉</p>
							</IonItem>

							{/ <IonItem lines="none" className="post-image ion-no-margin ion-no-padding"> /}
							<IonImg src="https://miro.medium.com/max/1200/1*Wr5pn3g1pMkibZi8V5MynA.jpeg" />
							{/ </IonItem> /}

							<div className="post-link ion-no-margin ion-no-padding">
								<IonLabel>
									<p>ionicframework.com</p>
									<h3>Start building apps today!</h3>
								</IonLabel>

								<IonButton>
									Learn more
								</IonButton>
							</div>

							<div className="post-likes ion-no-margin ion-no-padding">
								<div className="post-like-icons">
									<IonIcon icon={ thumbsUp } />
									<IonIcon icon={ heart } />
								</div>

								<p>16K Views</p>
							</div>

							<div className="post-actions ion-no-margin ion-no-padding ion-text-center">

								<IonCol size="4">
									<IonIcon icon={ thumbsUpOutline } />
									<IonText>Like</IonText>
								</IonCol>

								<IonCol size="4">
									<IonIcon icon={ chatboxOutline } />
									<IonText>Comment</IonText>
								</IonCol>

								<IonCol size="4">
									<IonIcon icon={ arrowRedoOutline } />
									<IonText>Share</IonText>
								</IonCol>
							</div>
						</div>
					</IonCol>
				</IonRow>

				*/