import React, { FC, useEffect } from "react";
import Map from "./components/map/Map";
import PostsDrawer from "./components/postDrawer/Drawer";
import AvatarButton from "./components/AvatarButton";
import { fetchLocations } from "../../redux/thunks/locationsThunks";
import { fetchCategories } from "../../redux/thunks/categoriesThunks";
import { fetchPostsForLocation } from "../../redux/thunks/postsThunks";
import { RootState } from "../../redux/store";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const filterTags = useAppSelector((state) => state.categories.filterTags);
  const openLocation: number | null = useAppSelector(
    (state: RootState) => state.locations.openId
  );

  useEffect(() => {
    dispatch(fetchLocations(null));
    dispatch(fetchCategories(0));
  }, [dispatch]);

  useEffect(() => {
    if (openLocation)
      dispatch(
        fetchPostsForLocation({ locId: openLocation, offset: -1, filterTags })
      );
  }, [openLocation, dispatch, filterTags]);

  return (
    <>
      <AvatarButton />
      <Map />
      <PostsDrawer />
    </>
  );
};

export default HomePage;
