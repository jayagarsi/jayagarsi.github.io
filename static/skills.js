document.querySelectorAll('.chip-list').forEach(list => {
  // Create one shared proficiency panel per group, appended after the chips
  const panel = document.createElement('div');
  panel.className = 'skill-proficiency';
  panel.innerHTML = `
    <div class="skill-proficiency-label">
      <span class="skill-name"></span>
      <span class="skill-level-text"></span>
    </div>
    <div class="skill-proficiency-track">
      <div class="skill-proficiency-fill"></div>
    </div>
  `;
  list.after(panel);

  list.querySelectorAll('.skill-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');

      // Reset all chips in this group
      list.querySelectorAll('.skill-chip').forEach(c => c.classList.remove('active'));

      if (isActive) {
        // Clicking an already-active chip closes the panel
        panel.classList.remove('visible');
        return;
      }

      chip.classList.add('active');
      const name = chip.querySelector('span').textContent;
      const level = chip.dataset.level;
      const label = chip.dataset.label;

      panel.querySelector('.skill-name').textContent = name;
      panel.querySelector('.skill-level-text').textContent = label;
      panel.querySelector('.skill-proficiency-fill').style.width = `${level}%`;
      panel.classList.add('visible');
    });
  });
});