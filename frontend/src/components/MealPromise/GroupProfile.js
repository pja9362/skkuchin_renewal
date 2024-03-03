import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Button, Divider } from '@mui/material';
import { displayMBTI } from "../Matching/MBTIList";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { clear_candidate_profile, load_candidate_profile } from '../../actions/groupProfile/groupProfile';
import { Loading } from '../Loading';

const GroupProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const id = router.query.id;
    const group = useSelector(state => state.groupProfile.candidateGroup);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(clear_candidate_profile());

        if(id) {
            dispatch(load_candidate_profile(id, ([result, message]) => {
                if (result) {
                    console.log("그룹 프로필 불러오기 성공");
                    setLoading(false);
                } else {
                    console.log("그룹 프로필 불러오기 오류" + message);
                }
            }));
        }
    }, [id]);

    const handleSubmit = () => {
        console.log("밥약 신청하기 버튼 클릭");
        router.push('/selectMyGroupProfile')
    }

    if (id === undefined || group === null) return <Loading />;

    return (
        <>
            <div style={{padding: '19px 0 16px', textAlign: 'center'}}>
                {displayMBTI('GROUP', 120, 120)}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '18px', fontWeight: '700', mr: '5px'}}>{group !== null && group.group_name}</Typography>
                    <Typography sx={{p: '3px 7px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', backgroundColor:  (group.gender).charAt(0) === '여' ? '#FFF4F9' : '#E8F9FF', color: (group.gender).charAt(0) === '여' ? '#FAA4C3' : '#83B6F2'}}>
                        {(group.gender).charAt(0)}
                    </Typography>
                </div>
                <Typography sx={{ fontSize: '13px', mt: '20px', height: '36px', lineHeight: '18px', fontWeight: 400, color: '#3C3C3C', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                    {'"'+ group.group_introduction +'"'}
                </Typography>
                {
                    group.meeting_start_date !== null && group.meeting_end_date !== null &&
                    <Typography sx={{fontSize: '12px', color: '#777777', fontWeight: 'bold', mb: '20px', backgroundColor: '#FBFBFB', border: '1px solid #E2E2E2', borderRadius: '12px', padding: '4px 10px', width: 'max-content', margin: 'auto'}}>
                        선호 일정 : {group.meeting_start_date} ~ {group.meeting_end_date}
                    </Typography>
                }
            </div>

            <div style={{ margin: '0 24px', borderTop: '1px solid #E2E2E2', paddingTop: '9px' }}>
            <List>
                {[1, 2, 3].map((friendIndex) => (
                <ListItem key={friendIndex} disablePadding>
                    <ListItemText
                      primary={
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: '6px' }}>
                        {friendIndex === 1 &&
                            <Typography sx={{ color: '#FFAC0B', backgroundColor: '#FFFCE4', fontSize: 16, fontWeight: 600, p: '8px 10px', borderRadius: '12px', marginBottom: '8px' }}>
                            대표
                            </Typography>
                        }
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#3C3C3C', mb: '8px' }}>
                            {`친구${friendIndex}`} 
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#777777', mb: '8px' }}>
                            {`${group[`friend${friendIndex}_major`]} / ${group[`friend${friendIndex}_student_id`]}`}
                        </Typography>
                        </div>
                    }
                      secondary={<Typography sx={{ fontSize: '16px', backgroundColor: '#FBFBFB', p: '10px 17px', border: '1px solid #E2E2E2', borderRadius: '0 8px 8px 8px', mb: '12px' }}>{group[`friend${friendIndex}_introduction`]}</Typography>}
                    />
                </ListItem>
                ))}
            </List>
            </div>
            <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disableElevation
                sx={{ color: '#fff', fontSize: 16, fontWeight: 800, position: 'fixed', bottom: 30, left: 24, right: 24, borderRadius: '12px', p: '16px'}}
            >
                밥약 신청하기
            </Button>

            { loading && <Loading />}
        </>
    )
}

export default GroupProfile;