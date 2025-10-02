document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const viewDateEl = document.getElementById('view-date');
    const dailyWorkoutViewEl = document.getElementById('daily-workout-view');
    const totalWorkoutsEl = document.getElementById('total-workouts');
    const mostFrequentExerciseEl = document.getElementById('most-frequent-exercise');
    const workoutsPerMonthEl = document.getElementById('workouts-per-month');
    const API_URL = '/api';

    // --- State ---
    let currentWorkout = null;

    // --- Stats Functions ---
    const fetchAndRenderStats = async () => {
        try {
            const [totalWorkoutsRes, mostFrequentExRes, workoutsPerMonthRes] = await Promise.all([
                fetch(`${API_URL}/stats/total-workouts`),
                fetch(`${API_URL}/stats/most-frequent-exercise`),
                fetch(`${API_URL}/stats/workouts-per-month`)
            ]);

            totalWorkoutsEl.textContent = await totalWorkoutsRes.json();

            if (mostFrequentExRes.ok) {
                mostFrequentExerciseEl.textContent = await mostFrequentExRes.text();
            } else {
                mostFrequentExerciseEl.textContent = 'N/A';
            }

            const workoutsPerMonth = await workoutsPerMonthRes.json();
            workoutsPerMonthEl.innerHTML = '';
            if (Object.keys(workoutsPerMonth).length === 0) {
                workoutsPerMonthEl.innerHTML = '<li>No workouts recorded yet.</li>';
                return;
            }
            for (const [month, count] of Object.entries(workoutsPerMonth)) {
                const li = document.createElement('li');
                li.textContent = `${month}: ${count} workout(s)`;
                workoutsPerMonthEl.appendChild(li);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    // --- Main Functions ---
    const renderDailyView = async (date) => {
        dailyWorkoutViewEl.innerHTML = ''; // Clear previous view
        let exercises = [];

        try {
            const workoutRes = await fetch(`${API_URL}/workouts/by-date?date=${date}`);
            if (workoutRes.ok) {
                currentWorkout = await workoutRes.json();
                const exercisesRes = await fetch(`${API_URL}/workouts/${currentWorkout.id}/exercises`);
                exercises = await exercisesRes.json();
            } else {
                currentWorkout = null;
            }
        } catch (error) {
            console.error('Error fetching workout for date:', error);
            currentWorkout = null;
        }

        const workoutContainer = document.createElement('div');
        workoutContainer.className = 'daily-workout-container';

        const title = document.createElement('h2');
        title.textContent = `Workout for ${date}`;
        workoutContainer.appendChild(title);

        if (exercises.length > 0) {
            const list = document.createElement('ul');
            list.className = 'exercise-list';
            exercises.forEach(ex => list.appendChild(createExerciseItem(ex)));
            workoutContainer.appendChild(list);
        } else {
            workoutContainer.innerHTML += '<p>No exercises logged for this date.</p>';
        }

        workoutContainer.appendChild(createExerciseForm());
        dailyWorkoutViewEl.appendChild(workoutContainer);
    };

    const getOrCreateWorkoutForDate = async (date) => {
        if (currentWorkout && currentWorkout.date === date) {
            return currentWorkout;
        }
        try {
            const response = await fetch(`${API_URL}/workouts/by-date?date=${date}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            // Fall through to create
        }

        // If not found or error, create it
        const newWorkoutResponse = await fetch(`${API_URL}/workouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date }),
        });
        return await newWorkoutResponse.json();
    };

    const saveExercise = async (e) => {
        e.preventDefault();
        const form = e.target;
        const date = viewDateEl.value;

        const exerciseData = {
            exerciseName: form.querySelector('select[name="exercise-name"]').value,
            sets: form.querySelector('input[name="sets"]').value,
            reps: form.querySelector('input[name="reps"]').value,
            weight: form.querySelector('input[name="weight"]').value,
        };

        const workout = await getOrCreateWorkoutForDate(date);
        await fetch(`${API_URL}/workouts/${workout.id}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exerciseData),
        });

        await renderDailyView(date);
        await fetchAndRenderStats();
    };

    const deleteExercise = async (exerciseId) => {
        await fetch(`${API_URL}/exercises/${exerciseId}`, { method: 'DELETE' });
        await renderDailyView(viewDateEl.value);
        await fetchAndRenderStats();
    };

    // --- UI Rendering ---
    const createExerciseItem = (exercise) => {
        const item = document.createElement('li');
        item.className = 'exercise-item';
        item.innerHTML = `
            <span>${exercise.exerciseName} - ${exercise.sets}x${exercise.reps} @ ${exercise.weight}kg</span>
            <div class="buttons">
                <button class="delete-btn">Delete</button>
            </div>
        `;
        item.querySelector('.delete-btn').addEventListener('click', () => deleteExercise(exercise.id));
        return item;
    };

    const createExerciseForm = () => {
        const form = document.createElement('form');
        form.id = 'daily-exercise-form';
        form.innerHTML = `
            <h3>Add New Exercise</h3>
            <select name="exercise-name" required>
                <option value="" disabled selected>Select Exercise</option>
                <option value="Squat">Squat</option>
                <option value="Bench Press">Bench Press</option>
                <option value="Deadlift">Deadlift</option>
                <option value="Overhead Press">Overhead Press</option>
                <option value="Barbell Row">Barbell Row</option>
            </select>
            <input type="number" name="sets" placeholder="Sets" required>
            <input type="number" name="reps" placeholder="Reps" required>
            <input type="number" name="weight" placeholder="Weight (kg)" step="0.1" required>
            <button type="submit">Add Exercise</button>
        `;
        form.addEventListener('submit', saveExercise);
        return form;
    };

    // --- Initial Load ---
    const today = new Date().toISOString().split('T')[0];
    viewDateEl.value = today;
    fetchAndRenderStats();
    renderDailyView(today);

    viewDateEl.addEventListener('change', (e) => renderDailyView(e.target.value));
});
