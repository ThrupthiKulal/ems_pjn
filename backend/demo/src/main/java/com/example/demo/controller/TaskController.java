package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Task> getTasksByEmployeeId(@PathVariable Long employeeId) {
        return taskService.getTasksByEmployeeId(employeeId);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return org.springframework.http.ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/submit")
    public org.springframework.http.ResponseEntity<Task> submitTask(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            String screenshotBase64 = payload.get("screenshotBase64");
            Task updatedTask = taskService.submitTask(id, screenshotBase64);
            return org.springframework.http.ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/review")
    public org.springframework.http.ResponseEntity<Task> reviewTask(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            Task.ReviewStatus status = Task.ReviewStatus.valueOf(payload.get("reviewStatus"));
            String rejectionReason = payload.get("rejectionReason");
            Task updatedTask = taskService.reviewTask(id, status, rejectionReason);
            return org.springframework.http.ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
