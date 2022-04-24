
import React, { useRef, useState, useEffect } from 'react';
import './App.css';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';




firebase.initializeApp( {
  apiKey: "AIzaSyCRcuGJMkmAsrrpVcHppuclS_oTgxil0X4",
  authDomain: "chatapp-f0e0b.firebaseapp.com",
  projectId: "chatapp-f0e0b",
  storageBucket: "chatapp-f0e0b.appspot.com",
  messagingSenderId: "77286457052",
  appId: "1:77286457052:web:c3ef4e9658341a72c3fe19",
  measurementId: "G-RCHJQ78MYB"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>GroupChat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className='signin' onClick={googleSignIn}>Sign In with Google</button>
    </>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() =>
      auth.signOut()
    }>Log out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const reference = firestore.collection('messages');
  const query = reference.orderBy('createdAt').limitToLast(30);

  const [messages] = useCollectionData(query, {idField:'id'});

  const [formValue, setFormValue] = useState('');

  const scrollToBottom = () => {
    dummy.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await reference.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return(
    <>
      <main>

        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>

      </main>
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) =>
          setFormValue(e.target.value)}/>

        <button type="submit">Send</button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'me' : 'you';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://imageio.forbes.com/blogs-images/kevinmurnane/files/2018/07/Incognito-icon_640sq_Nikin_Pixabay.jpg?format=jpg&width=1200'} alt=''/>
      <p>{text}</p>
    </div>
  </>)
}

export default App;
