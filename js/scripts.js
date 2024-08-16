// Hamburger
let hamburger = document.querySelector('.hamburger'),
    headerMenu = document.querySelector('.header_menu');
hamburger.onclick = function() {
    hamburger.classList.toggle('hamburger_open');
    headerMenu.classList.toggle('header_modile');
}

// Vars
const sizeCoefficient = 3.5;
let canvas = document.querySelector('.canvas'),
    setSize = document.querySelector('#setSize'),
    setSizeBlock = document.querySelector('.set_size');
    sizeInputs = document.querySelectorAll('.size'),
    widthInput = document.querySelector('#width'),
    heightInput = document.querySelector('#height'),
    activeSizes = document.querySelector('#activeSizes'),
    errorSize = document.querySelector('#errorSize'),
    orderCallBtn = document.querySelector('#orderCall'),
    tel = document.querySelector('.myTel'),
    errorTel = document.querySelector('.errorTel'),
    calculateBtn = document.querySelector('#calculate'),
    callMeBtn = document.querySelector('#callMe'),
    buyBtn = document.querySelector('#buy'),
    cancelBtn = document.querySelector('#cancel'),
    orderBlock = document.querySelector('.order_block'),
    telOrder = document.querySelector('.myTelOrder'),
    errorTelOrder = document.querySelector('.errorTelOrder'),
    orderBtn = document.querySelector('#order'),
    additionalInputs = document.querySelector('.additional').querySelectorAll('input');
// Phone RegEx
let phoneRegEx1 = /^(\+\d{1,3}[-\s]?)?(\(?\d{3}\)?[-\s]?)\d{3}[-\s]?\d{2}[-\s]?\d{2}$/g,
    phoneRegEx2 = /^(\+\d{1,3}[-\s]?)?(\(?\d{3}\)?[-\s]?)\d{2}[-\s]?\d{3}[-\s]?\d{2}$/g,
    phoneRegEx3 = /^(\+\d{1,3}[-\s]?)?(\(?\d{3}\)?[-\s]?)\d{2}[-\s]?\d{2}[-\s]?\d{3}$/g;

// Call me popup
orderCallBtn.onclick = callPopup;
function callPopup() {
    let popup = document.querySelector('#callPopUp'),
        popupWrap = document.querySelector('.popup_wrap'),
        closeButton = document.createElement('span');
    popupWrap.appendChild(closeButton);
    closeButton.innerHTML = '+';
    closeButton.classList.add('popup_close');
    popup.style.display = 'block';

    // close popup
    closeButton.onclick = closeCallPopup;
    popup.addEventListener('click', function(event) {
        if (event.target === popup) closeCallPopup();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeCallPopup();
    });
}
function closeCallPopup() {
    let popup = document.querySelector('#callPopUp');
    popup.style.display = 'none';
}

// Check tel before call back
tel.oninput = function() {
    let string = tel.value.replace(/[^+0-9\(\)\-\s]/g, '');
    tel.value = string;
    if (string.length >= 10) {
        if ((string.includes('(') && !string.includes(')')) || (!string.includes('(') && string.includes(')'))) {
            callMeBtn.setAttribute('disabled', '');
            errorTel.innerHTML = 'Неправильно введений номер';
        } else if (phoneRegEx1.test(string) || phoneRegEx2.test(string) || phoneRegEx3.test(string)) {
            callMeBtn.removeAttribute('disabled');
            errorTel.innerHTML = '';
        } else {
            if (phoneRegEx1.test(string) || phoneRegEx2.test(string) || phoneRegEx3.test(string)) {
                callMeBtn.removeAttribute('disabled');
                errorTel.innerHTML = '';
            } else {
                callMeBtn.setAttribute('disabled', '');
                errorTel.innerHTML = 'Неправильно введений номер';
            }
        }
    } else {
        callMeBtn.setAttribute('disabled', '');
    }
}

// Check radio sizes
sizeInputs.forEach(si => {
    if (si.checked) activeSizes.value = si.value;
    putSizes();
});
sizeInputs.forEach(si => {
    si.addEventListener('change', function() {
        if (si.checked) activeSizes.value = si.value;
        putSizes();
        // setSizeBlock.classList.add('hidden');
        // widthInput.value = null;
        // heightInput.value = null;
        widthInput.style.background = 'transparent';
        heightInput.style.background = 'transparent';
        errorSize.innerHTML = '';
        buyBtn.removeAttribute('disabled');
    });
});

// Put canvas' sizes
function putSizes() {
    const width = parseInt(activeSizes.value.split('_')[0] * sizeCoefficient),
        height = parseInt(activeSizes.value.split('_')[1] * sizeCoefficient);
    canvas.style.width = width + 'rem';
    canvas.style.height = height + 'rem';
    putPrice();
}

// Display/Hide 'set sizes' block
setSize.onclick = function() {
    setSizeBlock.classList.toggle('hidden');
}

