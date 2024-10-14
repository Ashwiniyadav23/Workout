let workoutHistory = [];
const API_URL = "http://localhost:5001/api/workouts";  

document.getElementById('logWorkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const exerciseType = document.getElementById('exerciseType').value;
    const duration = document.getElementById('duration').value;
    const intensity = document.getElementById('intensity').value;

    const newWorkout = {
        exerciseType,
        duration: Number(duration),
        intensity: Number(intensity),
        date: new Date().toLocaleDateString(),
        caloriesBurned: calculateCaloriesBurned(Number(duration), Number(intensity))
    };
    
    workoutHistory.push(newWorkout);
    updateDashboard(workoutHistory);
    updateSummary(workoutHistory);
    updateHistoryTable(workoutHistory); 
    
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to save workout: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Workout saved:', data);
    })
    .catch(error => console.error('Error saving workout:', error));

    document.getElementById('logWorkoutForm').reset();
});

function calculateCaloriesBurned(duration, intensity) {
    return duration * intensity * 5;
}

function updateDashboard(workouts) {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((acc, workout) => acc + workout.duration, 0);
    const totalCalories = workouts.reduce((acc, workout) => acc + workout.caloriesBurned, 0);

    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalDuration').textContent = (totalDuration / 60).toFixed(2) + ' hours';
    document.getElementById('totalCalories').textContent = totalCalories + ' kcal';
}

function updateSummary(workouts) {
    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = '';  
    workouts.forEach(workout => {
        const listItem = document.createElement('li');
        listItem.textContent = `${workout.exerciseType} for ${workout.duration} mins at intensity ${workout.intensity} (burned ${workout.caloriesBurned} kcal)`;
        summaryList.appendChild(listItem);
    });
}

function updateHistoryTable(workouts) {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';  
    workouts.forEach(workout => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${workout.date}</td>
            <td>${workout.exerciseType}</td>
            <td>${workout.duration}</td>
            <td>${workout.intensity}</td>
            <td>${workout.caloriesBurned} kcal</td>
        `;
        historyBody.appendChild(row);
    });
}
