import { useEffect } from 'react';

const VoiceflowChat = () => {
  useEffect(() => {
    const loadVoiceflowChat = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
      script.onload = () => {
        window.voiceflow.chat.load({
          verify: { projectID: '661bab099f0a7cb3f08a6340' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
        });
      };
      document.body.appendChild(script);
    };

    loadVoiceflowChat();
  }, []);

  return;
};

export default VoiceflowChat;