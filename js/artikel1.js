
document.addEventListener('DOMContentLoaded', function () {
    // Animasi Fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 70) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button visibility
    const backToTop = document.querySelector('.back-button');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
            } else {
                backToTop.style.opacity = '1'; // Always visible as a back button
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Load comments from localStorage
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    let comments = JSON.parse(localStorage.getItem('comments')) || [];

    // Function to render comments
    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            `;
            commentsList.appendChild(commentItem);
        });
    }

    // Handle form submission
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('comment-name').value;
        const email = document.getElementById('comment-email').value;
        const text = document.getElementById('comment-text').value;
        const date = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        const newComment = { name, email, text, date };
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));

        // Clear form
        commentForm.reset();

        // Render comments
        renderComments();
    });

    // Initial render
    renderComments();
});
