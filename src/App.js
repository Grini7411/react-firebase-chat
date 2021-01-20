import './App.css';
import { useState, useRef } from 'react';

import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";


firebase.initializeApp({
  apiKey: "AIzaSyA7lvne49aunldiICPNQ5tJuGZIp7Rmejg",
  authDomain: "react-chat-app-ad756.firebaseapp.com",
  projectId: "react-chat-app-ad756",
  storageBucket: "react-chat-app-ad756.appspot.com",
  messagingSenderId: "566021497977",
  appId: "1:566021497977:web:65aae5fba3e3d4a9b1a0a8",
  measurementId: "G-JDJ9NX6628"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        {user && <SignOut/>}
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

export default App;



function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider);
  }

  return (
      <button onClick={signInWithGoogle}>Sign-In with The Big G!</button>
  );
}

function SignOut() {
  return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign-Out</button>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt=""/>
        <p>{text}</p>
      </div>
  );
}

const ChatRoom = () => {
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();

    // full collection Ref:
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const sendMessage = async (e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;


    await messagesRef.add({
      text: formValue,
      photoURL,
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }


    return (
      <>]
          <main>
              <div>{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}</div>
              <div ref={dummy}></div>
          </main>
        <form onSubmit={sendMessage} >
          <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
          <button type="submit">Send!</button>
        </form>
      </>
  )
}

