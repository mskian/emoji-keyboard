document.addEventListener("DOMContentLoaded", function() {
  const emojisContainer = document.getElementById("emojis-container");
  const buttonsContainer = document.getElementById("buttons-container");
  
  if (!emojisContainer || !buttonsContainer) {
    console.error('Error: emojis-container or buttons-container not found.');
    return;
  }

  let emojisData = []; // Variable to store emojis data
  let currentPage = 1; // Variable to store the current page
  const emojisPerPage = 10;

  // Fetch emojis from server
  fetchEmojis();

  // Fetch emojis from server
  function fetchEmojis() {
    fetch('emojis.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch emojis');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        emojisData = data; // Store the data
        renderEmojis(emojisData);
      })
      .catch(error => {
        console.error('Error fetching emojis:', error);
        showModal('Failed to fetch emojis', 'is-danger');
      });
  }

  // Render emojis
  function renderEmojis(data) {
    emojisContainer.innerHTML = ''; // Clear previous content
    const startIndex = (currentPage - 1) * emojisPerPage;
    const endIndex = currentPage * emojisPerPage;
    if (endIndex > data.length) {
      currentPage = Math.ceil(data.length / emojisPerPage);
    }
    data.slice(startIndex, endIndex).forEach(emoji => {
      const emojiCard = createEmojiCard(emoji);
      emojisContainer.appendChild(emojiCard);
    });
    // Add load buttons if there are more emojis to load
    addLoadButtons();
  }

  // Create emoji card element
  function createEmojiCard(emoji) {
    const emojiCard = document.createElement("div");
    emojiCard.classList.add("column", "is-one-fifth-desktop", "is-one-third-tablet", "is-half-mobile", "is-flex", "is-justify-content-center");
    emojiCard.innerHTML = `
      <div class="card">
        <div class="card-content has-text-centered">
          <p class="emoji is-size-3">${emoji}</p>
        </div>
      </div>
    `;
    const cardContent = emojiCard.querySelector('.card-content');
    cardContent.addEventListener("click", function() {
      copyEmojiToClipboard(emoji);
    });
    return emojiCard;
  }  

  // Copy emoji to clipboard
  function copyEmojiToClipboard(emoji) {
    navigator.clipboard.writeText(emoji)
      .then(() => {
        console.log("Emoji copied to clipboard: " + emoji);
        showModal("Emoji copied to clipboard: " + emoji);
      })
      .catch(err => {
        console.error("Failed to copy emoji to clipboard: " + err);
        showModal("Failed to copy emoji to clipboard: " + err, "is-danger");
      });
  }

  // Show modal
  function showModal(message, type = "is-success") {
    const modal = document.getElementById('notification-modal');
    const modalMessage = document.getElementById('notification-message');
    modalMessage.textContent = message;
    modal.classList.add('is-active');
    setTimeout(() => {
      modal.classList.remove('is-active');
    }, 1000);
  }

  // Add "Load More" and "Load Previous" buttons
  function addLoadButtons() {
    buttonsContainer.innerHTML = ''; // Clear previous buttons

    const loadPreviousButton = document.createElement('button');
    loadPreviousButton.textContent = 'Prev';
    loadPreviousButton.classList.add('button', 'is-danger', 'mr-2');
    loadPreviousButton.addEventListener('click', function() {
      currentPage--;
      renderEmojis(emojisData);
    });

    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Next';
    loadMoreButton.classList.add('button', 'is-primary');
    loadMoreButton.addEventListener('click', function() {
      currentPage++;
      renderEmojis(emojisData);
    });

    buttonsContainer.appendChild(loadPreviousButton);
    buttonsContainer.appendChild(loadMoreButton);

    // Enable/disable "Load Previous" button based on current page
    loadPreviousButton.disabled = (currentPage === 1);

    // Disable "Load More" button if there is no more data or no more pages
    loadMoreButton.disabled = emojisData.length === 0 || (currentPage * emojisPerPage >= emojisData.length);
  }
});