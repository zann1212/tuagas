// --- Fungsi Konversi Universal ---
// Mengonversi bilangan dari satu basis (baseIn) ke basis desimal (basis 10)
function toDecimal(numStr, baseIn, stepsArray) {
    let decimal = 0;
    const hexDigits = '0123456789ABCDEF';
    numStr = numStr.toUpperCase(); // Untuk heksadesimal

    stepsArray.push(`<li><strong>Konversi ${numStr} (Basis ${baseIn}) ke Desimal:</strong></li>`);
    stepsArray.push(`<ul>`);

    if (baseIn === 10) {
        decimal = parseInt(numStr, 10);
        stepsArray.push(`<li>Bilangan sudah dalam desimal: ${numStr}</li>`);
    } else {
        for (let i = 0; i < numStr.length; i++) {
            const char = numStr[numStr.length - 1 - i];
            const digitValue = (baseIn === 16) ? hexDigits.indexOf(char) : parseInt(char);

            if (isNaN(digitValue) || digitValue >= baseIn || digitValue < 0) {
                throw new Error(`Karakter "${char}" tidak valid untuk basis ${baseIn}.`);
            }

            const term = digitValue * Math.pow(baseIn, i);
            decimal += term;
            stepsArray.push(`<li>${char} * ${baseIn}<sup>${i}</sup> = ${term}</li>`);
        }
    }
    stepsArray.push(`</ul>`);
    stepsArray.push(`<li><strong>Hasil Desimal:</strong> ${decimal}</li>`);
    return decimal;
}

// Mengonversi bilangan desimal (basis 10) ke basis lain (baseOut)
function fromDecimal(decimal, baseOut, stepsArray) {
    if (decimal === 0) {
        stepsArray.push(`<li>Desimal 0 adalah 0 di basis ${baseOut}.</li>`);
        return '0';
    }

    let result = '';
    let tempDecimal = decimal;
    const hexDigits = '0123456789ABCDEF';

    stepsArray.push(`<li><strong>Konversi Desimal ${decimal} ke Basis ${baseOut}:</strong></li>`);
    stepsArray.push(`<ul>`);

    while (tempDecimal > 0) {
        const remainder = tempDecimal % baseOut;
        const char = (baseOut === 16) ? hexDigits[remainder] : String(remainder);
        result = char + result;
        stepsArray.push(`<li>${tempDecimal} / ${baseOut} = ${Math.floor(tempDecimal / baseOut)} sisa ${remainder} (${char})</li>`);
        tempDecimal = Math.floor(tempDecimal / baseOut);
    }
    stepsArray.push(`</ul>`);
    return result;
}

// --- Fungsi untuk Menampilkan Elemen dengan Animasi Berurutan ---
function animateElements(elements) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, 100 * index);
    });
}

// --- Validasi Input Universal ---
function validateInput(numStr, base, errorDiv) {
    const validChars = {
        '2': /^[01]+$/,
        '8': /^[0-7]+$/,
        '10': /^\d+$/,
        '16': /^[0-9A-Fa-f]+$/
    };

    if (numStr === '') {
        return "Input tidak boleh kosong.";
    }

    if (!validChars[base].test(numStr)) {
        return `Karakter tidak valid untuk basis ${base} (hanya ${validChars[base].source.replace(/[\^\$\+\\]/g, '')}).`;
    }

    return null; // Input valid
}


// --- Fungsi Utama Konverter Bilangan ---
function convertNumber() {
    const inputNum = document.getElementById('convertInput').value.trim();
    const inputBase = parseInt(document.getElementById('inputBase').value);
    const outputBase = parseInt(document.getElementById('outputBase').value);
    const convertedResultSpan = document.getElementById('convertedResult');
    const conversionStepsDiv = document.getElementById('conversionSteps');

    convertedResultSpan.textContent = ''; // Clear previous result
    conversionStepsDiv.innerHTML = ''; // Clear previous steps

    const resultItems = document.querySelectorAll('.converter-container .result-item');
    resultItems.forEach(item => item.classList.remove('show'));


    const validationError = validateInput(inputNum, inputBase, conversionStepsDiv);
    if (validationError) {
        conversionStepsDiv.innerHTML = `<p class="error">${validationError}</p>`;
        setTimeout(() => {
            conversionStepsDiv.querySelector('.error').classList.add('show');
        }, 100);
        return;
    }

    let steps = '<ul>';
    steps += `<li><strong>Input:</strong> ${inputNum} (Basis ${inputBase})</li>`;
    steps += `<li><strong>Target Output:</strong> Basis ${outputBase}</li>`;

    try {
        // Step 1: Convert input to decimal
        const decimalValue = toDecimal(inputNum, inputBase, steps);

        // Step 2: Convert decimal to desired output base
        const finalResult = fromDecimal(decimalValue, outputBase, steps);

        convertedResultSpan.textContent = finalResult;
        steps += `<li><strong>Hasil Akhir:</strong> ${finalResult} (Basis ${outputBase})</li>`;

    } catch (e) {
        steps += `<p class="error">${e.message}</p>`;
        setTimeout(() => {
            conversionStepsDiv.querySelector('.error').classList.add('show');
        }, 100);
    }
    conversionStepsDiv.innerHTML = steps;

    animateElements(Array.from(resultItems));
    const stepElements = conversionStepsDiv.querySelectorAll('li');
    animateElements(Array.from(stepElements));
}

