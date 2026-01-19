type PictureCutProps = {
    isvisible: boolean;
    imgUrl: string[];
    setImgUrl: (value: string[]) => void;
    setIsVisible: (value: boolean) => void;
    studentId: string;
}
export default PictureCutProps;