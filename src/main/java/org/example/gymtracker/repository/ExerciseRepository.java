package org.example.gymtracker.repository;

import org.example.gymtracker.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByWorkoutId(Long workoutId);

    @Query("SELECT e.exerciseName, COUNT(e) FROM Exercise e GROUP BY e.exerciseName ORDER BY COUNT(e) DESC")
    List<Object[]> findMostFrequentExercise();
}
