import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const script = `
  // PassProve Age Verification Widget
  (function() {
    const PassProve = window.PassProve = window.PassProve || {};
    
    // Hlavní funkce pro ověření věku
    PassProve.verify = function(apiKey, callback) {
      if (!apiKey) {
        console.error('PassProve: API key is required');
        return;
      }
      
      // Vytvoření modálního okna
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      
      // Vytvoření iframe pro ověření
      const iframe = document.createElement('iframe');
      iframe.style.width = '90%';
      iframe.style.maxWidth = '800px';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      
      // Přidání iframe do modálního okna
      modal.appendChild(iframe);
      
      // Přidání modálního okna do body
      document.body.appendChild(modal);
      
      // Inicializace verifikační relace
      fetch('/api/verification/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          user_agent: navigator.userAgent,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('PassProve: Error initializing verification:', data.error);
          modal.remove();
          if (callback) callback({ success: false, error: data.error });
          return;
        }
        
        // Nastavení URL pro iframe s ID relace
        const sessionId = data.session_id;
        iframe.src = '/verification?session=' + sessionId;
        
        // Naslouchání na zprávy z iframe
        window.addEventListener('message', function(event) {
          // Kontrola, zda zpráva pochází z našeho iframe
          if (event.source !== iframe.contentWindow) return;
          
          const message = event.data;
          
          // Zpracování zprávy
          if (message.type === 'verification_complete') {
            // Zavření modálního okna
            modal.remove();
            
            // Volání callback funkce
            if (callback) callback({
              success: message.success,
              method: message.method,
              verificationId: message.verificationId,
            });
          }
        });
      })
      .catch(error => {
        console.error('PassProve: Error initializing verification:', error);
        modal.remove();
        if (callback) callback({ success: false, error: error.message });
      });
    };
    
    // Funkce pro kontrolu, zda uživatel již byl ověřen
    PassProve.checkVerification = function(apiKey, callback) {
      // Kontrola, zda existuje cookie s ověřením
      const cookies = document.cookie.split(';');
      let verificationCookie = null;
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('passprove_verification=')) {
          verificationCookie = cookie.substring('passprove_verification='.length);
          break;
        }
      }
      
      if (!verificationCookie) {
        if (callback) callback({ verified: false });
        return;
      }
      
      // Ověření platnosti cookie
      fetch('/api/verification/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification_hash: verificationCookie,
          api_key: apiKey,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error || !data.is_valid) {
          if (callback) callback({ verified: false });
          return;
        }
        
        if (callback) callback({
          verified: true,
          method: data.method,
          validUntil: data.valid_until,
        });
      })
      .catch(error => {
        console.error('PassProve: Error validating verification:', error);
        if (callback) callback({ verified: false, error: error.message });
      });
    };
  })();
  `

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
