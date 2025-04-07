import React, { useEffect } from 'react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit?: () => void;
    }
}

const GoogleTranslate: React.FC = () => {
    useEffect(() => {
        const addScript = () => {
            const script = document.createElement('script');
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.onerror = () => console.error('Failed to load Google Translate script');
            document.body.appendChild(script);
        };

        window.googleTranslateElementInit = () => {
            try {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,es', //english or spanish hehe
                        autoDisplay: false,
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    },
                    'google_translate_element'
                );
                
                
                const style = document.createElement('style');
                style.textContent = `
                    .goog-te-menu-frame { margin-top: 40px !important; }
                    .goog-te-menu-value span { color: white !important; }
                    .goog-te-menu-value:after { content: '▼'; font-size: 10px; margin-left: 4px; color: white; }
                `;
                document.head.appendChild(style);
                

                setTimeout(() => {
                    const observer = new MutationObserver((mutations) => {
                        
                        const dropdown = document.querySelector('.goog-te-menu-frame');
                        if (dropdown) {
                            
                            dropdown.setAttribute('style', 'margin-top: 40px !important; z-index: 9999 !important;');
                        }
                    });
                    
                    const targetNode = document.body;
                    if (targetNode) {
                        observer.observe(targetNode, { childList: true, subtree: true });
                    }
                }, 1000);
            } catch (error) {
                console.error('Error initializing Google Translate:', error);
            }
        };

    
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            addScript();
        } else if (window.google && window.google.translate) {
    
            window.googleTranslateElementInit();
        }

    
        return () => {
            delete window.googleTranslateElementInit;
        };
    }, []);

    return <div id="google_translate_element" />;
};

export default GoogleTranslate;