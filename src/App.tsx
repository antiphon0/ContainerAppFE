import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [backendResponse, setBackendResponse] = useState<string | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch user info and tokens from Azure Easy Auth
        const response = await axios.get('/.auth/me');
        const data = response.data;
        setUserInfo(data[0]);

        // Extract and set the tokens
        const access_token = data[0]?.access_token;
        setAccessToken(access_token);

        const id_token = data[0]?.id_token;
        setIdToken(id_token);

        const refresh_token = data[0]?.refresh_token;
        setRefreshToken(refresh_token);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to call the FastAPI backend using the access token
  const callBackend = async () => {
    if (accessToken && backendUrl) {  // Ensure backendUrl is defined
      try {
        const response = await axios.get(`${backendUrl}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBackendResponse(response.data.message);
      } catch (error) {
        console.error('Error calling backend:', error);
        setBackendResponse('Error calling backend');
      }
    } else {
      console.log('No access token or backend URL available');
    }
  };

  return (
    <div>
      <h1>Authentication Tokens</h1>
      {userInfo && (
        <div>
          <h2>User Information</h2>
          <p><strong>Name:</strong> {userInfo.user_claims.find((claim: any) => claim.typ === 'name')?.val}</p>
          <h2>Tokens</h2>
          <p><strong>Access Token:</strong> {accessToken || 'No access token available'}</p>
          <p><strong>ID Token:</strong> {idToken || 'No ID token available'}</p>
          <p><strong>Refresh Token:</strong> {refreshToken || 'No refresh token available'}</p>
        </div>
      )}
      <button onClick={callBackend}>Call Backend</button>
      {backendResponse && (
        <div>
          <h2>Backend Response</h2>
          <p>{backendResponse}</p>
        </div>
      )}
    </div>
  );
};

export default App;
