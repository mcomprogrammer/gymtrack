package org.example.gymtracker.controller;

import org.example.gymtracker.model.Workout;
import org.example.gymtracker.repository.ExerciseRepository;
import org.example.gymtracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping("/total-workouts")
    public Long getTotalWorkouts() {
        return workoutRepository.count();
    }

    @GetMapping("/most-frequent-exercise")
    public ResponseEntity<String> getMostFrequentExercise() {
        List<Object[]> result = exerciseRepository.findMostFrequentExercise();
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok((String) result.get(0)[0]);
    }

    @GetMapping("/workouts-per-month")
    public Map<String, Long> getWorkoutsPerMonth() {
        return workoutRepository.countWorkoutsPerMonth();
    }
}