// Sizes rounding
widthInput.onblur = function() {
    let width = parseInt(widthInput.value);
    if (!isNaN(width)) {
        while ((width % 5) != 0) width++;
        if (widthInput.value != width) showToast();
        widthInput.value = width;
        setCanvasSize();
    }
}
heightInput.onblur = function() {
    let height = parseInt(heightInput.value);
    if (!isNaN(height)) {
        while ((height % 5) != 0) height++;
        if (heightInput.value != height) showToast();
        heightInput.value = height;
        setCanvasSize();
    }
}

// Message about rounded size
function showToast() {
    let toast = document.querySelector('#toast'),
        progressBar = document.querySelector('#progressBar');

    // Reset animation
    // progressBar.offsetHeight;   // Trigger reflow
    progressBar.style.animation = '';

    // Animation
    progressBar.style.animation = 'progress 2.5s linear forwards';

    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Manual set canvas' sizes
widthInput.addEventListener('input', setCanvasSize);
heightInput.addEventListener('input', setCanvasSize);
function setCanvasSize() {
    if (isSizesCorrect()) {
        sizeInputs.forEach(sizeInput => {
            if (sizeInput.checked) sizeInput.checked = false;
        });
        activeSizes.value = widthInput.value + '_' + heightInput.value;
        widthInput.style.background = '#c1e8f1';
        heightInput.style.background = '#c1e8f1';
        putSizes();
    } else {
        widthInput.style.background = 'transparent';
        heightInput.style.background = 'transparent';
    }
}
// Check if width & height inputs has correct values
function isSizesCorrect() {
    const minHeight = widthInput.min,
        minWidth = heightInput.min,
        maxWidth = widthInput.max,
        maxHeight = heightInput.max,
        width = parseInt(widthInput.value),
        height = parseInt(heightInput.value);
    if (!width || width < minWidth || width > maxWidth ||
        !height || height < minHeight || height > maxHeight) {
        errorSize.innerHTML = `Ширина та Висота мають бути в межах між ${minWidth}см та ${maxWidth}см.`;
        calculateBtn.setAttribute('disabled', '');
        buyBtn.setAttribute('disabled', '');
        return false;
    } else {
        calculateBtn.removeAttribute('disabled');
        buyBtn.removeAttribute('disabled');
        errorSize.innerHTML = '';
        return true;
    }
}

// Calculate button click
calculateBtn.addEventListener('click', () => {
    sizeInputs.forEach(sizeInput => {
        if (sizeInput.checked) sizeInput.checked = false;
    });
    activeSizes.value = widthInput.value + '_' + heightInput.value;
    widthInput.style.background = '#c1e8f1';
    heightInput.style.background = '#c1e8f1';
    putSizes();
    putPrice();
});

// Calculate price' bonus
function calculateBonusPrice() {
    let priceBonus = 0;
    additionalInputs.forEach(addInput => {
        if (addInput.checked) priceBonus += parseInt(addInput.value);
    });
    return priceBonus;
}

// Update price bonus
additionalInputs.forEach(addInput => {
    addInput.addEventListener('change', () => {
        calculateBonusPrice();
        putPrice();
    });
});

// Calculate & Put price
function putPrice() {
    const width = parseInt(activeSizes.value.split('_')[0]),
        height = parseInt(activeSizes.value.split('_')[1]);
    let price = parseInt(100 + width * height * 0.05);
    price += parseInt(calculateBonusPrice());
    while ((price % 5) != 0) price++;
    document.querySelector('.sumNumber').innerHTML = price;
}

buyBtn.onclick = function() {
    cancelBtn.style.display = 'inline-block';
    buyBtn.style.display = 'none';
    orderBlock.style.display = 'flex';
}
cancelBtn.onclick = function() {
    buyBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'none';
    orderBlock.style.display = 'none';
}

// Check tel before accept order
telOrder.oninput = function() {
    let string = telOrder.value.replace(/[^+0-9\(\)\-\s]/g, '');
    telOrder.value = string;
    if (string.length >= 10) {
        if ((string.includes('(') && !string.includes(')')) || (!string.includes('(') && string.includes(')'))) {
            orderBtn.setAttribute('disabled', '');
            errorTelOrder.innerHTML = 'Неправильно введений номер';
        } else if (phoneRegEx1.test(string) || phoneRegEx2.test(string) || phoneRegEx3.test(string)) {
            orderBtn.removeAttribute('disabled');
            errorTelOrder.innerHTML = '';
        } else {
            if (phoneRegEx1.test(string) || phoneRegEx2.test(string) || phoneRegEx3.test(string)) {
                orderBtn.removeAttribute('disabled');
                errorTelOrder.innerHTML = '';
            } else {
                orderBtn.setAttribute('disabled', '');
                errorTelOrder.innerHTML = 'Неправильно введений номер';
            }
        }
    } else {
        orderBtn.setAttribute('disabled', '');
    }
}

// document.body.style.maxHeight = window.innerHeight + 'px';
// let stand = document.querySelector('.stand'),
//     params = document.querySelector('.params');
// checkScreenWidth();
// function checkScreenWidth() {
//     if (window.matchMedia('(max-width: 640px)').matches) {
//         stand.classList.add('mobile');
//         params.classList.add('mobile');
//     } else {
//         stand.classList.remove('mobile');
//         params.classList.remove('mobile');
//     }
// }
// window.addEventListener('resize', checkScreenWidth);
