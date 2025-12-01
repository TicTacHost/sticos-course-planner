document.addEventListener("DOMContentLoaded", () => {
  const accessToken = '107efaea498175869284e977ba14c404466d3e06'; // Use your valid token here
  const apiUrl = 'https://sticossandbox.docebosaas.com/learn/v1/courses';
  const generateBtn = document.getElementById('generatePlanBtn');
  const suggestionsContainer = document.querySelector('.course-suggestions');

  generateBtn.addEventListener("click", () => {
    const prompt = document.querySelector('.planner-input').value.toLowerCase();

    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const courses = data.data.items;

        // Filter based on prompt (basic keyword matching)
        const filtered = courses.filter(course => {
          const text = `${course.name} ${course.short_description || ''}`.toLowerCase();
          return prompt.split(/\s+/).some(word => text.includes(word));
        });

        // Show filtered or fallback
        suggestionsContainer.innerHTML = '';
        const displayCourses = filtered.length ? filtered : courses;

        displayCourses.slice(0, 5).forEach(course => {
          const card = document.createElement('div');
          card.className = 'course-card';
          card.innerHTML = `
            <h3>${course.name}</h3>
            <p>${course.short_description || ''}</p>
            <div class="tags">
              <span class="tag">${course.course_type || 'Course'}</span>
              <span class="tag">${course.language_code || 'No lang'}</span>
            </div>
            <div class="course-meta">${course.ce_hours || 'N/A'} CE hours • ${course.validity_date || 'No date'}</div>
            <div class="actions">
              <button class="add-plan">Add to My Plan</button>
              <button class="calendar-sync">Sync to Calendar</button>
              <a class="details-link" href="#">View Details</a>
            </div>
          `;
          suggestionsContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        suggestionsContainer.innerHTML = '<p>Failed to load courses.</p>';
      });
  });
});
