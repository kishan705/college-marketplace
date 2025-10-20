document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on page load
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeSwitcher.textContent = '☀️';
        } else {
            themeSwitcher.textContent = '🌙';
        }
    }

    themeSwitcher.addEventListener('click', () => {
        // Toggle the .dark-mode class on the body
        document.body.classList.toggle('dark-mode');

        let theme = 'light-mode';
        // If dark mode is active, save it and change the icon
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
            themeSwitcher.textContent = '☀️';
        } else {
            themeSwitcher.textContent = '🌙';
        }
        // Save the user's preference in local storage
        localStorage.setItem('theme', theme);
    });
});

