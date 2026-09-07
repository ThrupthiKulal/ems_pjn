package com.example.demo.service;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByEmployeeId(Long employeeId) {
        return taskRepository.findByAssignedToId(employeeId);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(taskDetails.getStatus());
        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
        if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());
        if (taskDetails.getPriority() != null) task.setPriority(taskDetails.getPriority());
        return taskRepository.save(task);
    }

    public Task submitTask(Long id, String screenshotBase64) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(Task.TaskStatus.COMPLETED);
        task.setScreenshotBase64(screenshotBase64);
        task.setReviewStatus(Task.ReviewStatus.PENDING);
        task.setSubmissionDate(java.time.LocalDate.now());
        return taskRepository.save(task);
    }

    public Task reviewTask(Long id, Task.ReviewStatus reviewStatus, String rejectionReason) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setReviewStatus(reviewStatus);
        if (reviewStatus == Task.ReviewStatus.REJECTED) {
            task.setRejectionReason(rejectionReason);
        } else {
            task.setRejectionReason(null);
        }
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
