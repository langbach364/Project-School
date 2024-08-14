document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            menuItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

