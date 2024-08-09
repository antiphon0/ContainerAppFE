import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
        setUserInfo(data[0]);

        // Access token
        const access_token = data[0]?.access_token;
        setAccessToken(access_token);

        // ID token
        const id_token = data[0]?.id_token;
        setIdToken(id_token);

        // Refresh token (may not always be available)
        const refresh_token = data[0]?.refresh_token;
        setRefreshToken(refresh_token);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    fetchUserInfo();
  }, []);

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
    </div>
  );
};

export default App;
