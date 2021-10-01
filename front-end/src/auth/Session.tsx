import React, { useEffect, FC } from "react";
import { useAppDispatch } from "../redux/hooks";
import { fetchSession } from "../redux/thunks/sessionThunks";

const Session: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSession(null));
  }, [dispatch]);

  return null;
};

export default Session;
