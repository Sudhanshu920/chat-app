import './App.css';
import React, { useState, useRef } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyAYByDRA-0qTVBZrsbxpWk-OCKW9aIImBs',
  authDomain: 'react-chat-app-40b79.firebaseapp.com',
  projectId: 'react-chat-app-40b79',
  databaseURL: 'https:/react-chat-app-40b79.firebaseio.com',
  storageBucket: 'react-chat-app-40b79.appspot.com',
  messagingSenderId: '776845736948',
  appId: '1:776845736948:web:b4733a08d530657184d7a1',
  measurementId: 'G-M25ESK6N0M',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>aao behen chugli kare</h1>
        <SignOut />
      </header>
      <section className='page-content'>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign In
      </button>
      <p>let's talk and grow together. #WEWILLROCK</p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <>
        <button className="sign-out" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      </>
    )
  );
}

function ChatRoom() {
  const dummy = useRef(null);

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAT').limit(100);
  const [messages] = useCollectionData(query, { idField: 'id' });  

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAT: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='chat-msg'>
      <div ref={dummy}>
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.uid} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Message"
        />
        <button type="submit" disabled={!formValue}>
          GO
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="profile-pic" />
        <p>{text}</p>
      </div>
    </>
  );
}
export default App;
