let isEditing = false;
let editingTaskId = null; // Changed from editingData to directly store ID

window.openModal = function(data = null) {
    document.getElementById("taskModalOverlay").classList.remove("hidden"); // Use class for visibility
    if (data) {
        isEditing = true;
        editingTaskId = data.id; // Store the ID for updates
        document.getElementById("taskModalTitle").textContent = "Edit Task"; // Update modal title
        document.getElementById("task-name").value = data.name;
        document.getElementById("task-desc").value = data.description; // Changed 'desc' to 'description' as per Firebase data

        // Clear and repopulate assigned fields
        document.getElementById("assigned-group").innerHTML = `<h4>Assigned Tasks</h4>`;
        data.assigned.forEach(item => { // Iterate over objects if assigned stores {task, person}
            const div = document.createElement("div");
            div.className = "flex gap-2 items-center assigned-entry";
            div.innerHTML = `<input type="text" value="${escapeHtml(item.task)}" placeholder="Assigned Task" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                             <input type="text" value="${escapeHtml(item.person)}" placeholder="Assigned To" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                             <button type="button" class="bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors remove-assigned-btn">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                             </button>`;
            document.getElementById("assigned-group").appendChild(div);
            // Attach remove listener
            div.querySelector('.remove-assigned-btn').onclick = function() {
                if (document.getElementById("assigned-group").children.length > 1) { div.remove(); }
                else { showAlert("Cannot remove the last assigned person field."); }
            };
        });
        if (data.assigned.length === 0) addAssigned(); // Ensure at least one empty field if none exist

        // Clear and repopulate pending fields
        document.getElementById("pending-group").innerHTML = `<h4>Pending Tasks</h4>`;
        data.pending.forEach(task => { // Iterate over strings if pending stores strings
            const div = document.createElement("div");
            div.className = "flex gap-2 items-center pending-entry";
            div.innerHTML = `<input type="text" value="${escapeHtml(task)}" placeholder="Pending Task" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                             <button type="button" class="bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors remove-pending-btn">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                             </button>`;
            document.getElementById("pending-group").appendChild(div);
            // Attach remove listener
            div.querySelector('.remove-pending-btn').onclick = function() {
                if (document.getElementById("pending-group").children.length > 1) { div.remove(); }
                else { showAlert("Cannot remove the last pending task field."); }
            };
        });
        if (data.pending.length === 0) addPending(); // Ensure at least one empty field if none exist

        document.getElementById("submitTaskBtn").textContent = "Update Task";
    } else {
        isEditing = false;
        editingTaskId = null;
        document.getElementById("taskModalTitle").textContent = "Add Task";
        resetForm();
        document.getElementById("submitTaskBtn").textContent = "Add Task";
    }
};

window.closeModal = function(modalId) { // Added modalId parameter
    document.getElementById(modalId).classList.add("hidden"); // Use class for visibility
    resetForm(); // Always reset form on close
};

function resetForm() {
    document.getElementById("task-name").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("assigned-group").innerHTML = `<h4>Assigned Tasks</h4>`; // Clear previous dynamic entries
    document.getElementById("pending-group").innerHTML = `<h4>Pending Tasks</h4>`;   // Clear previous dynamic entries
    addAssigned(); // Add one empty field by default
    addPending();  // Add one empty field by default
}

window.addAssigned = function() {
    const group = document.getElementById("assigned-group");
    const div = document.createElement("div");
    div.className = "flex gap-2 items-center assigned-entry";
    div.innerHTML = `<input type="text" placeholder="Assigned Task" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                     <input type="text" placeholder="Assigned To" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                     <button type="button" class="bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors remove-assigned-btn">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                     </button>`;
    group.appendChild(div);
    div.querySelector('.remove-assigned-btn').onclick = function() {
        if (group.children.length > 1) { div.remove(); }
        else { showAlert("Cannot remove the last assigned person field."); }
    };
};

