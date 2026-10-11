const formData = new FormData();
formData.append('audio', fileInputElement.files[0]);

const response = await fetch('http://localhost:3000/convert', {
  method: 'POST',
  body: formData
});
const blob = await response.blob();
const downloadUrl = window.URL.createObjectURL(blob);