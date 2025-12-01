document.addEventListener("DOMContentLoaded", () => {
  const accessToken = 'YOUR_TOKEN_HERE';
  const apiUrl = 'https://sticossandbox.docebosaas.com/learn/v1/courses';
  const generateBtn = document.getElementById('generatePlanBtn');
  const suggestionsContainer = document.querySelector('.course-suggestions');

  const mockCourses = [
    {
      name: "Mock Course A",
      short_description: "This is a fallback course.",
      course_type: "elearning",
      language_code: "en",
      ce_hours: 2,
      validity_date: "2026-01-01"
    },
    {
      name: "Mock Course B",
      short_description: "Use real data locally.",
      course_type: "webinar",
      language_code: "no",
      ce_hours: 1,
      validity_date: "2025-12-31"
    }
  ];

  generateBtn.addEventListener("click", () => {
    const prompt = document.querySelector('.planner-input').value.toLowerCase();

    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Fetch failed");
        return response.json();
      })
      .then(data => {
        const courses = data.data.items;
        renderCourses(courses);
      })
      .catch(error => {
        console.warn("Using mock courses due to error:", error);
        renderCourses(mockCourses);
      });
  });

  function renderCourses(courses) {
    suggestionsContainer.innerHTML = '';
    const prompt = document.querySelector('.planner-input').value.toLowerCase();

    const filtered = courses.filter(course => {
      const text = `${course.name} ${course.short_description || ''}`.toLowerCase();
      return prompt.split(/\s+/).some(word => text.includes(word));
    });

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
  }
});
