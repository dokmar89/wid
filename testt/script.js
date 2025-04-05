document.addEventListener('DOMContentLoaded', function() {
    // --- Globální proměnné ---
    let cart = [];
    let isAgeVerified = false; // Stav ověření věku
    let hasAgeRestrictedItems = false;

    // --- DOM Elementy ---
    const productButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const verificationStatusElement = document.getElementById('verification-status');
    const checkoutMessageElement = document.getElementById('checkout-message');
    // Kontejner pro widget již není potřeba pro tuto verzi skriptu
    // const ageVerificationWidgetContainer = document.getElementById('age-verification-widget');

    // --- PassProve Nastavení ---
    // POZOR: Nahraďte 'YOUR_API_KEY' vaším skutečným API klíčem!
    const passProveApiKey = 'sk_3697f4e4e7a9296e9592b4ecd7ce23d5ebfdf372ca193b07'; // <--- ZDE VLOŽTE SVŮJ API KLÍČ

    if (passProveApiKey === 'YOUR_API_KEY') {
         console.warn("PassProve: Nebyl nastaven API klíč! Ověření nebude fungovat.");
         alert("Prosím, nastavte svůj PassProve API klíč v souboru script.js.");
    }

    // --- Funkce ---

    // Callback funkce pro zpracování výsledku ověření z PassProve.verify
    function handleVerificationResult(result) {
        console.log('PassProve Verification Result:', result);
        if (result && result.success) {
            console.log('Ověření věku bylo úspěšné!');
            isAgeVerified = true;
        } else {
            console.log('Ověření věku selhalo nebo bylo zrušeno.', result ? result.error : 'Neznámá chyba');
            isAgeVerified = false;
            checkoutMessageElement.textContent = `Ověření věku selhalo${result && result.error ? ': ' + result.error : ''}. Zkuste to znovu.`;
        }
        updateCartDisplay(); // Aktualizujeme stav košíku/tlačítka po ověření
    }

    // Přidání produktu do košíku
    function addToCart(productData) {
        const existingItem = cart.find(item => item.id === productData.id);
        if (!existingItem) {
            cart.push(productData);
            console.log(`Produkt ${productData.name} přidán do košíku.`);
        } else {
            console.log(`Produkt ${productData.name} již v košíku.`);
             // Zde byste mohli navýšit počet kusů
        }
        updateCartDisplay();
    }

    // Aktualizace zobrazení košíku a stavu checkoutu
    function updateCartDisplay() {
        cartItemsElement.innerHTML = '';
        let total = 0;
        hasAgeRestrictedItems = false;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price} Kč`;
            if (item.ageRestricted) {
                li.textContent += ' (18+)';
                hasAgeRestrictedItems = true;
            }
            cartItemsElement.appendChild(li);
            total += item.price;
        });

        cartTotalElement.textContent = total;

        if (isAgeVerified) {
            verificationStatusElement.textContent = 'Stav ověření věku: Ověřeno';
            verificationStatusElement.style.color = 'green';
        } else {
            verificationStatusElement.textContent = 'Stav ověření věku: Neověřeno';
            verificationStatusElement.style.color = 'red';
        }

        // Logika pro tlačítko "Zaplatit"
        // Mazání zprávy se přesunulo do handleCheckout, aby zůstala viditelná chyba ověření
        // checkoutMessageElement.textContent = '';
        if (cart.length === 0) {
            checkoutButton.disabled = true;
            checkoutMessageElement.textContent = 'Košík je prázdný.';
            checkoutButton.textContent = "Zaplatit"; // Reset textu tlačítka
        } else if (hasAgeRestrictedItems && !isAgeVerified) {
            checkoutButton.disabled = false;
             checkoutMessageElement.textContent = checkoutMessageElement.textContent || 'Pro dokončení objednávky je třeba ověřit věk.'; // Nezobrazuj, pokud už je tam chybová zpráva z ověření
            checkoutButton.textContent = "Ověřit věk a zaplatit";
        } else {
            checkoutButton.disabled = false;
            checkoutMessageElement.textContent = ''; // Vymaž zprávu, pokud je vše OK
            checkoutButton.textContent = "Zaplatit";
        }
    }

    // Zpracování kliknutí na tlačítko "Zaplatit"
    function handleCheckout(event) {
         checkoutMessageElement.textContent = ''; // Vyčistit předchozí stavové/chybové zprávy před akcí

        if (hasAgeRestrictedItems && !isAgeVerified) {
            event.preventDefault();
            console.log('Spouštím PassProve ověření...');
            checkoutMessageElement.textContent = 'Spouštím ověření věku...'; // Informace pro uživatele
            checkoutButton.disabled = true; // Deaktivovat tlačítko během ověřování

            try {
                // Volání funkce verify s API klíčem a callback funkcí
                window.PassProve.verify(passProveApiKey, handleVerificationResult);
            } catch (error) {
                console.error("Chyba při volání PassProve.verify(): ", error);
                checkoutMessageElement.textContent = "Chyba při spouštění ověření věku.";
                isAgeVerified = false; // Jistota
                updateCartDisplay(); // Aktualizace UI do původního stavu
                 checkoutButton.disabled = false; // Znovu povolit tlačítko
            }
        } else if (cart.length > 0) {
            console.log('Pokračuji k platbě...');
            alert('Simulace přechodu k platbě!\nCelková cena: ' + cartTotalElement.textContent + ' Kč');
            // cart = []; // Volitelně vyprázdnit košík po "zaplacení"
            // updateCartDisplay();
        } else {
             console.log('Nelze platit, košík je prázdný.');
             checkoutMessageElement.textContent = 'Košík je prázdný.';
        }
    }

    // --- Event Listeners ---
    productButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const productData = {
                id: productElement.dataset.id,
                name: productElement.dataset.name,
                price: parseInt(productElement.dataset.price, 10),
                ageRestricted: productElement.dataset.ageRestricted === 'true'
            };
            addToCart(productData);
        });
    });

    checkoutButton.addEventListener('click', handleCheckout);

    // --- Počáteční nastavení ---
    // Volitelně: Zkontrolovat existující ověření při načtení stránky
    /*
    if (window.PassProve && typeof window.PassProve.checkVerification === 'function') {
        window.PassProve.checkVerification(passProveApiKey, function(result) {
            console.log('Check Verification Result:', result);
            if (result && result.verified) {
                isAgeVerified = true;
                console.log('Uživatel již byl ověřen.');
            } else {
                isAgeVerified = false;
            }
            updateCartDisplay(); // Aktualizovat UI po kontrole
        });
    } else {
         updateCartDisplay(); // Zobrazit počáteční stav košíku (prázdný)
    }
    */
   // Pro jednoduchost začneme bez kontroly při načtení
   updateCartDisplay();


}); // Konec DOMContentLoaded