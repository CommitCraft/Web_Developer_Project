let generatedOTP = '';

document.getElementById('generate-otp-btn').addEventListener('click', () => {
    generatedOTP = generateOTP(6); // Generate 6-digit OTP
    document.getElementById('generated-otp').textContent = `Your OTP: ${generatedOTP}`;
    document.getElementById('verification-result').textContent = '';
});

document.getElementById('verify-otp-btn').addEventListener('click', () => {
    const userInput = document.getElementById('otp-input').value;
    const resultElement = document.getElementById('verification-result');

    if (userInput === generatedOTP) {
        resultElement.textContent = 'OTP Verified Successfully!';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'Incorrect OTP. Please try again.';
        resultElement.style.color = 'red';
    }
});

function generateOTP(length) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10); // Append random digit
    }
    return otp;
}
