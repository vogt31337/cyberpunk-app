import { 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonCardTitle, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonHeader, 
    IonIcon, 
    IonPage, 
    IonRow, 
    IonToolbar 
} from '@ionic/react';
import styles from './Login.module.scss';
import { RouteComponentProps, useParams } from 'react-router';
import { SetStateAction, useEffect, useState } from 'react';
import { arrowBack, logIn, shapesOutline } from "ionicons/icons";
import { Action } from '../../components/Action';
import { CustomField } from '../../components/CustomField';
import { useAuth } from './authContext';

const validateForm = (fields: any[]) => {
	let errors: { id: string; message: string; }[] = [];
	fields.forEach(field => {

		if (field.required) {
			const fieldValue = field.input.state.value;
			if (fieldValue === "") {
				
                const error = {
					id: field.id,
					message: `Please check your ${ field.id }`,
				};

				errors.push(error);
			}
		}
	});

	return errors;
}

const useFormInput = (initialValue = "") => {

    const [ value, setValue ] = useState(initialValue);
    
    const handleChange = async (e: { currentTarget: { value: any; }; }) => {
        const tempValue = await e.currentTarget.value;
        setValue(tempValue);
    }

    return {
        value,
        reset: (newValue: SetStateAction<string>) => setValue(newValue),
        onIonChange: handleChange,
        onKeyUp: handleChange
    };
}

const useLoginFields = () => {
    return [
        {
            id: "user",
            label: "User",
            required: true,
            input: {
                
                props: {
                    type: "user",
                    placeholder: "joe_bloggs"
                },
                state: useFormInput("")
            }
        },
        {
            id: "password",
            label: "Password",
            required: true,
            input: {
                
                props: {
                    type: "password",
                    placeholder: "*******"
                },
                state: useFormInput("")
            }
        }
    ];
}

export const LoginPage: React.FC<RouteComponentProps> = ({history}) => {
    
    const params = useParams();

    const fields = useLoginFields();
    const [ errors, setErrors ] = useState(false);

    const { logIn } = useAuth()!;
    /*const login = () => {

        const errors = validateForm(fields);
        setErrors(true);

        if (!errors.length) {
            //  Submit your form here
        }
    }*/

    useEffect(() => {

        return () => {

            fields.forEach(field => field.input.state.reset(""));
            setErrors(false);
        }
    }, [params]);

	return (
		<IonPage className={ styles.loginPage }>
			<IonHeader>
				<IonToolbar>
					
                    <IonButtons slot="start">
                        <IonBackButton icon={ arrowBack } text="" className="custom-back" />
                    </IonButtons>

                    <IonButtons slot="end">
                        <IonButton className="custom-button">
                            <IonIcon icon={ shapesOutline } />
                        </IonButton>
                    </IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
                <IonGrid className="ion-padding">
                    <IonRow>
                        <IonCol size="12" className={ styles.headingText }>
                            <IonCardTitle>Log in</IonCardTitle>
                            <h5>Welcome back, hope you're doing well</h5>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-margin-top ion-padding-top">
                        <IonCol size="12">

                            { fields.map((field, index) => {
                                return <CustomField Field={ field } key={ index }/>;
                            })}

                            <IonButton className="custom-button" expand="block" onClick={ async () => {
                                await logIn(fields[0].input.state.value, fields[1].input.state.value); history.replace("/profile");
                            } }>Login</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
			</IonContent>

			{/*<IonFooter>
				<IonGrid className="ion-no-margin ion-no-padding">
                    <Action message="Don't have an account?" text="Sign up" link="/signup" />
				</IonGrid>
            </IonFooter>*/}
		</IonPage>
	);
};