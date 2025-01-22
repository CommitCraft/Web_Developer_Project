let userID = localStorage.getItem('userID') || null;
const movieSelect = document.getElementById('movie');
const count = document.getElementById('count');
const total = document.getElementById('total');
const loginBtn = document.getElementById('loginBtn');
const bookBtn = document.getElementById('bookBtn');
const theater = document.getElementById('theater');

let selectedSeats = [];
let ticketPrice = 0;
let bookedSeats = [];

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.classList.add('hidden');
    }, 3000);
}

function renderSeats() {
    theater.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        if (bookedSeats.includes(i)) {
            seat.classList.add('occupied');
        } else {
            seat.addEventListener('click', () => {
                seat.classList.toggle('selected');
                updateSelectedSeats();
            });
        }
        theater.appendChild(seat);
    }
}

function updateSelectedSeats() {
    const selectedSeatsElements = document.querySelectorAll('.seat.selected:not(.occupied)');
    selectedSeats = [...selectedSeatsElements].map(seat => [...theater.children].indexOf(seat));
    count.innerText = selectedSeats.length;
    total.innerText = (selectedSeats.length * ticketPrice).toFixed(2);
}

function fetchBookedSeats(movieID) {
    fetch(`http://localhost:3002/booked-seats/${movieID}`)
        .then(res => res.json())
        .then(data => {
            bookedSeats = data;
            renderSeats();
        })
        .catch(err => alert('Failed to fetch booked seats.'));
}

loginBtn.addEventListener('click', () => {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
    }

    fetch('http://localhost:3002/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber: phone })
    })
    .then(res => res.json())
    .then(data => {
        if (data.userID) {
            userID = data.userID;
            localStorage.setItem('userID', userID);
            alert(data.message);
        } else {
            alert('Failed to login/register. Please try again.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Retrieved userID from localStorage:', userID);
    fetch('http://localhost:3002/movies')
        .then(res => res.json())
        .then(data => {
            movieSelect.innerHTML = data.map(
                movie => `<option value="${movie.MovieID}" data-price="${movie.Price}">${movie.Name} ($${movie.Price})</option>`
            ).join('');
            ticketPrice = +movieSelect.options[0].dataset.price;
            fetchBookedSeats(movieSelect.value);

            movieSelect.addEventListener('change', e => {
                ticketPrice = +e.target.selectedOptions[0].dataset.price;
                fetchBookedSeats(movieSelect.value);
            });
        });
});

bookBtn.addEventListener('click', () => {
    if (!userID) {
        alert('Please login before booking.');
        return;
    }

    if (selectedSeats.length === 0) {
        alert('Please select seats to book.');
        return;
    }

    fetch('http://localhost:3002/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, movieID: movieSelect.value, seats: selectedSeats })
    })
    .then(res => res.json())
    .then(data => {
        showToast(data.message);
        fetchBookedSeats(movieSelect.value);
    });
});
