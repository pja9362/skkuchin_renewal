import Image from 'next/image';

import DEFAULT1 from '../../image/mbti/profile/mainCharacter.png';
import DEFAULT2 from '../../image/mbti/profile/mealCharacter.png';
import INTP from '../../image/mbti/profile/INTP.png';
import INTJ from '../../image/mbti/profile/INTJ.png';
import INFJ from '../../image/mbti/profile/INFJ.png';
import INFP from '../../image/mbti/profile/INFP.png';
import ISFJ from '../../image/mbti/profile/ISFJ.png';
import ISFP from '../../image/mbti/profile/ISFP.png';
import ISTJ from '../../image/mbti/profile/ISTJ.png';
import ISTP from '../../image/mbti/profile/ISTP.png';
import ESTJ from '../../image/mbti/profile/ESTJ.png';
import ESTP from '../../image/mbti/profile/ESTP.png';
import ESFJ from '../../image/mbti/profile/ESFJ.png';
import ESFP from '../../image/mbti/profile/ESFP.png';
import ENFJ from '../../image/mbti/profile/ENFJ.png';
import ENFP from '../../image/mbti/profile/ENFP.png';
import ENTJ from '../../image/mbti/profile/ENTJ.png';
import ENTP from '../../image/mbti/profile/ENTP.png';

export const displayProfile= (profile, imageWidth, imageHeight) => {

    switch(profile) {
        case "DEFAULT1":
            return <Image id={"DEFAULT1"} src={DEFAULT1} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "DEFAULT2":
            return <Image id={"DEFAULT2"} src={DEFAULT2} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "INTP":
            return <Image id={"INTP"} src={INTP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "INTJ":
            return <Image id={"INTJ"} src={INTJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "INFP":
            return <Image id={"INFP"} src={INFP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "INFJ":
            return <Image id={"INFJ"} src={INFJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ISFP":
            return <Image id={"ISFP"} src={ISFP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ISFJ":
            return <Image id={"ISFJ"} src={ISFJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ISTP":
            return <Image id={"ISTP"} src={ISTP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ISTJ":
            return <Image id={"ISTJ"} src={ISTJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ESTJ":
            return <Image id={"ESTJ"} src={ESTJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ENTP":
            return <Image id={"ENTP"} src={ENTP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ENTJ":
            return <Image id={"ENTJ"} src={ENTJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ENFP":
            return <Image id={"ENFP"} src={ENFP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ENFJ":
            return <Image id={"ENFJ"} src={ENFJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ESFP":
            return <Image id={"ESFP"} src={ESFP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ESFJ":
            return <Image id={"ESFJ"} src={ESFJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ESTP":
            return <Image id={"ESTP"} src={ESTP} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        case "ESTJ":
            return <Image id={"ESTJ"} src={ESTJ} width={imageWidth} height={imageHeight} style={{zIndex: '-1'}}/>
        default:
            return null;
    }
}