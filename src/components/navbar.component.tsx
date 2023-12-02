import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', padding: '0px !important' }}>
        <Typography variant="h4" fontWeight={'bold'}>
          <Link href={'/'} style={{ textDecoration: 'none', color: 'white' }}>
            TEEMIO
          </Link>
        </Typography>

        <Box display={'flex'} alignItems={'center'} width={'100%'} justifyContent={'flex-end'} gap={2}>
          <Link href={'/konceptet'}>
            <Button type="button" variant="text" sx={{ color: 'white' }}>
              OM KONCEPTET
            </Button>
          </Link>
          <Link href={'/kontaktos'}>
            <Button type="button" variant="text" sx={{ color: 'white' }}>
              KONTAKT OS
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
