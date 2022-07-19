import { useId as _useId } from "react";


const useId = () => {
    return _useId().replaceAll(':', 'hzh');
};


export default useId;
