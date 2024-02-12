import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"; 
import { Button, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Grid, Divider } from '@mui/material';
import { displayMBTI } from './MBTIList';
import { load_candidate } from '../../actions/candidate/candidate'
import { load_request_id, request_chat } from '../../actions/chat/chatRoom';
import noCharacter from '../../image/mbti/profile/noCharacter.png'
import { useRouter } from 'next/router';
import Image from 'next/image';
import CustomPopup from "../SkkuChat/CustomPopup";
import CustomPopupNoBtn from "../SkkuChat/CustomPopupNoBtn";
import GoLogin from "../GoLogin";

const dummyProfiles = [
    {
        groupName: '그룹명1',
        gender: '여',
        mbti: 'ENFJ',
        introduction:
            '그룹 한줄 소개입니다',
    },
    {
        groupName: '그룹명2',
        gender: '남',
        mbti: 'ISFP',
        introduction:
            '긴 그룹 한줄 소개 입니다. 긴 그룹 한줄 소개 입니다. 긴 그룹 한줄 소개 입니다. 👀',
    },
    {
        groupName: '그룹명3',
        gender: '남',
        mbti: 'ENFP',
        introduction:
            '그룹 한줄 소개입니다 👀',
    },

];
  
const Groups = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector(state => state.matchingUser.matchingUser);
    const requestId = useSelector(state => state.chatRoom.requestId);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isLogin, setIsLogin] = useState(false);
    // 그룹 프로필 등록 여부
    const [isGroupProfileEnrolled, setIsGroupProfileEnrolled] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(load_request_id(([result, message]) => {
                if (result) {
                    dispatch(load_candidate());
                }
            }))
        }
    }, [isAuthenticated]);

    const [open, setOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const [isPopupMessageOpen, setIsPopupMessageOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleOpen = (id) => {
        setOpen(true);
        setSelectedGroupId(id);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleSubmit = (id) => {
        setOpen(false);
        dispatch(request_chat(id));

        setPopupMessage('신청이 완료되었습니다!');
        setIsPopupMessageOpen(true);
    }
    
    const handleSettingOpen = () => {
        if (isAuthenticated) {
            router.push({
                pathname: '/makeProfile',
                query: { src : '스꾸챗프로필설정', }
            });
        } else {
            setIsLogin(true);
        }
    }

    const handleFriendClick = (friendId) => {
        router.push(`/clickProfile?id=${friendId}`);
    };

    return (
        <Grid container sx={{overflowX: 'auto', flexWrap: 'nowrap', p: '0px', m: '0'}}>
            {isLogin && <GoLogin open={isLogin} onClose={setIsLogin} /> }
            { isGroupProfileEnrolled ? 
            dummyProfiles.map((group, index) => (
            <Card key={index} variant="outlined" sx={{height: 'max-content', width: '242px', borderRadius: '10px', border: '1px solid #E2E2E2', p: '20px', flexShrink: 0, mr: '19px', mb: '21px'}}>
                <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                    {displayMBTI(group.mbti, 90, 90)}
                    <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: '20px 0px 8px'}}>
                        <Typography sx={{fontSize: '20px', fontWeight: '700', mr: '5px'}}>{group !== null && group.groupName}</Typography>
                        <Typography sx={{p: '3px 7px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', backgroundColor: (group.gender).charAt(0) === '여' ? '#FFF4F9' : '#E8F9FF', color: (group.gender).charAt(0) === '여' ? '#FAA4C3' : '#83B6F2'}}>
                            {(group.gender).charAt(0)}
                        </Typography>
                    </Grid>
                    <Typography sx={{ fontSize: '14px', height: '40px', lineHeight: '20px', fontWeight: 400, color: '#3C3C3C', m: '20px 0 30px', textAlign: 'center', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                        {'"'+ group.introduction +'"'}
                    </Typography>
                    <Grid item sx={{ display: 'flex',  alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                        <Button
                            disableElevation
                            disableTouchRipple
                            key="profile-button"
                            onClick={() => handleFriendClick(group.id)}
                            sx={{
                                color: '#777777',
                                fontSize: '14px',
                                fontWeight: 700,
                                textAlign: 'center',
                                pr: '15px',
                            }}
                        >
                            그룹 프로필
                        </Button>
                        <div
                            style={{
                                width: '2px',
                                height: '12px', 
                                backgroundColor: '#E2E2E2',
                                borderRadius: '10px',
                            }}
                        />
                        {requestId && requestId.includes(group.id) ? (
                            <Button
                                disableElevation
                                disableTouchRipple
                                key="completed-button"
                                sx={{
                                    color: '#505050',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    pl: '15px',
                                }}
                            >
                                신청 완료
                            </Button>
                        ) : (
                            <Button
                                disableElevation
                                disableTouchRipple
                                key="apply-button"
                                onClick={() => handleOpen(group.id)}
                                sx={{
                                    color: '#FFAC0B',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    pl: '15px',
                                }}
                            >
                                밥약 걸기
                            </Button>
                        )}
                    </Grid>
                    <CustomPopup
                        open={open}
                        onClose={handleClose}
                        content={`밥약 신청을 하시겠어요?`}
                        leftButtonLabel="아니요"
                        rightButtonLabel="신청"
                        onLeftButtonClick={handleClose}
                        onRightButtonClick={() => {
                            handleSubmit(selectedGroupId);
                        }}
                    />

                    <CustomPopupNoBtn
                        open={isPopupMessageOpen}
                        onClose={() => setIsPopupMessageOpen(false)}
                        content={popupMessage}
                    />
                </Grid>
            </Card> 
            )) 
            :
            <>
                { dummyProfiles.length !== 0 &&
                    dummyProfiles.map((group, index) => (
                    <Card key={index} variant="outlined" sx={{height: 'max-content', width: '242px', borderRadius: '10px', border: '1px solid #E2E2E2', p: '15px', flexShrink: 0, mr: '19px', mb: '21px'}}>
                        <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image src={noCharacter} width={80} height={80} placeholder="blur" layout='fixed' />
                            <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: '20px 0px 8px'}}>
                                <Typography sx={{fontSize: '20px', fontWeight: '700', mr: '5px'}}>{group !== null && group.groupName}</Typography>
                                <Typography sx={{p: '3px 7px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', backgroundColor: (group.gender).charAt(0) === '여' ? '#FFF4F9' : '#E8F9FF', color: (group.gender).charAt(0) === '여' ? '#FAA4C3' : '#83B6F2'}}>
                                    {(group.gender).charAt(0)}
                                </Typography>
                            </Grid>
                            <Grid item sx={{width: '169px', textAlign: 'center', pb: '8px'}}>
                                <Typography sx={{ fontSize:'13px', fontWeight: '500', whiteSpace: 'pre-wrap'}}>
                                    {
                                        user?.matching === false ?
                                        '성대 학우와 채팅을 나누시려면\n\n[마이페이지]에서\n매칭 ON/OFF 버튼을 켜주세요 👀' 
                                        : '성대 학우와 채팅을 나누시려면 매칭 프로필을 등록해주세요 👀'
                                    }
                                </Typography>
                            </Grid>
                            {
                                user?.matching === false ? null
                                :
                                <Button onClick={()=>handleSettingOpen()}  sx={{backgroundColor: '#FFCE00', borderRadius: '30px', color: '#fff', fontSize: '12px', fontWeight: '700', textAlign: 'center', p: '8.5px 11.5px', m : '5px 0px'}}>
                                    프로필 등록하기
                                </Button>
                            }
                        </Grid>
                    </Card>
                ))}
            </>
            }
    </Grid>
    )
}

export default Groups;