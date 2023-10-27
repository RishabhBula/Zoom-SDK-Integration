import React, { useEffect } from 'react';
import { ZoomMtg } from "@zoomus/websdk";

const generateSignature = async (apiKey, apiSecret, meetingNumber, role) => {
  const timestamp = new Date().getTime() - 30000;
  const msg = btoa(apiKey + meetingNumber + timestamp + role);
  
  const secretBuffer = new TextEncoder().encode(apiSecret);

  const encoder = new TextEncoder();
  const data = encoder.encode(msg);

  const buffer = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', buffer, data);

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

const ZoomIntegration = () => {
  useEffect(() => {
    const signatureEndpoint = "http://localhost:4000";
    const apiSecret = "hfdhdhfdh65hfd";
    const apiKey = "gfdhgsfdhgfdh";
    const meetingNumber = 123564984 //meet number

    ;
    const role = 0;
    const leaveUrl = "http://localhost:3000";
    const userName = 'webSdk';
    const userEmail = 'mailto:test@gmail.com';
    const password = ''; //meet password

    const initializeZoom = async () => {
      try {
        const signature = await generateSignature(apiKey, apiSecret, meetingNumber, role);

        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.0/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();

        const zoomMeetingUrl = `https://zoom.us/wc/${meetingNumber}/join?prefer=1&un=${userName}&pwd=${password}&signature=${signature}`;
        // window.open(zoomMeetingUrl, "_blank");
        const iframe = document.createElement("iframe");
        iframe.src = zoomMeetingUrl;
        iframe.width = "1500px"; 
        iframe.height = "730px";
        document.body.appendChild(iframe);
      } catch (error) {
        console.error("Error initializing Zoom:", error);
      }
    };

    initializeZoom();
  }, []);

  return (
    <div>
    </div>
  );
};

export default ZoomIntegration;