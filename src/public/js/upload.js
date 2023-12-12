document.querySelector('.fileForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const fileType = document.getElementById('fileType').value;
    const formData = new FormData(this); 
    formData.append('fileType', fileType); 

    try {
        const response = await fetch(`/api/users/:uid/documents`, {
            method: 'POST',
            body: formData 
        });
        // const data = await response.json();
        // console.log("data",data);
        if (response.ok) {
            console.log('File uploaded successfully');
        } else {
            console.error('File upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});