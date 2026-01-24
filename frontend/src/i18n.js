import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    "welcome": "Welcome",
                    "trending": "Trending Near You",
                    "explore_menu": "Explore Menu",
                    "search_placeholder": "Search for",
                    "squad_mode": "Squad Mode",
                    "dashboard": "Dashboard",
                    "login": "Log in",
                    "signup": "Sign up",
                    "location": "Location",
                    "all": "All",
                    "ai_prompt": "Tell me your mood!",
                    "voice_search": "Speak to search",
                    // Categories
                    "Starters": "Starters",
                    "Biryani": "Biryani",
                    "Pizza": "Pizza",
                    "Burger": "Burger",
                    "Desserts": "Desserts",
                    "Beverages": "Beverages",
                    "Snacks": "Snacks",
                    "Healthy": "Healthy",
                    "Thali": "Thali",
                    // Card Actions
                    "add": "ADD",
                    "view_details": "VIEW DETAILS",
                    "safe": "Safe",
                    "off": "OFF",
                    "buy_get": "BUY 2, GET 1",
                    // Tracking 
                    "estimated_arrival": "Estimated Arrival",
                    "order_id": "Order ID",
                    "order_placed": "Order Placed",
                    "order_placed_desc": "We have received your order.",
                    "preparing": "Preparing",
                    "preparing_desc": "Kitchen is preparing your food.",
                    "out_for_delivery": "Out for Delivery",
                    "out_for_delivery_desc": "Driver is on the way.",
                    "delivered": "Delivered",
                    "delivered_desc": "Enjoy your customized meal!",
                    "searching_driver": "Searching for nearby drivers...",
                    "cancel_order": "Cancel Order",
                    "restaurant": "Restaurant",
                    "home": "Home",
                    "min": "min"
                }
            },
            hi: {
                translation: {
                    "welcome": "स्वागत है",
                    "trending": "आपके पास लोकप्रिय",
                    "explore_menu": "मेनू देखें",
                    "search_placeholder": "खोजें",
                    "squad_mode": "स्क्वाड मोड",
                    "dashboard": "डैशबोर्ड",
                    "login": "लॉग इन",
                    "signup": "साइन अप",
                    "location": "स्थान",
                    "all": "सभी",
                    "ai_prompt": "अपना मूड बताएं!",
                    "voice_search": "बोलकर खोजें",
                    // Categories
                    "Starters": "शुरुवात",
                    "Biryani": "बिरयानी",
                    "Pizza": "पिज़्ज़ा",
                    "Burger": "बर्गर",
                    "Desserts": "मिठाई",
                    "Beverages": "पेय",
                    "Snacks": "नाश्ता",
                    "Healthy": "स्वस्थ",
                    "Thali": "थाली",
                    // Card Actions
                    "add": "जोड़ें",
                    "view_details": "विवरण देखें",
                    "safe": "सुरक्षित",
                    "off": "छूट",
                    "buy_get": "2 खरीदें 1 पाएं",
                    // Tracking
                    "estimated_arrival": "अनुमानित आगमन",
                    "order_id": "ऑर्डर आईडी",
                    "order_placed": "ऑर्डर प्राप्त हुआ",
                    "order_placed_desc": "साधन ने ऑर्डर ले लिया है",
                    "preparing": "तैयारी",
                    "preparing_desc": "रसोई में खाना बन रहा है",
                    "out_for_delivery": "डिलीवरी के लिए निकला",
                    "out_for_delivery_desc": "ड्राइवर रास्ते में है",
                    "delivered": "डिलीवर हो गया",
                    "delivered_desc": "अपने भोजन का आनंद लें!",
                    "searching_driver": "ड्राइवर की तलाश...",
                    "cancel_order": "ऑर्डर रद्द करें",
                    "restaurant": "रेस्तरां",
                    "home": "घर",
                    "min": "मिनट"
                }
            },
            te: {
                translation: {
                    "welcome": "స్వాగతం",
                    "trending": "మీ దగ్గర ట్రెండింగ్",
                    "explore_menu": "మెను చూడండి",
                    "search_placeholder": "శోధించండి",
                    "squad_mode": "స్క్వాడ్ మోడ్",
                    "dashboard": "డ్యాష్‌బోర్డ్",
                    "login": "లాగిన్",
                    "signup": "సైన్ అప్",
                    "location": "స్థానము",
                    "all": "అన్ని",
                    "ai_prompt": "మీ మూడ్ చెప్పండి!",
                    "voice_search": "మాట్లాడి వెతకండి",
                    // Categories
                    "Snacks": "స్నాక్స్",
                    "Healthy": "ఆరోగ్యకరమైన",
                    "Thali": "థాలీ",
                    // Card Actions
                    "add": "జోడించు",
                    "view_details": "వివరాలు",
                    "safe": "సురక్షితం",
                    "off": "తగ్గింపు",
                    "buy_get": "2 కొనండి 1 పొందండి",
                    // Tracking
                    "estimated_arrival": "అంచనా సమయం",
                    "order_id": "ఆర్డర్ ID",
                    "order_placed": "ఆర్డర్ స్వీకరించబడింది",
                    "order_placed_desc": "మీ ఆర్డర్ మాకు అందినది",
                    "preparing": "సిద్ధం చేస్తున్నారు",
                    "preparing_desc": "వంట గదిలో ఆహారం సిద్ధం అవుతోంది",
                    "out_for_delivery": "డెలివరీకి బయలుదేరింది",
                    "out_for_delivery_desc": "డ్రైవర్ దారిలో ఉన్నారు",
                    "delivered": "డెలివరీ పూర్తయింది",
                    "delivered_desc": "మీ ఆహారాన్ని ఆస్వాదించండి!",
                    "searching_driver": "డ్రైవర్ కోసం వెతుకుతోంది...",
                    "cancel_order": "ఆర్డర్ రద్దు చేయండి",
                    "restaurant": "రెస్టారెంట్",
                    "home": "ఇల్లు",
                    "min": "నిమి"
                }
            }
        }
    });

export default i18n;
