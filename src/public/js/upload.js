document.querySelector('.fileForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const fileForm = document.querySelector('.fileForm');
  const fileType = document.getElementById('fileType').value;
  const fileInput = document.querySelector('input[type="file"]');
  const uid = fileForm.dataset.uid;
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  fetch(`/api/users/${uid}/documents`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
});