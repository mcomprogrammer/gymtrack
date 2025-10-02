package org.example.gymtracker.repository;

import org.example.gymtracker.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    Optional<Workout> findByDate(LocalDate date);

    @Query("SELECT YEAR(w.date) as year, MONTH(w.date) as month, COUNT(w) as count FROM Workout w GROUP BY year, month ORDER BY year, month")
    List<Object[]> countWorkoutsPerMonthRaw();

    default Map<String, Long> countWorkoutsPerMonth() {
        return countWorkoutsPerMonthRaw().stream()
                .collect(Collectors.toMap(
                        row -> String.format("%d-%02d", row[0], row[1]), // Format as YYYY-MM
                        row -> (Long) row[2]
                ));
    }
}
