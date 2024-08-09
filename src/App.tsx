import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
        setUserInfo(data[0]);

        // Access token
        const token = data[0]?.access_token;
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleApiCall = async () => {
    if (accessToken) {
      try {
        const response = await fetch('/api/data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error calling API', error);
      }
    } else {
      console.log('No access token available');
    }
  };

  return (
    <div>
      <h1>Welcome, {userInfo?.user_claims?.find((claim: any) => claim.typ === 'name')?.val || 'Guest'}!</h1>
      <button onClick={handleApiCall}>Call API</button>
    </div>
  );
};

export default App;
