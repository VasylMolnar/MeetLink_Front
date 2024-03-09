import { useMemo } from "react";

const useSort = (searchValue: string, meets: any) => {
  return useMemo(() => {
    return meets.filter(
      (meet: any) =>
        meet.meetName.toLowerCase().includes(searchValue.toLowerCase()) ||
        meet.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, meets]);
};

export default useSort;