window.addPending = function() {
    const group = document.getElementById("pending-group");
    const div = document.createElement("div");
    div.className = "flex gap-2 items-center pending-entry";
    div.innerHTML = `<input type="text" placeholder="Pending Task" class="flex-grow p-2 border border-gray-300 rounded-md text-sm">
                     <button type="button" class="bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors remove-pending-btn">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                     </button>`;
    group.appendChild(div);
    div.querySelector('.remove-pending-btn').onclick = function() {
        if (group.children.length > 1) { div.remove(); }
        else { showAlert("Cannot remove the last pending task field."); }
    };
};

window.submitTask = async function() {
    const name = document.getElementById("task-name").value.trim();
    const description = document.getElementById("task-desc").value.trim(); // Changed 'desc' to 'description'
    if (!name || !description) {
        showAlert("Task Name and Description are required."); // Use showAlert
        return;
    }

    const assignedList = [];
    document.querySelectorAll("#assigned-group .assigned-entry").forEach(entry => {
        const task = entry.children[0].value.trim();
        const person = entry.children[1].value.trim();
        if (task && person) assignedList.push({ task, person });
    });

    const pendingList = [];
    document.querySelectorAll("#pending-group .pending-entry").forEach(entry => {
        const task = entry.children[0].value.trim();
        if (task) pendingList.push(task);
    });

    const taskData = {
        name,
        description, // Use 'description'
        assigned: assignedList,
        pending: pendingList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending", // Default status
        createdBy: currentUserId // Assuming currentUserId is globally available
    };

    try {
        if (isEditing && editingTaskId) {
            await updateDoc(doc(db, "artifacts", appId, "public", "data", "tasks", editingTaskId), taskData);
            showAlert("Task updated successfully!");
        } else {
            await addDoc(collection(db, "artifacts", appId, "public", "data", "tasks"), taskData);
            showAlert("Task added successfully!");
        }
        closeModal('taskModalOverlay');
    } catch (error) {
        console.error("Error submitting task:", error);
        showAlert("Failed to submit task.");
    }
};

window.toggleAssignedStatus = function(checkbox) {
    const label = checkbox.nextElementSibling;
    const completedSection = checkbox.closest(".task-item").querySelector(".completed-tasks #completed-section"); // Traverse up to task-item

    if (checkbox.checked) {
        const div = document.createElement("div");
        div.className = "task";
        div.textContent = label.textContent;
        div.dataset.original = label.textContent;
        completedSection.appendChild(div);
        label.style.textDecoration = "line-through";
    } else {
        const found = [...completedSection.children].find(
            d => d.dataset.original === label.textContent
        );
        if (found) found.remove();
        label.style.textDecoration = "none";
    }
};

window.promotePendingToAssigned = function(button, taskName) {
    const currentTaskItem = button.closest(".task-item"); // Get the parent task item
    const currentAssignedGroup = currentTaskItem.querySelector(".task-status .ongoing-tasks-list"); // Target the ongoing list within this task
    const currentPendingDiv = button.parentElement; // The div containing the pending task

    // Get assigned person dynamically or prompt user (for this example, we'll ask)
    showConfirm(`Promote "${taskName}" to assigned. Who is it assigned to?`, () => {
        const person = prompt("Enter the name of the person this task is assigned to:");
        if (person) {
            const div = document.createElement("div");
            div.className = "task";
            div.innerHTML = `
                <input type="checkbox" onchange="toggleAssignedStatus(this)">
                <label>${escapeHtml(taskName)} → ${escapeHtml(person)}</label>
            `;
            if (currentAssignedGroup) {
                currentAssignedGroup.appendChild(div);
            } else {
                // If ongoing list doesn't exist, create it. This is more complex, might need to re-render task status entirely.
                // For simplicity, we'll assume ongoing list is always there or this needs a full re-render of the card
            }
            currentPendingDiv.remove();

            // Update the task in Firestore after promoting
            const taskId = currentTaskItem.dataset.taskId; // Assuming task-item has data-task-id
            if (taskId && db && appId) {
                // Fetch the current task data to update it
                getDoc(doc(db, "artifacts", appId, "public", "data", "tasks", taskId)).then(docSnap => {
                    if (docSnap.exists()) {
                        const taskData = docSnap.data();
                        const updatedAssigned = [...(taskData.assigned || []), { task: taskName, person }];
                        const updatedPending = (taskData.pending || []).filter(p => p !== taskName);

                        updateDoc(doc(db, "artifacts", appId, "public", "data", "tasks", taskId), {
                            assigned: updatedAssigned,
                            pending: updatedPending,
                            updatedAt: new Date().toISOString()
                        });
                    }
                }).catch(error => {
                    console.error("Error promoting task:", error);
                    showAlert("Failed to promote pending task.");
                });
            }
        }
    });
};

