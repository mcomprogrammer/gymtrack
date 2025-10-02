package org.example.gymtracker.controller;

import org.example.gymtracker.model.Exercise;
import org.example.gymtracker.model.Workout;
import org.example.gymtracker.repository.ExerciseRepository;
import org.example.gymtracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @GetMapping("/workouts/{workoutId}/exercises")
    public ResponseEntity<List<Exercise>> getExercisesByWorkoutId(@PathVariable Long workoutId) {
        if (!workoutRepository.existsById(workoutId)) {
            return ResponseEntity.notFound().build();
        }
        List<Exercise> exercises = exerciseRepository.findByWorkoutId(workoutId);
        return ResponseEntity.ok(exercises);
    }

    @PostMapping("/workouts/{workoutId}/exercises")
    public ResponseEntity<Exercise> createExercise(@PathVariable Long workoutId, @RequestBody Exercise exercise) {
        Optional<Workout> optionalWorkout = workoutRepository.findById(workoutId);
        if (optionalWorkout.isPresent()) {
            exercise.setWorkout(optionalWorkout.get());
            return ResponseEntity.ok(exerciseRepository.save(exercise));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise exerciseDetails) {
        Optional<Exercise> optionalExercise = exerciseRepository.findById(id);
        if (optionalExercise.isPresent()) {
            Exercise exercise = optionalExercise.get();
            exercise.setExerciseName(exerciseDetails.getExerciseName());
            exercise.setSets(exerciseDetails.getSets());
            exercise.setReps(exerciseDetails.getReps());
            exercise.setWeight(exerciseDetails.getWeight());
            return ResponseEntity.ok(exerciseRepository.save(exercise));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        if (exerciseRepository.existsById(id)) {
            exerciseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
