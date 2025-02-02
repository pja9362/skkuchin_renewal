import React from 'react';
import { displayMBTI } from '../Matching/MBTIList';
import { Grid, Typography } from '@mui/material';

const FriendItem = ({ candidate }) => {
    return (
        <Grid container sx={{columnGap: '15px', p:'15px 24px'}}>
            <div>
                { displayMBTI(candidate.mbti, 100, 100) }
            </div>
            <div style={{flex: 1}}>
                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography sx={{fontSize: '18px', fontWeight: '700', mr: '5px'}}>{candidate !== null && candidate.nickname}</Typography>
                    {
                        candidate !== null && 
                            candidate.campus == '명륜' ?
                            <Typography sx={{width: 'max-content',color: '#FFAC0B', backgroundColor: '#FFFCE4', fontSize: '12px', fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{candidate.campus}</Typography>
                            : 
                            <Typography sx={{color: '#58C85A', backgroundColor: '#DCF8DB', fontSize: '12px',fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{candidate.campus}</Typography>
                    }
                </Grid>
                <Grid item sx={{display: 'flex', fontSize: '12px', alignItems: 'center', fontWeight: 500, color: '#777777', p: '1.5px 0'}}>
                    <Grid item sx={{flexGrow: 1, fontSize: '12px'}}>
                        {candidate.major}&nbsp;/&nbsp; 
                        {candidate.student_id}학번&nbsp;/&nbsp; 
                        {(candidate.gender).charAt(0)}
                    </Grid>
                </Grid>
                <Grid item sx={{display: 'flex', p: '3px 0 8px', gap: '4px'}}>
                    <Grid item sx={{color: '#777777', backgroundColor: '#F2F2F2', p: '4px 12px', fontSize: '12px', fontWeight: 400, borderRadius: '24px'}}>
                        {candidate.mbti}
                    </Grid>
                    {
                        (candidate.keywords) != null &&
                            <>
                                {(Object.values(candidate.keywords).flat().slice(0, 2).map((keyword, index) => (
                                    <Grid item key={index} sx={{color: '#777777', backgroundColor: '#F2F2F2', p: '4px 12px', fontSize: '12px', fontWeight: 400, borderRadius: '24px'}}>
                                        {keyword}
                                    </Grid>
                                )))}
                            </>
                    }
                </Grid >
                {/* <Typography sx={{ fontSize: '13px', height: '36px', lineHeight: '18px', fontWeight: 600, color: '#3C3C3C', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2}}> */}
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#3c3c3c', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2}}>
                    {'"'+ candidate.introduction +'"'}
                </Typography>
            </div>
        </Grid>
    )
}

export default FriendItem;