// Helper function for HTML escaping - essential for security
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Load tasks from Firebase
// This section needs to be called after Firebase is initialized (e.g., within checkAccessAndLoadData or window.onload)
window.loadTasks = function() {
    if (!db) {
        console.error("Firestore DB not initialized for task loading.");
        return;
    }
    const taskList = document.getElementById("taskList");
    // Listen to changes in the 'tasks' collection
    onSnapshot(collection(db, "artifacts", appId, "public", "data", "tasks"), snapshot => {
        taskList.innerHTML = ""; // Clear existing tasks
        if (snapshot.empty) {
            taskList.innerHTML = '<p class="text-gray-600 text-center">No tasks found.</p>';
            return;
        }
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const card = document.createElement("div");
            card.className = "task-item bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"; // Added Tailwind classes
            card.dataset.taskId = docSnap.id; // Store Firestore ID on the card

            const title = document.createElement("h3");
            title.className = "text-xl font-semibold text-gray-900"; // Added Tailwind classes
            title.textContent = escapeHtml(data.name);

            const description = document.createElement("p");
            description.className = "text-gray-700 mt-1 text-sm"; // Added Tailwind classes
            description.textContent = escapeHtml(data.description); // Changed 'desc' to 'description'

            const status = document.createElement("div");
            status.className = "task-status mt-3 text-sm"; // Added Tailwind classes
            // status.style.display = "none"; // Keep it hidden by default, extended by button

            const ongoingHTML = (data.assigned || []).map(item => `
                <div class="task flex items-center gap-2 mb-1">
                    <input type="checkbox" onchange="window.toggleAssignedStatus(this)">
                    <label>${escapeHtml(item.task)} → ${escapeHtml(item.person)}</label>
                </div>
            `).join("");

            const pendingHTML = (data.pending || []).map(task => `
                <div class="task flex items-center gap-2 mb-1">
                    ${escapeHtml(task)} <button onclick="window.promotePendingToAssigned(this, '${escapeHtml(task)}')" class="assign-task-btn px-2 py-0.5 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors">+ Assign</button>
                </div>
            `).join("");

            status.innerHTML = `
                <p class="text-gray-800 font-medium"><strong>Ongoing Tasks:</strong><br><div class="ongoing-tasks-list">${ongoingHTML || "None"}</div></p>
                <div class="completed-tasks mt-2">
                    <strong class="text-gray-800 font-medium">Completed:</strong><br><div id="completed-section"></div>
                </div>
                <p class="text-gray-800 font-medium mt-2"><strong>Pending Tasks:</strong><br>${pendingHTML || "None"}</p>
                <p class="text-gray-600 mt-2">Status: <span class="font-semibold ${
                    data.status === 'completed' ? 'text-green-600' :
                    data.status === 'in-progress' ? 'text-blue-600' :
                    'text-orange-600'
                }">${escapeHtml(data.status)}</span></p>
                <p class="text-gray-500 text-xs mt-1">Created: ${new Date(data.createdAt).toLocaleString()}</p>
                <p class="text-gray-500 text-xs">Last Updated: ${new Date(data.updatedAt).toLocaleString()}</p>
            `;

            const toggle = document.createElement("button");
            toggle.className = "extend-btn px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm flex items-center gap-1 mt-4"; // Added Tailwind classes
            toggle.textContent = "Extend";
            toggle.onclick = () => {
                status.style.display = status.style.display === "block" ? "none" : "block";
                toggle.textContent = status.style.display === "block" ? "Collapse" : "Extend";
            };

            const edit = document.createElement("button");
            edit.className = "edit-btn-btn px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors duration-200 text-sm flex items-center gap-1 ml-2 mt-4"; // Added Tailwind classes
            edit.textContent = "Edit";
            edit.onclick = () => {
                // Pass the whole data object including ID to openModal for editing
                window.openModal({
                    id: docSnap.id,
                    name: data.name,
                    description: data.description, // Pass 'description'
                    assigned: data.assigned || [],
                    pending: data.pending || []
                });
            };

            const deleteBtn = document.createElement("button"); // Added delete button
            deleteBtn.className = "delete-btn px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors duration-200 text-sm flex items-center gap-1 ml-2 mt-4";
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
                window.deleteTask(docSnap.id); // Call global deleteTask function
            };

            const updateStatusBtn = document.createElement("button"); // Added status update button
            updateStatusBtn.className = "update-status-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center gap-1 ml-2 mt-4";
            updateStatusBtn.textContent = "Mark In-Progress"; // Default to In-Progress
            if (data.status === 'in-progress') {
                updateStatusBtn.textContent = "Mark Completed";
                updateStatusBtn.onclick = () => window.updateTaskStatus(docSnap.id, 'completed');
            } else if (data.status === 'completed') {
                updateStatusBtn.textContent = "Reopen Task";
                updateStatusBtn.onclick = () => window.updateTaskStatus(docSnap.id, 'pending');
            } else { // pending
                updateStatusBtn.onclick = () => window.updateTaskStatus(docSnap.id, 'in-progress');
            }


            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(status);
            card.appendChild(toggle);
            card.appendChild(edit);
            card.appendChild(deleteBtn);
            card.appendChild(updateStatusBtn); // Append status button

            taskList.appendChild(card);
        });
    }, (error) => {
        console.error("Error loading tasks:", error);
        showAlert("Failed to load tasks.");
    });
};

