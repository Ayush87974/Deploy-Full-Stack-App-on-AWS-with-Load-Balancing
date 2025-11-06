import React, { useState } from 'react';

export default function App() {
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');

  async function login() {
    const res = await fetch('http://BACKEND_API_HOST:3001/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
    } else {
      setMsg(data.message);
    }
  }

  async function callProtected() {
    const res = await fetch('http://BACKEND_API_HOST:3001/protected', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMsg(JSON.stringify(data));
  }

  return (
    <div style={{padding:20}}>
      <h2>Simple Fullstack Demo</h2>
      <button onClick={login}>Login (hardcoded admin)</button>
      <button onClick={callProtected} style={{marginLeft:10}}>Call Protected</button>
      <div style={{marginTop:10}}>
        <strong>Token:</strong> <code style={{display:'block', width:'80%'}}>{token}</code>
      </div>
      <div style={{marginTop:10}}>
        <strong>Response:</strong><pre>{msg}</pre>
      </div>
    </div>
  );
}
