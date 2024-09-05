document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".layout-nav-link");

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove active class from other links
            links.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            // Load content dynamically
            const page = this.getAttribute("href");
            fetch(page)
                .then(response => response.text())
                .then(data => {
                    // Extract only the main content from the fetched HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const newContent = doc.querySelector('#content').innerHTML;

                    document.getElementById("content").innerHTML = newContent;
                    // Select the elements
                    const dashboardContainer = document.querySelector('.dashboard-container');
                    const dashboardHiddenPart = document.querySelector('.dashboard-container-hidden-part');
                    const backbtn = document.getElementById('back-btn');
                    // Select all elements with the class 'dynamic-card'
                    const dynamicCards = document.querySelectorAll('.dynamic-card');

                    // Loop through each card and add the event listener
                    dynamicCards.forEach((cardItem) => {
                        cardItem.addEventListener('click', () => {
                            // Add the 'hidden' class to dashboardContainer
                            dashboardContainer.classList.add('hidden');

                            // Remove the 'hidden' class from dashboardHiddenPart
                            dashboardHiddenPart.classList.remove('hidden');
                        });
                    });

                    backbtn.addEventListener('click', () => {
                        // Add the 'hidden' class to dashboardContainer
                        dashboardContainer.classList.remove('hidden');
                        // Remove the 'hidden' class from dashboardHiddenPart
                        dashboardHiddenPart.classList.add('hidden');
                    });

                })
                .catch(error => console.error('Error loading content:', error));
        });
    });
});