// Placeholder/Empty Definitions for functions used by dynamic elements if they don't exist globally
// These are typically defined in the main script of the Canvas
if (typeof window.showAlert === 'undefined') {
    window.showAlert = function(message) { console.log("Alert:", message); };
}
if (typeof window.showConfirm === 'undefined') {
    window.showConfirm = function(message, callback) {
        if (confirm(message)) callback();
    };
}
if (typeof window.deleteTask === 'undefined') {
    window.deleteTask = async function(id) {
        if (!db || !appId) { showAlert("Firebase not ready."); return; }
        showConfirm("Are you sure you want to delete this task?", async () => {
            try {
                await deleteDoc(doc(db, "artifacts", appId, "public", "data", "tasks", id));
                showAlert("Task deleted successfully!");
            } catch (error) {
                console.error("Error deleting task:", error);
                showAlert("Failed to delete task.");
            }
        });
    };
}
if (typeof window.updateTaskStatus === 'undefined') {
    window.updateTaskStatus = async function(id, newStatus) {
        if (!db || !appId) { showAlert("Firebase not ready."); return; }
        try {
            await updateDoc(doc(db, "artifacts", appId, "public", "data", "tasks", id), {
                status: newStatus,
                updatedAt: new Date().toISOString(),
            });
            showAlert(`Task status updated to "${newStatus}"!`);
        } catch (error) {
            console.error("Error updating task status:", error);
            showAlert("Failed to update task status.");
        }
    };
}
// This helper should also be global if used in onclicks
if (typeof window.escapeHtml === 'undefined') {
    window.escapeHtml = function(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };
}

// Call loadTasks once Firebase is initialized (this part should be in your main initialization logic)
// Example: In your main script's onAuthStateChanged callback, after isAuthReady = true;
// loadTasks(); // <--- This line should be triggered by your main script's initialization.