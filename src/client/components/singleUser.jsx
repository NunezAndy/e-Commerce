import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from "react";
import NavBar from "./navBar";
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
        S'More Gear (T Bergin, J Browning, F Burton, C Bullock, A Nunez)
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

async function fetchSingleUser(id) {
  console.log(id);
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function fetchUserID(id) {
  console.log(id);
  try {
      const response = await fetch (`http://localhost:3000/api/products/userid/${id}`);
      const result = await response.json();
      console.log(result);
      return result
  } catch (error) {
      console.log(error);
  }
}


export default function SingleUser() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useState("");
  const [error, setError] = useState(null);

  const {id} = useParams();
  console.log(id);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/users");
  }

 useEffect(() => {
  async function getSingleUser() {
    const response = await fetchSingleUser(id);
    console.log("response", response);
    setUser(response);
  }
  getSingleUser()
 }, [])

 useEffect(() => {
  async function getProductsByUserID(id) {
    const response = await fetchUserID(id);
    console.log("response", response);
    setProducts(response);
  }
  getProductsByUserID(id)
 }, [])

 const displayedProducts = searchParams ? products.filter((products) =>
products.name.toLowerCase().includes(searchParams)
) : products;

console.log("displayed products", displayedProducts);
console.log("all products", products);
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavBar />

      <main>
        {/* Hero unit */}
        <Typography variant="h1" component="h1" sx={{paddingTop: "20px", textAlign: 'center', fontSize: "3rem"}}>
                      {user.name}<br />
                      {user.email}
                    </Typography>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
       
            <div className="searchBar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign:"center"}}>
  <label>
    Search <br />
    <input
      type="text"
      placeholder="search"
      onChange={(e) => setSearchParams(e.target.value.toLowerCase())}
    />
  </label>
</div>


          </Container>
        </Box>
       
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {!error && displayedProducts.map((products) => (
              <Grid item key={products} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={products.image_path ? products.image_path : 'https://ik.imagekit.io/smoregear/woman%20hiking.jpg?updatedAt=1700852561792'}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {products.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={`/products/${products.id}`}>More Details</Button>
                   
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
         S'More Gear
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Buy and sell everything you need for the great outdoors!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}