document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('task-input');
            const addTaskBtn = document.getElementById('add-task-btn');
            const tasksContainer = document.getElementById('tasks-container');
            const timeModal = document.getElementById('time-modal');
            const confirmTimeBtn = document.getElementById('confirm-time-btn');
            const cancelTimeBtn = document.getElementById('cancel-time-btn');
            const taskHour = document.getElementById('task-hour');
            const taskMinute = document.getElementById('task-minute');
            const taskPeriod = document.getElementById('task-period');
            
            let currentTaskText = '';
            
            // Populate hour dropdown
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                taskHour.appendChild(option);
            }
            
            // Populate minute dropdown
            for (let i = 0; i < 60; i += 5) {
                const option = document.createElement('option');
                option.value = i < 10 ? '0' + i : i;
                option.textContent = i < 10 ? '0' + i : i;
                taskMinute.appendChild(option);
            }
            
            // Load tasks from localStorage
            loadTasks();
            
            // Add task when button is clicked
            addTaskBtn.addEventListener('click', function() {
                currentTaskText = taskInput.value.trim();
                
                if (currentTaskText === '') {
                    alert('Please enter a task!');
                    return;
                }
                
                // Show time selection modal
                timeModal.style.display = 'flex';
            });
            
            // Add task when Enter key is pressed
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    currentTaskText = taskInput.value.trim();
                    
                    if (currentTaskText === '') {
                        alert('Please enter a task!');
                        return;
                    }
                    
                    // Show time selection modal
                    timeModal.style.display = 'flex';
                }
            });
            
            // Confirm time selection
            confirmTimeBtn.addEventListener('click', function() {
                const hour = taskHour.value;
                const minute = taskMinute.value;
                const period = taskPeriod.value;
                
                if (!hour || !minute || !period) {
                    alert('Please select a valid time!');
                    return;
                }
                
                const taskTime = `${hour}:${minute} ${period}`;
                addTaskWithTime(currentTaskText, taskTime);
                
                // Hide modal and reset inputs
                timeModal.style.display = 'none';
                taskHour.value = '';
                taskMinute.value = '';
                taskPeriod.value = '';
                
                // Clear task input
                taskInput.value = '';
                taskInput.focus();
            });
            
            // Cancel time selection
            cancelTimeBtn.addEventListener('click', function() {
                timeModal.style.display = 'none';
                taskInput.focus();
            });
            
            function addTaskWithTime(taskText, taskTime) {
                // Create task element
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                
                const taskContent = document.createElement('div');
                taskContent.classList.add('task-text');
                
                const taskTitle = document.createElement('div');
                taskTitle.textContent = taskText;
                
                const timeDisplay = document.createElement('div');
                timeDisplay.classList.add('task-time');
                timeDisplay.innerHTML = `<i class="far fa-clock"></i> ${taskTime}`;
                
                taskContent.appendChild(taskTitle);
                taskContent.appendChild(timeDisplay);
                
                const taskActions = document.createElement('div');
                taskActions.classList.add('task-actions');
                
                const completeBtn = document.createElement('button');
                completeBtn.classList.add('complete-btn');
                completeBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                
                taskActions.appendChild(completeBtn);
                taskActions.appendChild(deleteBtn);
                
                taskElement.appendChild(taskContent);
                taskElement.appendChild(taskActions);
                
                // Button's functions
                completeBtn.addEventListener('click', function() {
                    taskElement.classList.toggle('completed');
                    saveTasks();
                });
                
                deleteBtn.addEventListener('click', function() {
                    taskElement.remove();
                    saveTasks();
                    checkEmptyState();
                });
                
                // Remove empty state if it exists
                const emptyState = tasksContainer.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                
                tasksContainer.appendChild(taskElement);
                
                // Save tasks to localStorage
                saveTasks();
            }
            
            function saveTasks() {
                const tasks = [];
                document.querySelectorAll('.task').forEach(task => {
                    const taskText = task.querySelector('.task-text div:first-child').textContent;
                    const taskTime = task.querySelector('.task-time') ? 
                        task.querySelector('.task-time').textContent.replace('⏰ ', '') : '';
                    
                    tasks.push({
                        text: taskText,
                        time: taskTime,
                        completed: task.classList.contains('completed')
                    });
                });
                
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            function loadTasks() {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                
                if (tasks.length > 0) {
                    // Remove empty state
                    const emptyState = tasksContainer.querySelector('.empty-state');
                    if (emptyState) {
                        emptyState.remove();
                    }
                    
                    // Add tasks from storage
                    tasks.forEach(taskData => {
                        const taskElement = document.createElement('div');
                        taskElement.classList.add('task');
                        if (taskData.completed) {
                            taskElement.classList.add('completed');
                        }
                        
                        const taskContent = document.createElement('div');
                        taskContent.classList.add('task-text');
                        
                        const taskTitle = document.createElement('div');
                        taskTitle.textContent = taskData.text;
                        
                        taskContent.appendChild(taskTitle);
                        
                        // Add time if it exists
                        if (taskData.time) {
                            const timeDisplay = document.createElement('div');
                            timeDisplay.classList.add('task-time');
                            timeDisplay.innerHTML = `<i class="far fa-clock"></i> ${taskData.time}`;
                            taskContent.appendChild(timeDisplay);
                        }
                        
                        const taskActions = document.createElement('div');
                        taskActions.classList.add('task-actions');
                        
                        const completeBtn = document.createElement('button');
                        completeBtn.classList.add('complete-btn');
                        completeBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.classList.add('delete-btn');
                        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                        
                        taskActions.appendChild(completeBtn);
                        taskActions.appendChild(deleteBtn);
                        
                        taskElement.appendChild(taskContent);
                        taskElement.appendChild(taskActions);
                        
                        // Add event listeners for buttons
                        completeBtn.addEventListener('click', function() {
                            taskElement.classList.toggle('completed');
                            saveTasks();
                        });
                        
                        deleteBtn.addEventListener('click', function() {
                            taskElement.remove();
                            saveTasks();
                            checkEmptyState();
                        });
                        
                        tasksContainer.appendChild(taskElement);
                    });
                }
            }
            
            function checkEmptyState() {
                if (tasksContainer.children.length === 0) {
                    const emptyState = document.createElement('div');
                    emptyState.classList.add('empty-state');
                    emptyState.innerHTML = `
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No tasks yet</h3>
                        <p>Add a task to get started</p>
                    `;
                    tasksContainer.appendChild(emptyState);
                }
            }
        });