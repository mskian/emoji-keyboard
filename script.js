document.addEventListener("DOMContentLoaded", function() {
  const emojisContainer = document.getElementById("emojis-container");
  const paginationContainer = document.getElementById("pagination");
  let emojisData = []; // Variable to store emojis data
  let currentPage = 1; // Variable to store the current page

  // Fetch emojis from server
  fetchEmojis();

  // Pagination settings
  const emojisPerPage = 8;
  const pagesPerSet = 4;

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
        renderPagination(emojisData.length);
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
    data.slice(startIndex, endIndex).forEach(emoji => {
      const emojiCard = createEmojiCard(emoji);
      emojisContainer.appendChild(emojiCard);
    });
  }

  // Create emoji card element
  function createEmojiCard(emoji) {
    const emojiCard = document.createElement("div");
    emojiCard.classList.add("column", "is-one-quarter-desktop", "is-one-third-tablet", "is-half-mobile", "is-flex", "is-justify-content-center");
    emojiCard.innerHTML = `
      <div class="card">
        <div class="card-content has-text-centered">
          <p class="emoji is-size-4">${emoji}</p>
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

  // Render pagination
  function renderPagination(totalEmojis) {
    const totalPages = Math.ceil(totalEmojis / emojisPerPage);
    paginationContainer.innerHTML = '';
    const totalPagesSets = Math.ceil(totalPages / pagesPerSet);
    let startPage = (Math.ceil(currentPage / pagesPerSet) - 1) * pagesPerSet + 1;
    let endPage = Math.min(startPage + pagesPerSet - 1, totalPages);
    if (startPage !== 1) {
      const prevPageLink = createPaginationLink(startPage - 1, '⬅');
      paginationContainer.appendChild(prevPageLink);
    }
    for (let i = startPage; i <= endPage; i++) {
      const pageLink = createPaginationLink(i);
      paginationContainer.appendChild(pageLink);
    }
    if (endPage !== totalPages) {
      const nextPageLink = createPaginationLink(endPage + 1, '➡');
      paginationContainer.appendChild(nextPageLink);
    }
  }

  // Create pagination link
  function createPaginationLink(pageNumber, text = '') {
    const pageLink = document.createElement('a');
    pageLink.classList.add('pagination-link');
    pageLink.textContent = text !== '' ? text : pageNumber;
    pageLink.addEventListener('click', function() {
      currentPage = pageNumber;
      renderEmojis(emojisData);
      renderPagination(emojisData.length);
    });
    return pageLink;
  }
});