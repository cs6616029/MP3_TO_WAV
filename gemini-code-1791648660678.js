const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `${req.file.filename}.wav`);

  ffmpeg(inputPath)
    .toFormat('wav')
    .audioCodec('pcm_s16le')
    .audioChannels(2)
    .audioFrequency(44100)
    .on('end', () => {
      res.download(outputPath, 'converted.wav', (err) => {
        // ลบไฟล์ชั่วคราวหลังดาวน์โหลดเสร็จ
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Conversion error');
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    })
    .save(outputPath);
});

app.listen(3000, () => console.log('Server running on port 3000'));