import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from "next/router";
import {Grid,ThemeProvider, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Switch, styled, FormControlLabel} from '@mui/material';
import hamburger from '../image/햄버거바.png';
import bookmark from '../image/bookmark-1.png';
import star from '../image/Star2.png';
import profile from '../image/profile.png';
import yj from '../image/율전_on.png';
import mr from '../image/명륜_off.png';
import { change_toggle, load_user } from '../actions/auth/auth';
import { load_favorite } from '../actions/favorite/favorite';
import theme from '../theme/theme';

//mbti프로필
import profile1 from '../image/mbti/프로필/기본.png';
import profile2 from '../image/mbti/프로필/식사.png';
import ENFJ from '../image/mbti/프로필/ENFJ.png';
import ENTP from '../image/mbti/프로필/ENTP.png';
import INFP from '../image/mbti/프로필/INFP.png';
import ENFP from '../image/mbti/프로필/ENFP.png';
import ISTJ from '../image/mbti/프로필/ISTJ.png';
import ISTP from '../image/mbti/프로필/ISTP.png';
import ISFP from '../image/mbti/프로필/ISFP.png';
import INTP from '../image/mbti/프로필/INTP.png';
import ESTJ from '../image/mbti/프로필/ESTJ.png';
import INFJ from '../image/mbti/프로필/INFJ.png';
import ENTJ from '../image/mbti/프로필/ENTJ.png';
import ESTP from '../image/mbti/프로필/ESTP.png';
import ESFJ from '../image/mbti/프로필/ESFJ.png';
import INTJ from '../image/mbti/프로필/INTJ.png';
import ISFJ from '../image/mbti/프로필/ISFJ.png';
import ESFP from '../image/mbti/프로필/ESFP.png';

export default function MapDrawer(openID){

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const dispatch = useDispatch();
    const router = useRouter();
    let open = false;
  
    if(typeof window !== 'undefined' && !isAuthenticated){
      router.push('/login');
    }
    
    //api
    const user = useSelector(state => state.auth.user);
    const favorites = useSelector(state => state.favorite.favorite);

    //state
    const [drawerOpen, setDrawerOpen] = useState(open);
    const [toggle, setToggle] = useState(user&&user.toggle);
    
    //뒤로가기 시 드로워 열리도록
    if(openID.open){
      open = true;
    }

    useEffect(()=>{
      if (dispatch && dispatch !== null && dispatch !== undefined) {
        dispatch(load_favorite());
        dispatch(load_user());
      }
    }, [dispatch]);

    useEffect(()=>{
      if ( user && user.toggle != null) {
        dispatch(load_user());
        dispatch(change_toggle(toggle));
      }
    }, [dispatch, toggle]);


    //drawer 열리는
    const handleDrawerClick = (bool) => (e) => {
      e.preventDefault();
      open = bool;
      setDrawerOpen(open);  
    };

    //drawer 하위 페이지로 이동
    const handleMove = (e) =>{
      router.push('/myFavorite');
    }

    //토글 클릭
    const handleToggle = (e) =>{
      dispatch(load_user());
        if( user && user.toggle == '명륜'){
          const prevUser = '명륜'
          setToggle((prevUser) => {
            const newUser = '율전';
            return newUser;
          });

        } else if(user && user.toggle == '율전'){
          const prevUser = '율전'
          setToggle((prevUser) => {
            const newUser = '명륜';
            return newUser;
          });

          }

    } 

    const list = (anchor) => (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerClick(false)}
          onKeyDown={handleDrawerClick(false)}
        >   
            <Box style={{ textAlign:'center', marginTop:'40px'}}>
                <Image src={ user && user.image ? src[user.image] : profile} alt='프로필' width={98} height={98} style={{borderRadius: "30px",}} />
                <div>
                <Typography style={{marginTop:'13px', fontSize:'15px', fontWeight:'700', lineHeight: '28px'}} >{user != null ? user.nickname : ''}</Typography>
                <Typography style={{marginTop:'13px', fontSize:'12px', fontWeight:'500', lineHeight: '28px'}} >{user != null ? user.major : ''}</Typography>
                </div>
            </Box>
            <List style={{marginLeft:'55px', marginTop:'54px'}}>
                <ListItem disablePadding >
                    <Grid container style={{fontSize:'20px', fontWeight:'400', lineHeight: '28px'}} >
                        <Grid item style={{marginRight:'9px'}}>
                            <Image src={bookmark} alt='즐겨찾기' width={16} height={16}/>
                        </Grid>
                        <Grid item>
                            <ListItemText primary="즐겨찾기 장소" style={{marginTop:'1px'}} onClick={handleMove} />  
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem disablePadding>
                    <Grid container style={{marginTop:'37px', fontSize: '20px', fontWeight:'400', lineHeight: '28px'}}>
                        <Grid item style={{marginRight:'9px',}}>
                            <Image src={star} alt='나의 리뷰' width={16} height={16} style={{marginTop:'0px'}}/>
                        </Grid>
                        <Grid item>
                            <ListItemText primary="나의 리뷰" style={{marginTop:'2px'}} onClick={handleMove}/>
                        </Grid>
                    </Grid>
                </ListItem>
            </List>
        </Box>
    );

    const src ={
      INFP:INFP,
      ENFJ:ENFJ,
      ENTP:ENTP,
      ENFP:ENFP,
      ISTJ:ISTJ,
      ISTP:ISTP,
      ISFP:ISFP,
      INTP:INTP,
      ESTJ:ESTJ,
      INFJ:INFJ,
      ENTJ:ENTJ,
      ESTP:ESTP,
      ESFJ:ESFJ,
      INTJ:INTJ,
      ISFJ:ISFJ,
      ESFP:ESFP,
    }

    return(
        <ThemeProvider theme={theme}>
            <Image src={hamburger} alt='drawer' onClick={handleDrawerClick(true)} width={20} height={15}/>
            <Drawer anchor='left' open={drawerOpen} onClose={handleDrawerClick(false)} width={250} >
              <Grid container style={{position:'relative'}}>
                <Grid item style={{marginTop:'45px', marginLeft:'70%'}} onClick={handleToggle}>
                  {user && <Image src={ toggle == '율전' ? yj: mr} width={60} height={60} />}
                </Grid>
              </Grid>
             
                {list('left')}
            </Drawer>
        </ ThemeProvider>
    )
}