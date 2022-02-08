import AttachFileIcon from '@mui/icons-material/AttachFile';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function DevInfo({ authorInitial, authorName, authorBio, authorImg, gitHub, linkedIn }) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {authorInitial}
          </Avatar>
        }
        title={authorName}
      />
      <CardMedia
        component="img"
        height="194"
        image={authorImg? authorImg : "https://source.unsplash.com/random"}
        alt={authorName}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {authorBio}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="github">
          <GitHubIcon onClick={() => window.open(gitHub, "_blank")} />
        </IconButton>
        <IconButton aria-label="linkedin">
          <LinkedInIcon onClick={() => window.open(linkedIn, "_blank")} />
        </IconButton>
        <IconButton aria-label="resume">
          <AttachFileIcon />
        </IconButton>
        <IconButton aria-label="portfolio">
          <ShareIcon />
        </IconButton>
        
      </CardActions>
    </Card>
  );
}
