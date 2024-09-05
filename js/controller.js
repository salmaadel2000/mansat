document.addEventListener("DOMContentLoaded", function () {
    // Load the modal HTML content first
    loadHTMLContent();

    // Function to load HTML content into the modal
    function loadHTMLContent() {
        fetch('../controller/index.html') // URL of the HTML content
            .then(response => response.text())
            .then(data => {
                document.getElementById('modal').innerHTML = data;

                // After the content is loaded, attach event listeners
                attachEventListeners();
                attachTabListeners(); // Attach tab listeners here
                attachLinkManagementListeners(); // Attach listeners for link management
            })
            .catch(error => console.error('Error loading content:', error));
    }

    function attachEventListeners() {
        const layoutIconPlus = document.querySelector('.layout-icon-plus');

        if (layoutIconPlus) {
            layoutIconPlus.addEventListener('click', function () {
                const additionalRecipient = document.querySelector('.layout-modal-additional-recipient');
                const optionalRecipient = document.querySelector('.layout-modal-optional');

                // Toggle display state
                const isVisible = additionalRecipient.style.display === 'block';
                additionalRecipient.style.display = isVisible ? 'none' : 'block';
                optionalRecipient.style.display = isVisible ? 'block' : 'none';
            });
        } else {
            console.error('Element with class .layout-icon-plus not found.');
        }
    }

    // Function to attach tab listeners for "بيانات المراسلة" and "مرفقات المراسلة"
    function attachTabListeners() {
        const messageDataTab = document.getElementById('messageDataTab');
        const attachmentsTab = document.getElementById('attachmentsTab');
        const messageDataContent = document.getElementById('messageDataContent');
        const attachmentsContent = document.getElementById('attachmentsContent');

        if (!messageDataTab || !attachmentsTab || !messageDataContent || !attachmentsContent) {
            console.error("One or more elements not found. Please check the IDs in your HTML.");
            return;
        }

        // Function to show the selected tab content
        function showTabContent(contentToShow, tabToActivate, contentToHide, tabToDeactivate) {
            contentToShow.style.display = 'block';
            tabToActivate.classList.add('active');
            contentToHide.style.display = 'none';
            tabToDeactivate.classList.remove('active');
        }

        messageDataTab.addEventListener('click', function () {
            showTabContent(messageDataContent, messageDataTab, attachmentsContent, attachmentsTab);
        });

        attachmentsTab.addEventListener('click', function () {
            showTabContent(attachmentsContent, attachmentsTab, messageDataContent, messageDataTab);
        });

        // Initially show the first tab content
        showTabContent(messageDataContent, messageDataTab, attachmentsContent, attachmentsTab);
    }

    // Function to attach event listeners for adding, editing, and deleting links
    function attachLinkManagementListeners() {
        const plusIcon = document.getElementById('addlink');
        const linkInput = document.getElementById("recipientNamelink");
        const linkList = document.getElementById("linkList");

        if (!plusIcon || !linkInput || !linkList) {
            console.error("One or more elements for link management not found. Please check the classes and IDs in your HTML.");
            return;
        }

        plusIcon.addEventListener("click", function () {
            const linkValue = linkInput.value.trim();

            if (linkValue) {
                const linkContainer = document.createElement("div");
                linkContainer.classList.add("link-container");

                const titleParagraph = document.createElement("p");
                titleParagraph.textContent = "عنوان الرابط";

                const newLink = document.createElement("a");
                newLink.classList.add("new-link");
                newLink.href = linkValue;
                newLink.textContent = linkValue;

                const iconDiv = document.createElement("div");
                iconDiv.classList.add("icon-container");

                const editIcon = document.createElement("i");
                editIcon.classList.add("fa-solid", "fa-pen-to-square", "edit-icon");

                const deleteIcon = document.createElement("i");
                deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");

                iconDiv.appendChild(editIcon);
                iconDiv.appendChild(deleteIcon);

                const iconDivLink = document.createElement("div");
                iconDivLink.classList.add("link-icon");
                iconDivLink.appendChild(newLink);
                iconDivLink.appendChild(iconDiv);

                linkContainer.appendChild(titleParagraph);
                linkContainer.appendChild(iconDivLink);

                linkList.appendChild(linkContainer);

                editIcon.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    const editModal = new bootstrap.Modal(document.getElementById('editModal'), {
                        backdrop: 'static',
                        keyboard: false
                    });
                    editModal.show();

                    const editInput = document.getElementById('editLinkInput');
                    editInput.value = linkValue;

                    document.getElementById('saveEditButton').onclick = function () {
                        const newLinkValue = editInput.value.trim();
                        if (newLinkValue !== "") {
                            newLink.textContent = newLinkValue;
                            newLink.href = newLinkValue;

                            linkContainer.appendChild(iconDivLink);
                            editModal.hide();
                        }
                    };
                });

                deleteIcon.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    Swal.fire({
                        title: 'هل أنت متأكد؟',
                        text: "لن تتمكن من التراجع عن هذا!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'نعم، احذفه!',
                        cancelButtonText: 'إلغاء'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            linkContainer.remove();
                            Swal.fire(
                                'تم الحذف!',
                                'تم حذف الرابط بنجاح.',
                                'success'
                            );
                        }
                    });
                });

                linkInput.value = "";
            } else {
                console.log("No link found");
            }
        });
    }



});