// --- Fungsi Utama Kalkulator Bilangan ---
function calculateNumber(operation) {
    const input1Str = document.getElementById('calcInput1').value.trim();
    const input2Str = document.getElementById('calcInput2').value.trim();
    const input1Base = parseInt(document.getElementById('calcInput1Base').value);
    const input2Base = parseInt(document.getElementById('calcInput2Base').value);
    const resultBase = parseInt(document.getElementById('calcResultBase').value);
    const calcResultSpan = document.getElementById('calcResult');
    const calculationStepsDiv = document.getElementById('calculationSteps');

    calcResultSpan.textContent = ''; // Clear previous result
    calculationStepsDiv.innerHTML = ''; // Clear previous steps

    const calcResultItem = document.querySelector('.calc-result-section .result-item');
    calcResultItem.classList.remove('show');

    // Validasi input
    let validationError1 = validateInput(input1Str, input1Base, calculationStepsDiv);
    let validationError2 = validateInput(input2Str, input2Base, calculationStepsDiv);

    if (validationError1) {
        calculationStepsDiv.innerHTML = `<p class="error">${validationError1}</p>`;
        setTimeout(() => { calculationStepsDiv.querySelector('.error').classList.add('show'); }, 100);
        return;
    }
    if (validationError2) {
        calculationStepsDiv.innerHTML = `<p class="error">${validationError2}</p>`;
        setTimeout(() => { calculationStepsDiv.querySelector('.error').classList.add('show'); }, 100);
        return;
    }

    let steps = '<ul>';
    steps += `<li><strong>Bilangan 1:</strong> ${input1Str} (Basis ${input1Base})</li>`;
    steps += `<li><strong>Bilangan 2:</strong> ${input2Str} (Basis ${input2Base})</li>`;
    steps += `<li><strong>Operasi:</strong> ${operation}</li>`;
    steps += `<li><strong>Basis Hasil:</strong> Basis ${resultBase}</li>`;

    try {
        // Konversi kedua input ke desimal
        steps += `<li><strong>Konversi Input ke Desimal:</strong></li>`;
        const dec1 = toDecimal(input1Str, input1Base, steps);
        const dec2 = toDecimal(input2Str, input2Base, steps);

        let resultDecimal;
        steps += `<li><strong>Kalkulasi Desimal:</strong></li>`;
        switch (operation) {
            case 'add':
                resultDecimal = dec1 + dec2;
                steps += `<li>${dec1} + ${dec2} = ${resultDecimal}</li>`;
                break;
            case 'subtract':
                if (dec2 > dec1) {
                    throw new Error('Pengurangan ini akan menghasilkan bilangan negatif, yang tidak didukung untuk saat ini.');
                }
                resultDecimal = dec1 - dec2;
                steps += `<li>${dec1} - ${dec2} = ${resultDecimal}</li>`;
                break;
            case 'multiply':
                resultDecimal = dec1 * dec2;
                steps += `<li>${dec1} * ${dec2} = ${resultDecimal}</li>`;
                break;
            case 'divide':
                if (dec2 === 0) {
                    throw new Error('Tidak bisa dibagi dengan nol!');
                }
                resultDecimal = Math.floor(dec1 / dec2); // Pembagian bilangan bulat
                steps += `<li>${dec1} / ${dec2} = ${resultDecimal} (Hasil Integer)</li>`;
                break;
        }

        // Konversi hasil desimal ke basis output yang diinginkan
        steps += `<li><strong>Konversi Hasil Desimal ke Basis ${resultBase}:</strong></li>`;
        const finalResult = fromDecimal(resultDecimal, resultBase, steps);

        calcResultSpan.textContent = finalResult;
        steps += `<li><strong>Hasil Akhir:</strong> ${finalResult} (Basis ${resultBase})</li>`;

    } catch (e) {
        steps += `<p class="error">${e.message}</p>`;
        setTimeout(() => { calculationStepsDiv.querySelector('.error').classList.add('show'); }, 100);
    }
    calculationStepsDiv.innerHTML = steps;

    animateElements(Array.from([calcResultItem])); // Animate only the result item
    const calcStepElements = calculationStepsDiv.querySelectorAll('li');
    animateElements(Array.from(calcStepElements));
}