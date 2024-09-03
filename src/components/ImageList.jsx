import React, { useState } from 'react';
import { Box, List, ListItem, IconButton, CardMedia, Paper, Typography } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';

function ImageUploadList() {
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const newImages = Array.from(event.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Paper elevation={3} 
    style={{ padding: '16px', marginTop: '16px' }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      />
      {images.length > 0 ? (
        <List>
          {images.map((image, index) => (
            <ListItem key={index}
             divider
style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
    <Box sx={{display:"flex", alignItems:"center"}}>          <CardMedia
                component="img"
                image={image.url}
                alt={`Uploaded preview ${index}`}
                style={{ width: '100px', height: '100px', marginRight: '16px', objectFit:"contain" }}
              />
              <Typography variant="body2">{image.file.name}</Typography></Box>
              <IconButton edge="end" 
              onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box textAlign="center">
          <ImageIcon style={{ fontSize: 50, color: 'gray' }} />
          <Typography variant="body2"
           color="textSecondary">
            No images uploaded
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ImageUploadList;
